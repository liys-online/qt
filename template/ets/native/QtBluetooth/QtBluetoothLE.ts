import bluetoothManager from '@ohos.bluetoothManager';
import HashMap from '@ohos.util.HashMap';
import LinkedList from '@ohos.util.LinkedList';

export class ConnectionState {
  static STATE_CONNECTING = 1;
  static STATE_CONNECTED = 2;
  static STATE_DISCONNECTING = 3;
  static STATE_DISCONNECTED = 4;
}

enum GattEntryType
{
  Service, Characteristic, CharacteristicValue, Descriptor
};

class GattEntry
{
  type : GattEntryType;
  valueKnown : boolean = false;
  service: bluetoothManager.GattService = null;
  characteristic : bluetoothManager.BLECharacteristic = null;
  descriptor : bluetoothManager.BLEDescriptor = null;
  endHandle : number = -1;
  associatedServiceHandle : number;
}

export class QtBluetoothLE {

  private address = null;
  private qtObject;
  private gattClient : bluetoothManager.GattClientDevice = null;
  private state : ConnectionState = ConnectionState.STATE_DISCONNECTED;
  private entries : GattEntry[] = [];
  private uuidToEntry : HashMap<string, Array<number>>;
  private servicesToBeDiscovered : LinkedList<number>;

  constructor(address) {
    this.address = address;
    this.uuidToEntry = new HashMap();
    this.servicesToBeDiscovered = new LinkedList();
  }

  setQtObject(qtObject) {
    this.qtObject = qtObject;
  }

  private onBLEConnectionStateChange() {
    if (!this.gattClient) {
      return;
    }
    try {
      this.gattClient.on('BLEConnectionStateChange', async (data: bluetoothManager.BLEConnectChangedState) => {
        let deviceId: string = data.deviceId;
        let state: bluetoothManager.ProfileConnectionState = data.state;
        if (data) {
          if (state === bluetoothManager.ProfileConnectionState.STATE_CONNECTED) {
            try {
              // Starts discovering services.
              this.state = ConnectionState.STATE_CONNECTED;
              globalThis.qtbluetooth.connectChanged(this.qtObject, 3, 0);
            } catch (err) {
              globalThis.qtbluetooth.connectChanged(this.qtObject, 0, 5);
              console.error("onBLEConnectionStateChange: err =", err);
            }
          } else if (state === bluetoothManager.ProfileConnectionState.STATE_DISCONNECTED) {
            this.resetData();
             if (this.state === ConnectionState.STATE_CONNECTED || this.state === ConnectionState.STATE_DISCONNECTING) {
              console.log("onBLEConnectionStateChange: Disconnected from GATT server.");
              globalThis.qtbluetooth.connectChanged(this.qtObject, 0, 0);
              this.close();
            }
          }
        }
      })
    } catch (err) {
      globalThis.qtbluetooth.connectChanged(this.qtObject, 0, 1);
    }
  }

  connect() : boolean {
    try {
      this.gattClient = bluetoothManager.BLE.createGattClientDevice(this.address);
      this.state = ConnectionState.STATE_CONNECTING;
      this.onBLEConnectionStateChange();
      this.onBLECharacteristicChange();
      this.gattClient.connect();
      return true;
    } catch (error) {
      console.error("connect errCode:" + error.code + ",errMessage:" + error.message);
      return false;
    }
  }

  private offBLEConnectionStateChange() {
    if (!this.gattClient) {
      return;
    }
    try {
      this.gattClient.off('BLEConnectionStateChange');
    } catch (err) {
      console.error("offBLEConnectionStateChange: err =", err);
    }
  }

  private onBLECharacteristicChange() {
    if (!this.gattClient) {
      return;
    }
    try {
      this.gattClient.on('BLECharacteristicChange', async (data: bluetoothManager.BLECharacteristic) => {
        let handle = -1;
        for (let i = 0; i < this.entries.length; ++i) {
          let e = this.entries[i];
          if (e.type != GattEntryType.Characteristic)
            continue;
          if (e.characteristic.characteristicUuid == data.characteristicUuid) {
            handle = i;
            break;
          }
        }
        if (handle == -1) {
          console.warn("onCharacteristicChanged: cannot find handle");
          return;
        }
        globalThis.qtbluetooth.characteristicChanged(this.qtObject, handle+1, data.characteristicValue);
      })
    } catch (err) {
      console.error("error in BLECharacteristicChange");
    }
  }

