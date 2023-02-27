import bluetooth from '@ohos.bluetooth';

export class QtBtBasic {
    enableBluetooth():boolean {
        let enable = bluetooth.enableBluetooth();
        return enable;
    }
    disableBluetooth():boolean {
        let disable = bluetooth.disableBluetooth();
        return disable;
    }
    getLocalName():string {
        let localName = bluetooth.getLocalName();
        return localName;
    }
    setLocalName(name:string): boolean {
        let ret = bluetooth.setLocalName(name);
        return ret;
    }
    getState():bluetooth.BluetoothState {
        let state = bluetooth.getState();
        return state;
    }
    getBluetoothScanMode():bluetooth.ScanMode {
        let scanMode = bluetooth.getBluetoothScanMode();
        return scanMode;
    }
    setBluetoothScanMode(mode:bluetooth.ScanMode, duration:number):boolean {
        let result = bluetooth.setBluetoothScanMode(mode, duration);
        return result;
    }
    getBtConnectionState():bluetooth.ProfileConnectionState {
        let connectionState = bluetooth.getBtConnectionState();
        return connectionState;
    }
    /* 获取不同协议下的蓝牙连接状态 */
    getProfileConnState(profileId:bluetooth.ProfileId):bluetooth.ProfileConnectionState {
        let result = bluetooth.getProfileConnState(profileId);
        return result;
    }
}