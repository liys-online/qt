import bluetoothManager from '@ohos.bluetoothManager';
import { QtBluetoothGattServer } from './QtBluetoothGattServer'

export class QtBluetoothGattServerCallback {

  private gattServer : QtBluetoothGattServer;

  constructor(gattServer : QtBluetoothGattServer) {
    this.gattServer = gattServer;

  }

  start() {
    let s = this.gattServer.server();

    s.on("connectStateChange", (state : bluetoothManager.BLEConnectChangedState) => {
      let deviceId : string = state.deviceId;
      let s : bluetoothManager.ProfileConnectionState = state.state;
      console.log("Our gatt server connection state changed, new state: " + deviceId + bluetoothManager.getRemoteDeviceName(deviceId));
      let qtControllerState : number = 0;
      if (s == bluetoothManager.ProfileConnectionState.STATE_DISCONNECTED)
        qtControllerState = 0;// QLowEnergyController::UnconnectedState
      else if (s = bluetoothManager.ProfileConnectionState.STATE_CONNECTED)
        qtControllerState = 2;

      this.gattServer.addDevice(deviceId);
      globalThis.qtbluetooth.connectionChanged(this.gattServer.getQtObject(), 0 /*NoError*/, qtControllerState /*QLowEnergyController::UnconnectedState*/);
    });

    s.on("characteristicRead", (request: bluetoothManager.CharacteristicReadRequest) => {
      let deviceId = request.deviceId;
      let transId = request.transId;
      let offset = request.offset;
      let characteristicUuid = request.characteristicUuid;
      console.log("onCharacteristicRead", deviceId, transId, offset, characteristicUuid);
      let c = this.gattServer.getCharacteristic(request.serviceUuid, request.characteristicUuid);
      let serverResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value: null};
      if (c != null) {
        serverResponse.value = c.characteristicValue.slice(offset);
      }

      try {
          this.gattServer.server().sendResponse(serverResponse);
      } catch (err) {
          console.error("onCharacteristicRead errCode:" + err.code + ",errMessage:" + err.message);
          this.gattServer.server().sendResponse({deviceId: deviceId, transId: transId, status: -1, offset: offset, value: null});
      }
    });

    s.on("characteristicWrite", (request: bluetoothManager.CharacteristicWriteRequest) => {
      let deviceId = request.deviceId;
      let transId = request.transId;
      let offset = request.offset;
      let isPrep = request.isPrep;
      let needRsp = request.needRsp;
      console.log("onCharacteristicWrite", deviceId, transId, offset, isPrep, needRsp);
      let sendNotificationOrIndication :boolean = false;
      let characteristic : bluetoothManager.BLECharacteristic = {
        characteristicUuid: request.characteristicUuid,
        characteristicValue: request.value,
        serviceUuid: request.serviceUuid,
        descriptors: []
      };
      let status = 0
      if (!isPrep) { // regular write
        if (offset == 0) {
            globalThis.qtbluetooth.serverCharacteristicChanged(this.gattServer.getQtObject(), request.serviceUuid, request.characteristicUuid, request.value);
            sendNotificationOrIndication = true;
          } else {
            console.warn("onCharacteristicWriteRequest: !preparedWrite, offset " + offset + ", Not supported");
            status = -1;
          }
      } else {
        console.warn("onCharacteristicWriteRequest: preparedWrite, offset " + offset + ", Not supported");
        status = -1;
      }

      if (needRsp)
        this.gattServer.server().sendResponse({deviceId: deviceId, transId: transId, status: status, offset: offset, value: request.value});
      if (sendNotificationOrIndication)
        this.gattServer.sendNotificationsOrIndications(characteristic);
    });

    s.on("descriptorRead", (request: bluetoothManager.DescriptorReadRequest) => {
      let deviceId = request.deviceId;
      let transId = request.transId;
      let offset = request.offset;
      let descriptorUuid = request.descriptorUuid;

      console.log("onDescriptorRead", deviceId, transId, offset, descriptorUuid);
      let d = this.gattServer.getDescriptor(request.serviceUuid, request.characteristicUuid, request.descriptorUuid);
      let serverResponse = {deviceId: deviceId, transId: transId, status: 0, offset: offset, value: null};
      if (d != null) {
        serverResponse.value = d.descriptorValue.slice(offset);
      }

      try {
        this.gattServer.server().sendResponse(serverResponse);
      } catch (err) {
        console.error("onDescriptorRead errCode:" + err.code + ",errMessage:" + err.message);
        this.gattServer.server().sendResponse({deviceId: deviceId, transId: transId, status: -1, offset: offset, value: null});
      }
    });

    s.on("descriptorWrite", (request: bluetoothManager.DescriptorWriteRequest) => {
      let deviceId = request.deviceId;
      let transId = request.transId;
      let offset = request.offset;
      let isPrep = request.isPrep;
      let needRsp = request.needRsp;
      let status = 0;
      console.log("onDescriptorWrite", deviceId, transId, offset, isPrep, needRsp);
      if (!isPrep) { // regular write
        if (offset == 0) {
          globalThis.qtbluetooth.serverDescriptorWritten(this.gattServer.getQtObject(), request.serviceUuid, request.characteristicUuid, request.descriptorUuid, request.value);
          status = -1;
        } else {
          console.warn("onDescriptorWriteRequest: !preparedWrite, offset " + offset + ", Not supported");
        }
      } else {
        console.warn("onDescriptorWriteRequest: preparedWrite, offset " + offset + ", Not supported");
        status = -1;
      }


      if (needRsp)
        this.gattServer.server().sendResponse({deviceId: deviceId, transId: transId, status: status, offset: offset, value: request.value});
    });
  }

  stop() {
    let s = this.gattServer.server();
    s.off("connectStateChange");
    s.off("characteristicRead");
    s.off("characteristicWrite");
    s.off("descriptorRead");
    s.off("descriptorWrite");
  }

}