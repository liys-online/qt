import bluetoothManager from '@ohos.bluetoothManager';
import HashMap from '@ohos.util.HashMap';
import { QtBluetoothGattService } from './QtBluetoothGattService'
import { QtBluetoothGattServerCallback } from './QtBluetoothGattServerCallback'

export class QtBluetoothGattServer {
  private gattServer : bluetoothManager.GattServer;
  private qtObject : number;
  private services : HashMap<string, QtBluetoothGattService>;
  private devices : Array<string> = [];
  private deviceId : string = '';
  private callback : QtBluetoothGattServerCallback;

  constructor() {
    this.services = new HashMap();
  }

  setQtObject(qtObject: number) {
    this.qtObject = qtObject;
  }

  getQtObject() : number {
    return this.qtObject;
  }

  server() : bluetoothManager.GattServer {
    return this.gattServer;
  }

  addDevice(deviceId: string) {
    if (this.devices.indexOf(deviceId) == -1)
      this.devices.push(deviceId)
    this.deviceId = deviceId;
  }

  connectServer() : boolean {
    if (this.gattServer)
      return true;
    this.gattServer = bluetoothManager.BLE.createGattServer();
    return true;
  }

  disconnectServer() : boolean {
    if (!this.gattServer)
      return;

    this.callback.stop();
    this.gattServer.close();
    this.callback = null;
    this.gattServer = null;
    globalThis.qtbluetooth.connectChanged(this.qtObject, 0 /*NoError*/, 0 /*QLowEnergyController::UnconnectedState*/);
    return true;
  }

  startAdvertising(advertiseData : object, scanResponse : object, advertiseSettings : object) : boolean {
    if (!this.connectServer()) {
      console.error("Server::startAdvertising: Cannot open GATT server");
      return false;
    }
    this.callback = new QtBluetoothGattServerCallback(this);
    this.callback.start();

    if (!this.gattServer)
      return false;

    console.log("Starting to advertise.", JSON.stringify(advertiseData), JSON.stringify(scanResponse), JSON.stringify(advertiseSettings));
    try {

      let _settings : bluetoothManager.AdvertiseSetting  = {
        interval:advertiseSettings["maximumInterval"],
        connectable:advertiseSettings["connectable"],
      }

      let _advertiseData : bluetoothManager.AdvertiseData = {
        serviceUuids: advertiseData["serviceUuids"],
        manufactureData:[],
        serviceData:[],
        includeDeviceName: advertiseData["includeDeviceName"]
      }

      if (advertiseData.hasOwnProperty("manufacturerId") && advertiseData.hasOwnProperty("manufacturerData")) {
        let manufacturerData : bluetoothManager.ManufactureData;
        manufacturerData.manufactureId = advertiseData["manufacturerId"];
        manufacturerData.manufactureValue = advertiseData["manufacturerData"];
        _advertiseData.manufactureData.push(manufacturerData)
      }

      let _scanResponse : bluetoothManager.AdvertiseData = {
        serviceUuids: scanResponse["serviceUuids"],
        manufactureData:[],
        serviceData:[]
      }
      if (scanResponse.hasOwnProperty("manufacturerId") && scanResponse.hasOwnProperty("manufacturerData")) {
        let manufacturerData : bluetoothManager.ManufactureData;
        manufacturerData.manufactureId = scanResponse["manufacturerId"];
        manufacturerData.manufactureValue = scanResponse["manufacturerData"];
        _scanResponse.manufactureData.push(manufacturerData)
      }
      this.gattServer.startAdvertising(_settings, _advertiseData, _scanResponse);
      return true;
    } catch (err) {
      console.error("startAdvertising errCode:" + err.code + ",errMessage:" + err.message);
      globalThis.qtbluetooth.advertisementError(this.qtObject, err.message);
      return false;
    }
  }

  stopAdvertising() : void
  {
    if (!this.gattServer)
      return;

    try {
      this.gattServer.stopAdvertising();
      console.log("Advertisement stopped.");
    } catch (err) {
      console.error("stopAdvertising errCode:" + err.code + ",errMessage:" + err.message);
    }
  }

  createService(service: string, uuid: string, isPrimary: boolean) : boolean {
    if (this.services.hasKey(service))
      return false;
    let s : QtBluetoothGattService = new QtBluetoothGattService(uuid, isPrimary);
    this.services.set(service, s);
    Reflect.defineProperty(globalThis, service, {value: s});
    this.addIncludeService(service);
    return true;
  }

