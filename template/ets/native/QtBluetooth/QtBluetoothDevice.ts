import bluetoothManager from '@ohos.bluetoothManager';
import { QtBluetoothSocket } from './QtBluetoothSocket';

export class QtBluetoothDevice {

  private deviceId = ''
  private clientSocket = null

  constructor(deviceId) {
    this.deviceId = deviceId;
  }

  getClass() {
    return bluetoothManager.getRemoteDeviceClass(this.deviceId).classOfDevice;
  }

  getName() {
    return bluetoothManager.getRemoteDeviceName(this.deviceId);
  }

  createSocket(name, id) {
    let socket = new QtBluetoothSocket(id);
    Reflect.defineProperty(globalThis, name, {value: socket});
    return true;
  }

  closeSocket(name) {
    Reflect.deleteProperty(globalThis, name);
    return true;
  }
}