import bluetoothManager from '@ohos.bluetoothManager';

export class QtBluetooth {

  private deviceId = ''
  private clientSocket = null
  private ble : boolean = false;

  constructor(deviceId : string, isBle: boolean) {
    this.deviceId = deviceId;
    this.ble = isBle;
  }

  getClass() {
    return bluetoothManager.getRemoteDeviceClass(this.deviceId).classOfDevice;
  }

  getName() {
    return bluetoothManager.getRemoteDeviceName(this.deviceId);
  }

  isBLE() : boolean {
    return this.ble
  }
}