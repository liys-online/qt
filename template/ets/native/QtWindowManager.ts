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


import window from '@ohos.window';
import HashMap from '@ohos.util.HashMap';
import QtApplication from './QtApplication'

export class QtWindowManager {
    private windowRect = null;
    private windows = null;
    private qtApp: QtApplication = QtApplication.getInstance()
    constructor() {
        this.windowRect = new HashMap;
        this.windows = new HashMap;
    }

    addWindow(window) {
        this.windows.set(globalThis.createWindowName, window)
    }

    findWindow(name) {
        if (this.windows.hasKey(name)) {
            let p = this.windows.get(name);
            return p;
        }
        return null;
    }

     async createWindow(name) {
         if (name == this.qtApp.getMainWindowName()) {
             this.windows.set(name, this.qtApp.getMainWindow());
         } else {
             try {
                 let windowStage = this.qtApp.getWindowStage();
                 let windowClass = await windowStage.createSubWindow(name);
                 globalThis.createWindowName = name;
                 await windowClass.setUIContent('pages/Index');
                 this.windows.set(name, windowClass);
                 return true;
             } catch (e) {
                 return false;
             }
         }
         return true;
    }

    async destroyWindow(name) {
        let windowClass = null;
        try {
            windowClass = this.findWindow(name);
            await windowClass.destroyWindow();
            return true;
        } catch (exception) {
            console.error('Failed to call destroyWindow for the Window. Cause: ' + JSON.stringify(exception));
            return false;
        }
        return true;
    }

    async setGeometry(name, x, y, w, h) {
        console.log('set window geometry:', name, x, y, w, h)
        let windowClass = this.findWindow(name);
        if (windowClass != null) {
            let visible = windowClass.isWindowShowing();
            if (visible) {
                await windowClass.moveWindowTo(x, y);
                await windowClass.resize(w, h);
            }
            this.windowRect.set(name, {'w': w, 'h': h, 'x': x, 'y': y})
        }
        return true;
    }

    async showWindow(name, visible) {
        console.log("show window:", name, visible);
        let windowClass = null;
        try {
            let windowClass = this.findWindow(name);
            if (windowClass != null) {
                if (visible) {
                    await windowClass.showWindow();
                    if (this.windowRect.hasKey(name)) {
                        let p = this.windowRect.get(name);
                        await windowClass.moveWindowTo(p.x, p.y);
                        await windowClass.resize(p.w, p.h);
                    }
                }
            }
            return true;
        } catch (exception) {
            console.error('Failed to call showWindow for the Window. Cause: ' + JSON.stringify(exception));
            return false;
        }
        return true;
    }
}
