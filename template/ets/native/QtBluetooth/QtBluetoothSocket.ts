import bluetoothManager from '@ohos.bluetoothManager';

export class QtBluetoothSocket {

  private clientSocket = null

  private id = 0;
  constructor(id) {
    this.id = id;
  }

  connect(address, uuid, sec) {
    try {
      let sppOption = {uuid: uuid, secure: sec, type: 0};
      bluetoothManager.sppConnect(address, sppOption, (code, client) => {
         if (code.code != 0) {
            return;
        }
        console.log('bluetooth serverSocket Number: ' + client);
        // 获取的clientNumber用作客户端后续读/写操作socket的id。
        this.clientSocket = client;
      });
      return true;
    } catch (err) {
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  start() {
    try {
      bluetoothManager.on('sppRead', this.clientSocket, (dataBuffer) => {
            globalThis.qtbluetooth.socketDataAvailable(this.id, dataBuffer);
      });
     } catch (err) {
      console.error("sppRead errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  write(buffer) {
    try {
      bluetoothManager.sppWrite(this.clientSocket, buffer);
      return true;
    } catch (err) {
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
      return false;
    }
  }

  close() {
    bluetoothManager.off('sppRead', this.clientSocket);
    bluetoothManager.sppCloseClientSocket(this.clientSocket);
  }

}