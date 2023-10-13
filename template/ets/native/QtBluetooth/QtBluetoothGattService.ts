import bluetoothManager from '@ohos.bluetoothManager';

export class QtBluetoothGattService {

  private uuid : string = ''
  private gattService : bluetoothManager.GattService = null;

  constructor(uuid: string, isPrimary: boolean) {
    this.uuid = uuid;
    this.gattService = {
      serviceUuid: uuid,
      isPrimary: isPrimary,
      characteristics: []
    };
  }

  service() : bluetoothManager.GattService {
    return this.gattService;
  }

  addCharacteristic(uuid, p, data) : boolean {
    if (!this.gattService)
      return;

    let pro : bluetoothManager.GattProperties = {
      write: Boolean(p & 0x08),
      writeNoResponse: Boolean(p & 0x04),
      read: Boolean(p & 0x02),
      notify: Boolean(p & 0x10),
      indicate: Boolean(p & 0x20)
    }

    let characteristic : bluetoothManager.BLECharacteristic = {
      serviceUuid : this.uuid,
      characteristicUuid : uuid,
      characteristicValue: data,
      descriptors: [],
      properties: pro
    }

    this.gattService.characteristics.push(characteristic);
    return true;
  }

  addDescriptor(cuuid, duuid, data) {
    if (!this.gattService)
      return false;

    for (let i = 0; i < this.gattService.characteristics.length; ++i) {
      let characteristic : bluetoothManager.BLECharacteristic = this.gattService.characteristics[i];
      if (characteristic.characteristicUuid === cuuid) {
        let descriptor : bluetoothManager.BLEDescriptor = {
          serviceUuid : this.uuid,
          characteristicUuid : cuuid,
          descriptorUuid: duuid,
          descriptorValue: data
        }
        characteristic.descriptors.push(descriptor);
        return true;
      }
    }
    return false;
  }

}