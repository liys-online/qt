import controller from '@ohos.nfc.controller';
import nfc from "libQt5Nfc.so";
import tag from '@ohos.nfc.tag';
import HashMap from '@ohos.util.HashMap';
import QtApplication from '../QtApplication'
import { QtNfcTag } from './QtNfcTag';
import { BusinessError } from '@ohos.base';

export class QtNfc {
  private tagsIndex: number = 0;
  private tags: HashMap<number, QtNfcTag> = null;

  constructor() {
    this.tags = new HashMap;
  }


  createTag(tagInfo: tag.TagInfo) {
    if (tagInfo == null || tagInfo == undefined) {
      console.log("no TagInfo to be created, ignore it.");
      return;
    }
    let nfcTag = new QtNfcTag(tagInfo);
    this.tagsIndex++;
    this.tags.set(this.tagsIndex, nfcTag);
    let name = "tagInfo" + this.tagsIndex;
    Reflect.defineProperty(globalThis, name, { value: nfcTag });
    nfc.nfcTargetDetected(name)
  }

  start() {
    controller.on("nfcStateChange", (data) => {
      console.log("controller on callback nfcState: " + data);
      nfc.nfcStateChanged(data);
    });

    try {
      let discTech = [tag.NFC_A, tag.NFC_B];
      tag.registerForegroundDispatch(QtApplication.getInstance().getElementName(), discTech, (err: BusinessError, tagInfo: tag.TagInfo) => {
        console.log("foreground callback: tag found tagInfo = ", JSON.stringify(tagInfo));
        globalThis.qtnfc.createTag(tagInfo);
      });
    } catch (e) {
      console.log("registerForegroundDispatch error: " + e.message);
    }
  }

  stop() {
    try {
      tag.unregisterForegroundDispatch(QtApplication.getInstance().getElementName());
    } catch (e) {
      console.log("registerForegroundDispatch error: " + e.message);
    }
    controller.off("nfcStateChange");
  }

  isAvailable(): boolean {
    return this.isSupported() && controller.isNfcOpen();
  }

  isSupported(): boolean {
    return canIUse("SystemCapability.Communication.NFC.Core")
  }
}