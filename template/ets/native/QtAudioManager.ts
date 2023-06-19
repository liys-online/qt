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

import audio from '@ohos.multimedia.audio';

export class QtAudioManager {
    private audioManager: audio.AudioManager = audio.getAudioManager();
    private routingManager: audio.AudioRoutingManager = this.audioManager.getRoutingManager();
    private deviceDescript = new Map([
        [0, "INVALID"], [1, "EARPIECE"], [2, "SPEAKER"], [3, "WIRED_HEADSET"], [4, "WIRED_HEADPHONES"],
        [7, "BLUETOOTH_SCO"], [8, "BLUETOOTH_A2DP"], [15, "MIC"], [22, "USB_HEADSET"], [1000, "DEFAULT"]
    ]);

    public constructor() {
    }

    /* 获取可用的输入设备描述 */
    private async availableInputDevicesDes() {
        let devicesDes = await this.routingManager.getDevices(audio.DeviceFlag.INPUT_DEVICES_FLAG);
        return devicesDes;
    }

    /* 获取可用的输出设备描述 */
    private async availableOutputDevicesDes() {
        let devices = await this.routingManager.getDevices(audio.DeviceFlag.OUTPUT_DEVICES_FLAG);
        return devices;
    }

    /* 获取可用的输入设备id值 */
    async availableInputDevices() {
        let ids:Array<string> = new Array();
        let devDes = await this.availableInputDevicesDes();
        for (let des of devDes) {
            if (audio.DeviceType.INVALID != des.deviceType) {
                ids.push(String(des.id));
            }
        }
        return ids;
    }
    /* 获取可用的输出设备id值 */
    async availableOutputDevices() {
        let ids:Array<string> = new Array();
        let devDes = await this.availableOutputDevicesDes();
        for (let des of devDes) {
            if (audio.DeviceType.INVALID != des.deviceType) {
                ids.push(String(des.id));
            }
        }
        return ids;
    }

    /* 获取指定输入设备支持的通道数 param id---设备id */
    async inputChannelCounts(id: string) {
        let devices = await this.availableInputDevicesDes();
        for (let dev of devices) {
            if (Number(dev.id) === dev.id) {
                return dev.channelCounts;
            }
        }
        return undefined;
    }

    /* 获取指定输出设备支持的通道数 param id---设备id */
    async outputChannelCounts(id: string) {
        let devices = await this.availableOutputDevicesDes();
        for (let dev of devices) {
            if (Number(dev.id) === dev.id) {
                return dev.channelCounts;
            }
        }
        return undefined;
    }

    /* 返回指定输入设备支持的采样率列表 param id---设备id */
    async inputSupportedSampleRates(id: string) {
        let devices = await this.availableInputDevicesDes();
        for (let dev of devices) {
            if (Number(dev.id) === dev.id) {
                return dev.sampleRates;
            }
        }
        return undefined;
    }
    /* 返回输出设备支持的采样率列表 param id---设备id */
    async outputSupportedSampleRates(id: string) {
        let devices = await this.availableOutputDevicesDes();
        for (let dev of devices) {
            if (Number(dev.id) === dev.id) {
                return dev.sampleRates;
            }
        }
        return undefined;
    }
}
