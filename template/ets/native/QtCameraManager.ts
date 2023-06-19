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

import camera from '@ohos.multimedia.camera';

export class QtCameraManager {
    private cameraDevs = new Map();

    constructor() {
    }

    private interfaceToObject(data:camera.CameraDevice):any {
        var cameraInfo = {
            "cameraId" : data.cameraId,
            "cameraType" : data.cameraType,
            "cameraPosition" : data.cameraPosition,
            "connectionType" : data.connectionType,
        }
        return cameraInfo;
    }

    /* 获取相机设备列表 Array<CameraDevice> */
    private async cameraDevices() {
        let cameraManager = await camera.getCameraManager(globalThis.appContext);
        let cameras = await cameraManager.getSupportedCameras();
        for (let dev of cameras) {
            this.cameraDevs.set(dev.cameraId, dev);
        }
        return cameras;
    }

    /* 获取指定id的相机设备信息 */
    cameraInfo(id: string): string {
        if (this.cameraDevs.has(id)) {
            let info = this.cameraDevs.get(id);
            var cameraInfo = this.interfaceToObject(info);
            return JSON.stringify(cameraInfo);
        }
        return null;
    }

    /* 获取相机设备数量 */
    async idOfCameras() {
        await this.cameraDevices();
        return [...this.cameraDevs.keys()];
    }

    /* 获取相机设备信息的以JSON字符串格式表示 */
    async jsonOfCameras() {
        let cameras = await this.cameraDevices();
        let devices = new Array();
        for (let dev of cameras) {
            var cameraInfo = this.interfaceToObject(dev);
            devices.push(cameraInfo);
        }
        return JSON.stringify(devices);
    }
}