  private offBLECharacteristicChange() {
    if (!this.gattClient) {
      return;
    }

    this.gattClient.off('BLECharacteristicChange');
  }

  disconnectToServer() {
    if (this.gattClient == null)
      return;
    try {
        this.offBLEConnectionStateChange();
        this.offBLECharacteristicChange();
        if (this.state === ConnectionState.STATE_CONNECTING) {
          this.close();
        } else if (this.state === ConnectionState.STATE_CONNECTED) {
          this.disconnect();
          this.state = ConnectionState.STATE_DISCONNECTING;
          this.close();
        }
    } catch  (err) {
      console.error("disconnectToServer errCode:" + err.code + ",errMessage:" + err.message);
    }
  }

  private close() {
    try {
      if (!this.gattClient) {
        return;
      }

      this.gattClient.close();
      this.state = ConnectionState.STATE_DISCONNECTED;
    } catch (err) {
      console.error("close: err =", err);
    }
  }

  disconnect() {
    this.disconnectToServer();
  }

  discoverServices() : boolean {
    if (this.gattClient == null)
      return false;
    try {
      this.gattClient.getServices().then(services => {
        let uuids = [];
        for (var i = 0; i < services.length; ++i) {
          let service: bluetoothManager.GattService = services[i];
          uuids.push(service.serviceUuid);
        }
        globalThis.qtbluetooth.servicesDiscovered(this.qtObject, uuids.join(" "), 0);
      });
      return true;
    }
   catch (err) {
     console.error("errCode:" + err.code + ", errMessage:" + err.message);
     return false;
    }
  }

  private handleForCharacteristic(characteristic: bluetoothManager.BLECharacteristic) : number
  {
    if (characteristic == null)
      return -1;

    let handles : Array<number> = this.uuidToEntry.get(characteristic.serviceUuid);
    if (handles == null || handles.length == 0)
      return -1;

    //TODO for now we assume we always want the first service in case of uuid collision
    let serviceHandle = handles[0];

    try {
      let entry : GattEntry = null;
      for (let i = serviceHandle+1; i < this.entries.length; i++) {
        entry = this.entries[i];
        if (entry == null)
          continue;

        switch (entry.type) {
        case GattEntryType.Descriptor:
        case GattEntryType.CharacteristicValue:
          continue;
        case GattEntryType.Service:
          break;
        case GattEntryType.Characteristic:
        if (entry.characteristic == characteristic)
          return i;
        break;
        }
        }
      } catch (error) { /*nothing*/ }
      return -1;
  }

  private handleForDescriptor(descriptor : bluetoothManager.BLEDescriptor) : number {
    if (descriptor == null)
      return -1;

    let handles : Array<number> = this.uuidToEntry[descriptor.serviceUuid];
    if (handles == null || handles.length == 0)
      return -1;

    //TODO for now we assume we always want the first service in case of uuid collision
    let serviceHandle = handles[0];

    try {
      let entry : GattEntry;
      for (let i = serviceHandle+1; i < this.entries.length; i++) {
        entry = this.entries[i];
        if (entry == null)
            continue;

        switch (entry.type) {
          case GattEntryType.Characteristic:
          case GattEntryType.CharacteristicValue:
          continue;
          case GattEntryType.Service:
          break;
          case GattEntryType.Descriptor:
          if (entry.descriptor == descriptor)
            return i;
          break;
          }
      }
    } catch (error) { }
    return -1;
  }

