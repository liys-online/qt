import window from '@ohos.window';
import HashMap from '@ohos.util.HashMap';

export class QtWindowManager {
    private windowRect = null;
    constructor() {
        this.windowRect = new HashMap;
    }


     async createWindow(name) {
         try {
             let windowStage = AppStorage.Get("windowStage") as window.WindowStage;
             let windowClass = await windowStage.createSubWindow(name);
             globalThis.createWindowName = name;
             await windowClass.setUIContent('pages/Index');
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
            let visible = windowClass.isWindowShowing();
            let windowStage = AppStorage.Get("windowStage") as window.WindowStage;
            let mainWindow = windowStage.getMainWindowSync();
            let property = mainWindow.getWindowProperties();
            if (visible) {
                await windowClass.moveWindowTo(property.windowRect.left + x, property.windowRect.top + 20 + y);
                await windowClass.resize(w, h);
            }
            this.windowRect.set(name, {'w': w, 'h': h, 'x': property.windowRect.left + x, 'y': property.windowRect.top + 20 + y})
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
                await windowClass.showWindow();
                if (this.windowRect.hasKey(name)) {
                    let p = this.windowRect.get(name);
                    await windowClass.moveWindowTo(p.x, p.y);
                    await windowClass.resize(p.w, p.h);
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