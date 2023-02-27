import bluetooth from '@ohos.bluetooth'
import { QtBtBasic } from "../native/QtBtBasic"

export class QtBtDeviceDiscoveryAgent extends QtBtBasic {
    /* 蓝牙设备发现上报事件处理 */
    private onBluetoothDeviceFind(data) {
        console.info('bluetooth device find = '+ JSON.stringify(data));
    }
    /* BLE设备发现上报事件 */
    private onBLEDeviceFind(data) {
        console.info('BLE scan device find result = '+ JSON.stringify(data));
    }

    /* TODO 清理操作 */
    clean():void{

    }

    startBluetoothDiscovery():boolean {
        /* 订阅蓝牙设备发现上报事件 */
        bluetooth.on('bluetoothDeviceFind', this.onBluetoothDeviceFind);
        let result = bluetooth.startBluetoothDiscovery();
        return result;
    }

    stopBluetoothDiscovery():boolean {
        /* 取消订阅蓝牙设备发现上报事件 */
        bluetooth.off('bluetoothDeviceFind', this.onBluetoothDeviceFind);
        let result = bluetooth.stopBluetoothDiscovery();
        return result;
    }

    /**************************** 低功耗蓝牙设备 **********************************/
    startBLEScan():void {
        /* 订阅BLE设备发现上报事件 */
        bluetooth.BLE.on("BLEDeviceFind", this.onBLEDeviceFind);
        bluetooth.BLE.startBLEScan(
            [],
            {
                interval: 0,
                dutyMode: bluetooth.ScanDuty.SCAN_MODE_BALANCED,
                matchMode: bluetooth.MatchMode.MATCH_MODE_AGGRESSIVE,
            }
        );
    }

    stopBLEScan():void {
        /* 取消订阅BLE设备发现上报事件 */
        bluetooth.BLE.off("BLEDeviceFind", this.onBLEDeviceFind);
        bluetooth.BLE.stopBLEScan();
    }
}