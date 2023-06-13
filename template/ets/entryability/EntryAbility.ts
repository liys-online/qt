import hilog from '@ohos.hilog';
import UIAbility from '@ohos.app.ability.UIAbility';
import Window from '@ohos.window'
import QtApplication  from '../native/QtApplication'

export default class EntryAbility extends UIAbility {

    private qtApp: QtApplication = QtApplication.getInstance()

    onCreate(want, launchParam) {
        this.qtApp.setContext(this.context);
    }

    onDestroy() {
        hilog.isLoggable(0x0000, 'QtApplication', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'QtApplication', '%{public}s', 'Ability onDestroy');
        this.qtApp.quit();
    }

    onWindowStageCreate(windowStage: Window.WindowStage) {
        // Main window is created, set main page for this ability
        hilog.isLoggable(0x0000, 'QtApplication', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'QtApplication', '%{public}s', 'Ability onWindowStageCreate');
        this.qtApp.run(windowStage);
    }

    onWindowStageDestroy() {
        // Main window is destroyed, release UI related resources
        hilog.isLoggable(0x0000, 'QtApplication', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'QtApplication', '%{public}s', 'Ability onWindowStageDestroy');
    }

    onForeground() {
        // Ability has brought to foreground
        hilog.isLoggable(0x0000, 'QtApplication', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'QtApplication', '%{public}s', 'Ability onForeground');
    }

    onBackground() {
        // Ability has back to background
        hilog.isLoggable(0x0000, 'QtApplication', hilog.LogLevel.INFO);
        hilog.info(0x0000, 'QtApplication', '%{public}s', 'Ability onBackground');
    }
};
