import window from '@ohos.window';
import display from '@ohos.display';
import fs from '@ohos.file.fs';
import common from '@ohos.app.ability.common';
import resourceManager from '@ohos.resourceManager';
import qpa from "libplugins_platforms_qopenharmony.so";
import { QtObjectLoader } from './QtObjectLoader'
import bundleManager from '@ohos.bundle.bundleManager';

export default class QtApplication {
  private static instance: QtApplication;

  private constructor() {
  }

  private context: common.UIAbilityContext = null;
  private mainWindow: window.Window = null;
  private mainWindowName: string = "opemharmony_qt_mainwindow";
  private windowStage: window.WindowStage;
  private dirs = null;
  private elementName: bundleManager.ElementName = null;

  public static getInstance(): QtApplication {
    if (!QtApplication.instance) {
      QtApplication.instance = new QtApplication();
    }

    return QtApplication.instance;
  }

  setContext(context: common.UIAbilityContext) {
    this.context = context;
    var appContext = this.context.getApplicationContext();
    this.dirs = {
      "tempDir": appContext.tempDir,
      "filesDir": appContext.filesDir,
      "cacheDir": appContext.cacheDir,
      "databaseDir": appContext.databaseDir,
      "bundleCodeDir": appContext.bundleCodeDir,
      "preferencesDir": appContext.preferencesDir,
      "distributedFilesDir": appContext.distributedFilesDir,
      "qmlDir": appContext.cacheDir + "/Qt/qml"
    };
  }

  setElementName(en: bundleManager.ElementName) {
    this.elementName = en;
  }

  getElementName(): bundleManager.ElementName {
    return this.elementName;
  }

  getAbilityContext(): common.UIAbilityContext {
    return this.context;
  }

  getWindowStage(): window.WindowStage {
    return this.windowStage;
  }

  getMainWindow(): window.Window {
    return this.mainWindow;
  }

  getMainWindowName(): string {
    return this.mainWindowName;
  }

  async run(windowStage: window.WindowStage) {
    this.windowStage = windowStage;
    this.mainWindow = this.windowStage.getMainWindowSync();
    globalThis.createWindowName = this.mainWindowName;
    windowStage.loadContent('pages/Index');
    this.mainWindow.on('windowSizeChange', (data) => {
      console.info('Succeeded in enabling the listener for window size. Data: ' + JSON.stringify(data));
      let d = display.getDefaultDisplaySync();
      qpa.setDisplayMetrics(d.densityDPI, d.densityPixels, d.scaledDensity, data.width, data.height, data.width, data.height);
    });
    this.windowStage.on("windowStageEvent", (state) => {
      qpa.updateApplicationState(state);
      console.log("window stage changed", state);
    });
    await this.extractFilesToCache();
    this.loadQtApplication()
  }

  quit() {
    qpa.quitQtApplication();
  }

  loadQtApplication() {
    globalThis.qtobjectloader = new QtObjectLoader();
    globalThis.qpa = qpa;
    qpa.startQtApplication(this.dirs, "libentry.so");
  }

  private saveFileToCache(file: resourceManager.RawFileDescriptor, des: string) {
    let paths = des.split("/").slice(0, -1);
    let temp = this.dirs.cacheDir + "/";
    for (let i = 0; i < paths.length; ++i) {
      temp = temp + paths[i];
      let result = fs.accessSync(temp);
      if (!result) {
        fs.mkdirSync(temp);
      }
      temp = temp + "/";
    }

    let fileName = this.dirs.cacheDir + "/" + des;
    // 创建缓存文件(当前是覆盖式创建)
    let cacheFile = fs.openSync(fileName,
      fs.OpenMode.WRITE_ONLY | fs.OpenMode.CREATE | fs.OpenMode.TRUNC)
    let buffer = new ArrayBuffer(4096);
    let currentOffset = file.offset;
    let lengthNeedToReed = file.length;
    let readOption = {
      offset: currentOffset,
      length: lengthNeedToReed > buffer.byteLength ? 4096 : lengthNeedToReed
    }
    while (true) {
      // 读取buffer容量的内容
      let readLength = fs.readSync(file.fd, buffer, readOption);
      // 写入buffer容量的内容
      fs.writeSync(cacheFile.fd, buffer, {
        length: readLength
      })
      // 判断后续内容 修改读文件的参数
      if (readLength < 4096) {
        break;
      }
      lengthNeedToReed -= readLength;
      readOption.offset += readLength;
      readOption.length = lengthNeedToReed > buffer.byteLength ? 4096 : lengthNeedToReed;
    }
    fs.close(cacheFile);
  }

  async extractFile(src: string) {
    try {
      let R = this.context.resourceManager;
      let file: resourceManager.RawFileDescriptor = await R.getRawFd(src);
      this.saveFileToCache(file, src);
    } catch (err) {
      console.log("extract file failed: ", JSON.stringify(err), src);
    }
  }

  async extractFilesToCache() {
    try {
      let R = this.context.resourceManager;
      let rawContent: Uint8Array = await R.getRawFileContent("qt.json");
      let str: string = String.fromCharCode.apply(null, rawContent)
      let files = JSON.parse(str);
      for (var i = 0; i < files.files.length; ++i) {
        await this.extractFile(files.files[i]);
      }
    } catch (err) {
      console.log("read file qt.json failed: ", JSON.stringify(err));
    }
  }
}