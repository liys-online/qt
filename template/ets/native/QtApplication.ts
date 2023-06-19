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

import Window from '@ohos.window';
import display from '@ohos.display';
import fs from '@ohos.file.fs';
import resourceManager from '@ohos.resourceManager';
import qpa from "libplugins_platforms_qopenharmony.so";
import { QtObjectLoader } from './QtObjectLoader'

export default class QtApplication {
  private static instance: QtApplication;

  private constructor() {
  }

  private context = null;
  private mainWindow: Window.Window = null;
  private mainWindowName: string = "opemharmony_qt_mainwindow";
  private windowStage: Window.WindowStage;
  private dirs = null

  public static getInstance(): QtApplication {
    if (!QtApplication.instance) {
      QtApplication.instance = new QtApplication();
    }

    return QtApplication.instance;
  }

  setContext(context) {
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

  getAbilityContext() {
    return this.context;
  }

  getWindowStage(): Window.WindowStage {
    return this.windowStage;
  }

  getMainWindow(): Window.Window {
    return this.mainWindow;
  }

  getMainWindowName(): string {
    return this.mainWindowName;
  }

  async run(windowStage: Window.WindowStage) {
    this.windowStage = windowStage;
    this.mainWindow = this.windowStage.getMainWindowSync();
    globalThis.createWindowName = this.mainWindowName;
    windowStage.loadContent('pages/Index');
    this.mainWindow.on('windowSizeChange', (data) => {
      console.info('Succeeded in enabling the listener for window size. Data: ' + JSON.stringify(data));
      let d = display.getDefaultDisplaySync();
      qpa.setDisplayMetrics(d.densityDPI, d.densityPixels, d.scaledDensity, data.width, data.height, data.width, data.height);
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
    qpa.startQtApplication(this.dirs, "libQtForHarmony.so");
    // qpa.startQtApplication(this.dirs, "libplanets-qml.so");
    // qpa.startQtApplication(this.dirs, "libQmlTest.so");
  }

  private saveFileToCache(file, des) {
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

  async extractFile(src) {
    try {
      let R = this.context.resourceManager;
      let file = await R.getRawFileDescriptor(src);
      this.saveFileToCache(file, src);
    } catch (err) {
      console.log("extract file failed: ", JSON.stringify(err), src);
    }
  }

  async extractFilesToCache() {
    try {
      let R = this.context.resourceManager;
      let rawContent = await R.getRawFile("qt.json");
      let str = String.fromCharCode.apply(null, rawContent)
      let files = JSON.parse(str);
      for (var i = 0; i < files.files.length; ++i) {
        await this.extractFile(files.files[i]);
      }
    } catch (err) {
      console.log("read file qt.json failed: ", JSON.stringify(err));
    }
  }
}
