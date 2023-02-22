import hilog from '@ohos.hilog';
import UIAbility from '@ohos.app.ability.UIAbility';
import Window from '@ohos.window'
import display from '@ohos.display';
import qtCore from "libQt5Core.so"
import qpa from "libplugins_platforms_qopenharmony.so"
import { QtObjectLoader } from '../native/QtObjectLoader'

export default class EntryAbility extends UIAbility {
    onCreate(want, launchParam) {
        globalThis.abilityContext = this.context
    }

    onDestroy() {
        hilog.isLoggable(0x0000, 'testTag', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
        qpa.quitQtApplication();
    }

    onWindowStageCreate(windowStage: Window.WindowStage) {
        // Main window is created, set main page for this ability
        let mainWindow = windowStage.getMainWindowSync();
        let property = mainWindow.getWindowProperties();
        var appContext = this.context.getApplicationContext();
        var dirs = {
            "tempDir": appContext.tempDir,
            "filesDir": appContext.filesDir,
            "cacheDir": appContext.cacheDir,
            "databaseDir": appContext.databaseDir,
            "bundleCodeDir": appContext.bundleCodeDir,
            "preferencesDir": appContext.preferencesDir,
            "distributedFilesDir": appContext.distributedFilesDir
        };
        globalThis.qtobjectloader = new QtObjectLoader();
        globalThis.qpa = qpa;
        let d = display.getDefaultDisplaySync();
        qpa.setDisplayMetrics(d.densityDPI, d.densityPixels, d.scaledDensity, d.width, d.height, property.windowRect.width, property.windowRect.height);
        qpa.startQtApplication(dirs, "libQtForHarmony.so");
        mainWindow.on('windowSizeChange', (data) => {
            console.info('Succeeded in enabling the listener for window size. Data: ' + JSON.stringify(data));
            let d = display.getDefaultDisplaySync();
            qpa.setDisplayMetrics(d.densityDPI, d.densityPixels, d.scaledDensity, d.width, d.height, data.width, data.height);
        });
        AppStorage.SetOrCreate("windowStage", windowStage);
    }

    onWindowStageDestroy() {
        // Main window is destroyed, release UI related resources
        hilog.isLoggable(0x0000, 'testTag', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }

    onForeground() {
        // Ability has brought to foreground
        hilog.isLoggable(0x0000, 'testTag', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
    }

    onBackground() {
        // Ability has back to background
        hilog.isLoggable(0x0000, 'testTag', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
    }
};