  private async populateHandles() {
    let uuids = [];
    let services : Array<bluetoothManager.GattService> = await this.gattClient.getServices();
    for (var i = 0; i < services.length; ++i) {
      let service: bluetoothManager.GattService = services[i];

      let serviceEntry : GattEntry = new GattEntry;
      serviceEntry.type = GattEntryType.Service;
      serviceEntry.service = service;
      this.entries.push(serviceEntry);
      let serviceHandle : number = this.entries.length - 1;

      let old : Array<number>  = this.uuidToEntry.get(service.serviceUuid);
      if (old == null)
        old = new Array<number>();
      old.push(this.entries.length - 1);
      this.uuidToEntry.set(service.serviceUuid, old);

      let characteristics: Array<bluetoothManager.BLECharacteristic> = service.characteristics;
      for (var j = 0; j < characteristics.length; ++j) {
        let characteristic: bluetoothManager.BLECharacteristic = characteristics[j];
        let entry: GattEntry = new GattEntry;
        entry.type = GattEntryType.Characteristic;
        entry.characteristic = characteristic;
        entry.associatedServiceHandle = serviceHandle;
        //entry.endHandle = .. undefined
        this.entries.push(entry);

        // this emulates GATT value attributes
        entry = new GattEntry();
        entry.type = GattEntryType.CharacteristicValue;
        entry.associatedServiceHandle = serviceHandle;
        entry.endHandle = this.entries.length; // special case -> current index in entries list
        this.entries.push(entry);
        // add all descriptors
        let descList : Array<bluetoothManager.BLEDescriptor> = characteristic.descriptors;
        for (var k =0; k < descList.length; ++k) {
          entry = new GattEntry();
          entry.type = GattEntryType.Descriptor;
          entry.descriptor = descList[k];
          entry.associatedServiceHandle = serviceHandle;
          //entry.endHandle = .. undefined
          this.entries.push(entry);
        }
        this.gattClient.setNotifyCharacteristicChanged(characteristic, true);
      }
      serviceEntry.endHandle = this.entries.length - 1;
      uuids.push(service.serviceUuid);
    }
    globalThis.qtbluetooth.servicesDiscovered(this.qtObject, uuids.join(" "), 0);
  }

  async discoverServiceDetails(serviceUuid: string) {
    if (this.gattClient == null)
      return false;

    if (this.entries.length == 0)
      await this.populateHandles();

    let entry : GattEntry;
    let serviceHandle = 0;
    try {
      let handles : Array<number> = this.uuidToEntry.get(serviceUuid);
      if (handles == null || handles.length == 0) {
          console.warn("Unknown service uuid for current device: " + serviceUuid);
          return false;
      }

      serviceHandle = handles[0];
      entry = this.entries[serviceHandle];
      if (entry == null) {
          console.warn("Service with UUID " + serviceUuid + " not found");
          return false;
      }
      } catch (error) {
          //invalid UUID string passed
          console.warn("Cannot parse given UUID");
          return false;
      }

     if (entry.type != GattEntryType.Service) {
         console.warn("Given UUID is not a service UUID: " + serviceUuid);
         return false;
     }

     // current service already discovered or under investigation
     if (entry.valueKnown || this.servicesToBeDiscovered.has(serviceHandle)) {
         console.warn("Service already known or to be discovered");
         return true;
     }

     this.servicesToBeDiscovered.add(serviceHandle);
     this.scheduleServiceDetailDiscovery(serviceHandle);

    return true;
  }

  propertyToInt(property : bluetoothManager.GattProperties) : number {
    // Qt Property Type
    // Unknown = 0x00,
    // Broadcasting = 0x01,
    // Read = 0x02,
    // WriteNoResponse = 0x04,
    // Write = 0x08,
    // Notify = 0x10,
    // Indicate = 0x20,
    // WriteSigned = 0x40,
    // ExtendedProperty = 0x80
    let result : number = 0x00;
    if (property.write) {
      result = 0x08;
    }
    if (property.writeNoResponse) {
      result = result | 0x04;
    }
    if (property.read) {
      result = result | 0x02;
    }
    if (property.notify) {
      result = result | 0x10;
    }
    if (property.indicate) {
      result = result | 0x20;
    }
    return result;
  }

