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