/*
 * Copyright (C) 2022 Sinux Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