  async scheduleServiceDetailDiscovery(handler : number) {
    let serviceEntry : GattEntry = this.entries[handler];
    let endHandle : number = serviceEntry.endHandle;

    if (handler == endHandle) {
        console.warn("scheduleServiceDetailDiscovery: service is empty; nothing to discover");
        this.finishCurrentServiceDiscovery(handler);
        return;
    }

    // serviceHandle + 1 -> ignore service handle itself
    for (let i = handler + 1; i <= endHandle; i++) {
      let entry: GattEntry = this.entries[i];

      switch (entry.type) {
        case GattEntryType.Characteristic:
        case GattEntryType.Descriptor:
      // we schedule CharacteristicValue for initial discovery to simplify
      // detection of the end of service discovery process
      // performNextIO() ignores CharacteristicValue GATT entries
        case GattEntryType.CharacteristicValue:
          break;
        case GattEntryType.Service:
        // should not really happen unless endHandle is wrong
          console.warn("scheduleServiceDetailDiscovery: wrong endHandle");
          return;
      }
       let handle : number = -1;

      switch (entry.type) {
        case GattEntryType.Characteristic:
          handle = this.handleForCharacteristic(entry.characteristic);
          break;
        case GattEntryType.Descriptor:
          handle = this.handleForDescriptor(entry.descriptor);
          break;
        case GattEntryType.CharacteristicValue:
          handle = entry.endHandle;
        default:
          break;
      }
      let skip = await this.readGattEntry(entry);
      if (skip) {
        if (handle > -1) {
          let isServiceDiscovery : boolean = !entry.valueKnown;

          if (isServiceDiscovery) {
              entry.valueKnown = true;
              switch (entry.type) {
                  case GattEntryType.Characteristic:
                      console.debug("Non-readable characteristic " + entry.characteristic.characteristicUuid +
                              " for service " + entry.characteristic.serviceUuid);
                      globalThis.qtbluetooth.characteristicRead(this.qtObject, entry.characteristic.serviceUuid,
                              handle + 1, entry.characteristic.characteristicUuid,
                              this.propertyToInt(entry.characteristic.properties), entry.characteristic.characteristicValue);
                      break;
                  case GattEntryType.Descriptor:
                      // atm all descriptor types are readable
                      console.debug("Non-readable descriptor " + entry.descriptor.descriptorUuid +
                              " for service/char" + entry.descriptor.serviceUuid +
                              "/" + entry.descriptor.characteristicUuid);
                      globalThis.qtbluetooth.descriptorRead(this.qtObject,
                              entry.descriptor.serviceUuid,
                              entry.descriptor.characteristicUuid,
                              handle + 1, entry.descriptor.descriptorUuid,
                              entry.descriptor.descriptorValue);
                      break;
                  case GattEntryType.CharacteristicValue:
                      // for more details see scheduleServiceDetailDiscovery(int)
                      break;
                  default :
                      console.log("Scheduling of Service Gatt entry for service discovery should never happen.");
                      break;
              }

              let serviceEntry: GattEntry = this.entries[entry.associatedServiceHandle];
              if (serviceEntry.endHandle == handle)
                  this.finishCurrentServiceDiscovery(entry.associatedServiceHandle);
          } else {
              let errorCode = 0;
              errorCode = (entry.type == GattEntryType.Characteristic) ? 5 : 6;
              globalThis.qtbluetooth.serviceError(this.qtObject, handle + 1, errorCode);
          }
          }
      }
    }
  }

  private async readGattEntry(entry: GattEntry) : Promise<boolean>
  {
   let result: boolean;
    switch (entry.type) {
      case GattEntryType.Characteristic:
      try {
        await this.gattClient.readCharacteristicValue(entry.characteristic);
        result = true;
      } catch (error) {
        result = false;
      }
      if (!result)
        return true; // skip
      break;
    case GattEntryType.Descriptor:
      try {
        await this.gattClient.readDescriptorValue(entry.descriptor);
        result = true;
      } catch (error) {
        result = false;
      }
      if (!result)
        return true; // skip
      break;
      case GattEntryType.Service:
      return true;
      case GattEntryType.CharacteristicValue:
      return true; //skip
      }
      return false;
  }

  finishCurrentServiceDiscovery(handler : number) {
    console.warn("Finished current discovery for service handle " + handler);
    let discoveredService : GattEntry = this.entries[handler];
    discoveredService.valueKnown = true;
    this.servicesToBeDiscovered.removeFirst();
    globalThis.qtbluetooth.serviceDetailDiscoveryFinished(this.qtObject, discoveredService.service.serviceUuid, handler + 1, discoveredService.endHandle + 1);
  }


