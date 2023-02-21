import display from '@ohos.display';
import { QtDialog } from '../native/QtDialog'
import { QtPasteBoard } from '../native/QtPasteBoard'
import { QtInputManager } from '../native/QtInputManager'
import { QtWindowManager } from '../native/QtWindowManager'

@Entry
@Component
struct Index {
  private context = null;
  @State eventType: string = ''
  message: string = '获取剪切板数据'
  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      XComponent({ id: 'main', type: 'texture', libraryname: 'plugins_platforms_qopenharmony'})
        .onLoad((context) => {
          this.context = context;
          var xComponentContext = getContext(this);
          globalThis.qtdialog = new QtDialog();
          globalThis.qtinputmanager = new QtInputManager();
          globalThis.qtpasteboard = new QtPasteBoard();
          globalThis.qtwindowmanager = new QtWindowManager();
          globalThis.qpa = context;
          let d = display.getDefaultDisplaySync();
          var argsList: string = xComponentContext.tempDir + ";" +
          xComponentContext.filesDir + ";" +
          xComponentContext.cacheDir + ";" +
          xComponentContext.databaseDir + ";" +
          xComponentContext.bundleCodeDir + ";" +
          xComponentContext.preferencesDir + ";" +
          xComponentContext.distributedFilesDir;
          console.info("path<-----------: ", argsList);
        })
        .onDestroy(() => {
          this.context.quitQtApplication();
        })
    }
    .width('100%')
    .height('100%')
  }
//  build() {
//    Row() {
//      Column() {
//        Text(this.message)
//          .fontSize(50)
//          .fontWeight(FontWeight.Bold)
//        Button("创建子窗口").fontSize(20).onClick(()=>{
//          this.windowmanager = new QtWindowManager();
//          this.windowmanager.createWindow('22222')
//        })
//      }
//      .width('100%')
//    }
//    .height('100%')
//  }
}


