import qtbluetooth from 'libQt5Bluetooth.so';
import bluetoothManager from '@ohos.bluetoothManager';
import { QtBluetoothSocket } from '../QtBluetooth/QtBluetoothSocket'

export class QtBluetoothServer {
  private alive = false;
  private pointerId = 0;
  private serverNumber = -1;
  private clientNumber = -1;
  private name: string = '';

  public constructor(name: string, p) {
    this.name = name;
    this.pointerId = p;
  }

  isAlive() {
    return this.alive;
  }

  createServer(name: string, p) {
    let server = new QtBluetoothServer(name, p);
    Reflect.defineProperty(globalThis, name, { value: server });
    return true;
  }

  destroyServer(name: string) {
    Reflect.deleteProperty(globalThis, name);
    this.name = '';
    this.pointerId = 0;
    this.alive = false;
    return true;
  }

  closeClient(socket: number) {
    try {
      bluetoothManager.sppCloseClientSocket(socket);
    } catch (err) {
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
    }
  }

  close() {
    try {
      bluetoothManager.sppCloseServerSocket(this.serverNumber);
      this.alive = false;
    } catch (err) {
      qtbluetooth.occurError(this.pointerId, err);
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
    }
  }

  listen(srvName, uid, isSecure) {
    try {
      let sppOption = { uuid: uid, secure: isSecure, type: bluetoothManager.SppType.SPP_RFCOMM };

      bluetoothManager.sppListen(srvName, sppOption, (code, number) => {
        console.log('bluetooth error code: ' + code.code);
        if (code.code == 0) {
          this.serverNumber = number;
          this.alive = true;
          console.log('bluetooth serverSocket Number: ' + number);
          try {
            bluetoothManager.sppAccept(this.serverNumber, (code, number) => {
              console.log('bluetooth clientSocket Number: ' + number);
              /* 获取的clientNumber用作服务端后续读/写操作socket的id */
              this.clientNumber = number;
              let server = new QtBluetoothSocket(this.clientNumber);
              Reflect.defineProperty(globalThis, this.clientNumber, { value: server });
              qtbluetooth.acceptClientSocket(this.pointerId, this.clientNumber);
            });
          } catch (err) {
            qtbluetooth.occurError(this.pointerId, err);
            console.error("errCode:" + err.code + ",errMessage:" + err.message);
          }
        }
      });
    } catch (err) {
      this.alive = false;
      qtbluetooth.occurError(this.pointerId, err);
      console.error("errCode:" + err.code + ",errMessage:" + err.message);
    }
  }
}