  writeCharacteristic(charHandle, value, mode) : boolean {
    if (this.gattClient == null)
      return false;
    let entry : GattEntry = null;
    try {
      entry = this.entries[charHandle-1]; //Qt always uses handles + 1
    } catch (err) {
      console.error("writeCharacteristic error", err);
      return false;
    }
    if (entry == null)
      return false;
    entry.characteristic.characteristicValue = value;
    try {
      this.gattClient.writeCharacteristicValue(entry.characteristic);
      return true;
    } catch (err) {
      console.error("writeCharacteristic error", err);
      globalThis.qtbluetooth.serviceError(this.qtObject, charHandle, 2);
      return false;
    }
  }

  writeDescriptor(charHandle, value) : boolean {
    if (this.gattClient == null)
      return false;
    let entry : GattEntry = null;
    try {
      entry = this.entries[charHandle-1]; //Qt always uses handles + 1
    } catch (err) {
      console.error("writeCharacteristic error", err);
      return false;
    }
    if (entry == null)
      return false;
    entry.descriptor.descriptorValue = value;
    try {
      this.gattClient.writeDescriptorValue(entry.descriptor);
      return true;
    } catch (err) {
      console.error("writeCharacteristic error", err);
      globalThis.qtbluetooth.serviceError(this.qtObject, charHandle, 3);
      return false;
    }
  }

  readCharacteristic(charHandle) {
    if (this.gattClient == null)
      return false;
    let entry : GattEntry = null;
    try {
      entry = this.entries[charHandle-1]; //Qt always uses handles + 1
    } catch (err) {
      console.error("readDescriptor error", err);
      return false;
    }
    if (entry == null)
      return false;
    try {
      this.gattClient.readCharacteristicValue(entry.characteristic, (code, BLECharacteristic) => {
        if (code.code != 0) {
          return;
        }
        console.log('bluetooth descriptor uuid: ' + BLECharacteristic.characteristicUuid);
        let value = BLECharacteristic.characteristicValue;
        globalThis.qtbluetooth.characteristicRead(this.qtObject, entry.characteristic.serviceUuid, charHandle + 1,
          entry.characteristic.characteristicUuid, this.propertyToInt(entry.characteristic.properties), value);
      });
      return true;
    } catch (err) {
      console.error("readDescriptor error", err);
      return false;
    }
  }

  readDescriptor(descriptorHandle) {
    if (this.gattClient == null)
      return false;
    let entry : GattEntry = null;
    try {
      entry = this.entries[descriptorHandle-1]; //Qt always uses handles + 1
    } catch (err) {
      console.error("readDescriptor error", err);
      return false;
    }
    if (entry == null)
      return false;
    try {
      this.gattClient.readDescriptorValue(entry.descriptor, (code, BLEDescriptor) => {
        if (code.code != 0) {
          return;
        }
        console.log('bluetooth descriptor uuid: ' + BLEDescriptor.descriptorUuid);
        let value = BLEDescriptor.descriptorValue;
        globalThis.qtbluetooth.descriptorRead(this.qtObject, entry.characteristic.serviceUuid, entry.characteristic.characteristicUuid, descriptorHandle + 1, BLEDescriptor.descriptorUuid, value);
      });
      return true;
    } catch (err) {
      console.error("readDescriptor error", err);
      return false;
    }
  }

  async  includedServices(serviceUuid : string) : Promise<string>
  {
    if (this.gattClient == null)
      return "";
    let services = await this.gattClient.getServices();
    let target : bluetoothManager.GattService = null;
    for (let i = 0; i < services.length; ++i) {
      let service: bluetoothManager.GattService = services[i];
      if (service == null)
        continue;
      if (service.serviceUuid == serviceUuid) {
        target = service
        break;
      }
    }
    if (target == null)
      return ""

    let includes : Array<bluetoothManager.GattService> = target.includeServices;
    if (includes.length == 0)
      return "";

    let uuids: Array<string> = [];
    for (let i = 0; i < includes.length; ++i) {
      uuids.push(includes[i].serviceUuid)
    }
    return uuids.join(" "); //space is separator
  }

  resetData() {
    this.uuidToEntry.clear();
    this.entries = [];
    this.servicesToBeDiscovered.clear();
  }
}