  addIncludeService(service: string) : boolean {
    if (!this.connectServer()) {
      console.log("Server::addService: Cannot open GATT server");
      return false;
    }
    if (!this.services.hasKey(service))
      return false;
    this.gattServer.addService(this.services.get(service).service());
    return true;
  }

  getCharacteristic(serviceUuid: string, charUuid: string) : bluetoothManager.BLECharacteristic {
    for (let item of this.services) {
      let c = item[1].service().characteristics;
      for (let i = 0 ; i < c.length; ++i) {
        if (c[i].serviceUuid == serviceUuid && c[i].characteristicUuid == charUuid)
          return c[i];
      }
    }
    return null
  }

  getDescriptor(serviceUuid: string, charUuid: string, descUuid: string) : bluetoothManager.BLEDescriptor {
    for (let item of this.services) {
      let c = item[1].service().characteristics;
      for (let i = 0 ; i < c.length; ++i) {
        let d = c[i].descriptors;
        for (let j = 0; j < d.length; ++j) {
          if (d[j].serviceUuid == serviceUuid
            && d[j].characteristicUuid == charUuid
            && d[j].descriptorUuid == descUuid) {
            return d[j];
          }
        }
      }
    }
    return null
  }

  writeCharacteristic(service: string, uuid: string, value: ArrayBuffer) : boolean {
    console.log("writeCharacteristic", service, uuid);
    if (!this.services.hasKey(service))
      return false;
    let s = this.services.get(service);
    let gattService = s.service();
    let foundChar : bluetoothManager.BLECharacteristic = null;
    let cArray : Array<bluetoothManager.BLECharacteristic> = gattService.characteristics;
    for (let i = 0; i < cArray.length; ++i) {
      let c = cArray[i];
      if (c.characteristicUuid == uuid && foundChar == null) {
          foundChar = c;
          // don't break here since we want to check next condition below on next iteration
      } else if (c.characteristicUuid == uuid) {
          console.error("Found second char with same UUID. Wrong char may have been selected.");
          break;
      }
    }

    if (foundChar == null) {
        console.error("writeCharacteristic: update for unknown characteristic failed");
        return false;
    }

    foundChar.characteristicValue = value;
    this.sendNotificationsOrIndications(foundChar);

    return true;
  }

  sendNotificationsOrIndications(characteristic: bluetoothManager.BLECharacteristic) : void {
    if (!this.gattServer)
      return;
    for (let i = 0; i < this.devices.length; ++i) {
      let notifyCharacteristic = {
        serviceUuid: characteristic.serviceUuid,
        characteristicUuid: characteristic.characteristicUuid,
        characteristicValue: characteristic.characteristicValue,
        confirm: false
      };
      this.gattServer.notifyCharacteristicChanged(this.devices[i], notifyCharacteristic);
    }
  }

  writeDescriptor(service: string, charUuid: string, descUuid: string, value: ArrayBuffer) : boolean {
    if (!this.services.hasKey(service))
      return false;
    let s = this.services.get(service);
    let gattService = s.service();
    let foundDesc : bluetoothManager.BLEDescriptor = null;
    let foundChar : bluetoothManager.BLECharacteristic = null;
    let cArray : Array<bluetoothManager.BLECharacteristic> = gattService.characteristics;
    for (let i = 0; i < cArray.length; ++i) {
      let c = cArray[i];
      if (c.characteristicUuid == charUuid && foundChar == null) {
        foundChar = c;
        // don't break here since we want to check next condition below on next iteration
      } else if (c.characteristicUuid == charUuid) {
        console.error("Found second char with same UUID. Wrong char may have been selected.");
        break;
      }
    }

    for (let i = 0; i < foundChar.descriptors.length; ++i) {
      let d = foundChar.descriptors[i];
      if (d.descriptorUuid == descUuid) {
        foundDesc = d;
        break;
      }
    }

    if (foundChar == null || foundDesc == null) {
      console.error("writeDescriptor: update for unknown char or desc failed (" + foundChar + ")");
      return false;
    }

    foundDesc.descriptorValue = value;
    return true;
  }

  remoteName() : string {
    return bluetoothManager.getRemoteDeviceName(this.deviceId);
  }

  remoteAddress() : string {
    return this.deviceId;
  }
}