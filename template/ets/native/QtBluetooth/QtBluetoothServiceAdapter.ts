import bluetoothManager from '@ohos.bluetoothManager';
import qtbluetooth from 'libQt5Bluetooth.so';

export class QtBluetoothServiceAdapter {
  private pointerId = 0;
  private device = null;

  constructor(p) {
    this.pointerId = p;
  }

  createAdapter(adapter) {
    try {
      this.device = bluetoothManager.BLE.createGattClientDevice(adapter);
    } catch (err) {
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
    return true;
  }

  fetchService() {
    console.warn("<----------------fetchService---1");
    this.device.connect();
    console.warn("<----------------fetchService---3");
    this.device.getServices((code, gattServices) => {
      if (code.code == 0) {
        let services = gattServices;
        console.log('bluetooth code is ' + code.code);
        console.log("bluetooth services size is ", services.length);

        for (let i = 0; i < services.length; i++) {
          console.log('bluetooth services is ' + JSON.stringify(services[i]));
          qtbluetooth.servicesReceiver(this.pointerId, JSON.stringify(services[i]));
        }
      }
    });
  }
}
