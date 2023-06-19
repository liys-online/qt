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

export class QtBtLocalDevice extends QtBtBasic {
    private bondStates = new Map();
    private static self:QtBtLocalDevice;

    private onBondStateChange(data):void {
        this.bondStates.set(JSON.parse("deviceId"), JSON.parse("state"));
    }

    static instance():QtBtLocalDevice {
        QtBtLocalDevice.self = new QtBtLocalDevice();
        bluetooth.on('bondStateChange', QtBtLocalDevice.self.onBondStateChange);
        return QtBtLocalDevice.self;
    }
    /* TODO 清理操作 */
    static clean():void {
        bluetooth.off('bondStateChange', QtBtLocalDevice.self.onBondStateChange);
    }
    getConnectionDevices():Array<string> {
        let panSrc = bluetooth.getProfileInst(bluetooth.ProfileId.PROFILE_PAN_NETWORK) as bluetooth.PanProfile;
        let a2dpSrc = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_A2DP_SOURCE) as bluetooth.A2dpSourceProfile;
        let hidHostProfile = bluetooth.getProfileInst(bluetooth.ProfileId.PROFILE_HID_HOST) as bluetooth.HidHostProfile;
        let hfpAg = bluetooth.getProfile(bluetooth.ProfileId.PROFILE_HANDS_FREE_AUDIO_GATEWAY) as bluetooth.HandsFreeAudioGatewayProfile;

        let retArray;
        retArray.concat(panSrc.getConnectionDevices(), a2dpSrc.getConnectionDevices(),
        hidHostProfile.getConnectionDevices(), hfpAg.getConnectionDevices());
        return retArray;
    }
}
