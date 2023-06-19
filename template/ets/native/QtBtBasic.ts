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
