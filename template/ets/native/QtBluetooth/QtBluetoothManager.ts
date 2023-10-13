import bluetoothManager from '@ohos.bluetoothManager';
import List from '@ohos.util.List';
import { QtBluetooth } from './QtBluetooth';
import { QtBluetoothDevice } from './QtBluetoothDevice'
import { QtBluetoothServer } from './QtBluetoothServer'
import { QtBluetoothLE } from './QtBluetoothLE'
import { QtBluetoothGattServer } from './QtBluetoothGattServer'
import { QtBluetoothServiceAdapter } from './QtBluetoothServiceAdapter'
import qtbluetooth from 'libQt5Bluetooth.so';

function onReceiveEvent(data) {
  for (var i = 0; i < data.length; ++i) {
    let target = new QtBluetooth(data[i], false);
    let address = data[i];
    globalThis.qtBluetoothManager.add(address);
    Reflect.defineProperty(globalThis, address, { value: target });
    qtbluetooth.discoveryResult(address);
  }
}

function onBLEReceiveEvent(data) {
  for (var i = 0; i < data.length; ++i) {
    let target = new QtBluetooth(data[i], true);
    let address = data[i];
    globalThis.qtBluetoothManager.add(address);
    Reflect.defineProperty(globalThis, address, { value: target });
    qtbluetooth.discoveryResult(address);
  }
}

export class QtBluetoothManager {
  private targets = null;

  constructor() {
    this.targets = new List();
    globalThis.qtBluetoothManager = this;
    globalThis.qtbluetooth = qtbluetooth;
  }

  isSupport() {
    return canIUse("SystemCapability.Communication.Bluetooth.Core");
  }

  enable() {
    try {
      if (bluetoothManager.getState() === bluetoothManager.BluetoothState.STATE_ON
        || bluetoothManager.getState() === bluetoothManager.BluetoothState.STATE_TURNING_ON)
        return true;
      bluetoothManager.enableBluetooth();
      return true;
    } catch (err) {
      console.error("enableBluetooth errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  disable() {
    try {
      bluetoothManager.disableBluetooth();
      return true;
    } catch (err) {
      console.error("disableBluetooth errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  scanMode() {
    try {
      let mode = bluetoothManager.getBluetoothScanMode();
      return mode;
    } catch (err) {
      console.error("getBluetoothScanMode errCode:" + err.code + ",errMessage:" + err.message);
      return -1;
    }
  }

  setScanMode(mode) {
    try {
      bluetoothManager.setBluetoothScanMode(mode, 0);
    } catch (err) {
      console.error("setBluetoothScanMode errCode:" + err.code + ",errMessage:" + err.message);
    }
  }

  getLocalName() {
    return bluetoothManager.getLocalName();
  }

  getAddress() {
    return bluetoothManager.getLocalName();
  }

  pair(address, isPairing) {
    try {
      if (isPairing)
        bluetoothManager.pairDevice(address);
      // else
      //     bluetoothManager.cancelPairedDevice(address);    //没有这个接口
    } catch (err) {
      console.error("pair errCode:" + err.code + ",errMessage:" + err.message);
    }
  }

  pairedDevices() {
    try {
      let devices = bluetoothManager.getPairedDevices();
      return devices;
    } catch (err) {
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
      return [];
    }
  }

  getBondState(address) {
    if (this.pairedDevices().indexOf(address) == -1)
      return bluetoothManager.BondState.BOND_STATE_INVALID;
    return bluetoothManager.BondState.BOND_STATE_BONDED;
  }

  getState() {
    return bluetoothManager.getState();
  }

  add(deviceId) {
    if (this.targets.has(deviceId))
      return;
    this.targets.add(deviceId);
  }

  startBluetoothDiscovery() {
    try {
      bluetoothManager.on('bluetoothDeviceFind', onReceiveEvent);
      bluetoothManager.startBluetoothDiscovery();
      return true;
    } catch (err) {
      console.error("startBluetoothDiscovery errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  stopBluetoothDiscovery() {
    try {
      bluetoothManager.off('bluetoothDeviceFind');
      bluetoothManager.stopBluetoothDiscovery();
      return true;
    } catch (err) {
      console.error("stopBluetoothDiscovery errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  startBLEScan() {
    try {
      bluetoothManager.BLE.on("BLEDeviceFind", onBLEReceiveEvent);
      bluetoothManager.BLE.startBLEScan(
        null,
        {
          interval: 500,
          dutyMode: bluetoothManager.ScanDuty.SCAN_MODE_LOW_POWER,
          matchMode: bluetoothManager.MatchMode.MATCH_MODE_AGGRESSIVE,
        }
      );
      return true;
    } catch (err) {
      console.error(" startBLEScan errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  stopBLEScan() {
    try {
      bluetoothManager.BLE.off("BLEDeviceFind");
      bluetoothManager.BLE.stopBLEScan();
      return true;
    } catch (err) {
      console.error("stopBLEScan errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  createBluetoothDevice(name, address) {
    if (!this.targets.has(address))
      return false;
    let device = new QtBluetoothDevice(address);
    Reflect.defineProperty(globalThis, name, { value: device });
    return true;
  }

  destroyBluetoothDevice(name) {
    console.log("delete js bluetooth device object for: ", name)
    Reflect.deleteProperty(globalThis, name);
    return true;
  }

  createServer(name, p) {
    let server = new QtBluetoothServer(name, p);
    Reflect.defineProperty(globalThis, name, { value: server });
    return true;
  }

  createBluetoothLE(name, address) {
    let target = new QtBluetoothLE(address);
    Reflect.defineProperty(globalThis, name, { value: target });
    return true;
  }

  destroyBluetoothLE(name) {
    console.log("delete js bluetooth le object for: ", name)
    Reflect.deleteProperty(globalThis, name);
    return true;
  }

  createBluetoothGattServer(name) {
    let target = new QtBluetoothGattServer;
    Reflect.defineProperty(globalThis, name, { value: target });
    return true;
  }

  destroyBluetoothGattServer(name) {
    console.log("delete js bluetooth le object for: ", name)
    Reflect.deleteProperty(globalThis, name);
    return true;
  }

  createServiceAdapter(name, pointer) {
    let adapter = new QtBluetoothServiceAdapter(pointer);
    Reflect.defineProperty(globalThis, name, { value: adapter });
    return true;
  }

  destroyServiceAdapter(name) {
    console.log("delete js blue device object for: ", name)
    Reflect.deleteProperty(globalThis, name);
    return true;
  }
}