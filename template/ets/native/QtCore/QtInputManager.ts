import window from '@ohos.window';
import QtApplication from '../QtApplication'

export class QtInputManager {
  public constructor() {
  }

  public complete(text: string) {
    console.log('[SoftKeyboard] cocos input complete ' + text);
    globalThis.qtinputmanager.callQtCommit(text);
  }

  public open(text: string) {
    console.log('[SoftKeyboard] cocos open keyboard');
    //globalThis.indexPage.dialogController.open();
    globalThis.showMessage = text;
    let windowClass = null;
    try {
      let qApp = QtApplication.getInstance();
      let windowStage = qApp.getWindowStage();
      let mainWindow = windowStage.getMainWindowSync();
      let property = mainWindow.getWindowProperties();
      let promise = windowStage.createSubWindow('EditBoxDialog');
      promise.then((data) => {
        windowClass = data;
        let promiseUI = windowClass.setUIContent('pages/components/EditBoxDialog.ets');
        promiseUI.then(() => {
          windowClass.showWindow();
          windowClass.setWindowBackgroundColor('#00000000');
          windowClass.resize(property.windowRect.width, 30);
          windowClass.moveWindowTo(0, property.windowRect.height - 30)
        });
      });
    } catch (exception) {
      console.error('Failed to create the subwindow. Cause: ' + JSON.stringify(exception));
      //globalThis.qtwindowmanager.createWindowResult(false);
    }
    ;
  }

  public close() {
    console.log('[SoftKeyboard] cocos close keyboard');
    //globalThis.indexPage.dialogController.close();
    let windowClass = null;
    try {
      windowClass = window.findWindow('EditBoxDialog');
      windowClass.destroyWindow();
    } catch (exception) {
      console.error('Failed to find the Window. Cause: ' + JSON.stringify(exception));
    }

  }

  setKeyBoardVisible(visible: boolean) {
    console.log('show keyboard 555555555555555555555555555555555555555555555', visible);
  }
}