import window from '@ohos.window';
import HashMap from '@ohos.util.HashMap';


export class QtWindowManager {
    private postions = null;
    constructor() {
        this.postions = new HashMap;
    }

     async createWindow(name) {
         try {
             let windowStage = AppStorage.Get("windowStage") as window.WindowStage;
             let windowClass = await windowStage.createSubWindow(name);
             globalThis.createWindowName = name;
             await windowClass.setUIContent('pages/template');
             return true;
         } catch (e) {
             return false;
         }
    }

    async destroyWindow(name) {
        let windowClass = null;
        try {
            windowClass = window.findWindow(name);
            await windowClass.destroyWindow();
            return true;
        } catch (exception) {
            console.error('Failed to call destroyWindow for the Window. Cause: ' + JSON.stringify(exception));
            return false;
        }
    }

    async setGeometry(name, x, y, w, h) {
        console.log('set window geometry:', name, x, y, w, h)
        let windowClass = null;
        try {
            windowClass = window.findWindow(name);
            let windowStage = AppStorage.Get("windowStage") as window.WindowStage;
            let mainWindow = windowStage.getMainWindowSync();
            let property = mainWindow.getWindowProperties();
            await windowClass.moveWindowTo(x, property.windowRect.top + y);
            await windowClass.resize(w, h);
            this.postions.set(name, {'x': x, 'y': property.windowRect.top + y});
            return true;
        } catch (exception) {
            console.error('Failed to call setGeometry for the Window. Cause: ' + JSON.stringify(exception));
            return false;
        }
    }

    async showWindow(name, visible) {
        console.log("show window:", name, visible);
        let windowClass = null;
        try {
            windowClass = window.findWindow(name);
            if (visible) {
                console.log("show window:", name, visible);
                await windowClass.showWindow();
                if (this.postions.hasKey(name)) {
                    let p = this.postions.get(name);
                    windowClass.moveWindowTo(p.x, p.y);
                }
            }
            else {
                let windowStage = AppStorage.Get("windowStage") as window.WindowStage;
                let mainWindow = windowStage.getMainWindowSync();
                let property = mainWindow.getWindowProperties();
                windowClass.moveWindowTo(property.windowRect.width, 0);
            }
            return true;
        } catch (exception) {
            console.error('Failed to call showWindow for the Window. Cause: ' + JSON.stringify(exception));
            return false;
        }
    }
}