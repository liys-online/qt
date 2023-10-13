import tag from '@ohos.nfc.tag';

export class QtNfcTag {
  private tagInfo: tag.TagInfo = null;
  private target = null;

  constructor(tagInfo: tag.TagInfo) {
    this.tagInfo = tagInfo;
    let target = null;
    for (let i = 0; i < this.tagInfo.technology.length; i++) {
      if (this.tagInfo.technology[i] == tag.NFC_A) {
        target = tag.getNfcA(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.NFC_B) {
        target = tag.getNfcB(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.ISO_DEP) {
        target = tag.getIsoDep(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.NFC_F) {
        target = tag.getNfcF(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.NFC_V) {
        target = tag.getNfcV(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.NDEF) {
        target = tag.getNdef(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.NDEF_FORMATABLE) {
        target = tag.getNdefFormatable(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.MIFARE_CLASSIC) {
        target = tag.getMifareClassic(this.tagInfo);
        break;
      }
      if (this.tagInfo.technology[i] == tag.MIFARE_ULTRALIGHT) {
        target = tag.getMifareUltralight(this.tagInfo);
        break;
      }
      this.target = target;
    }
  }

  uid(): ArrayBuffer {
    let arrayBuffer = new Uint8Array(this.tagInfo.uid).buffer;
    return arrayBuffer;
  }

  technologies(): string {
    return this.tagInfo.technology.join(",");
  }

  getNdefMessage(): string {
    let isNdef = false;
    for (let i = 0; i < this.tagInfo.technology.length; i++) {
      if (this.tagInfo.technology[i] == tag.NDEF) {
        isNdef = true;
        break;
      }
    }
    if (!isNdef)
      return null;
    try {
      let ndefTag = tag.getNdef(this.tagInfo);
      let message = ndefTag.getNdefMessage();
      return JSON.stringify(message);
    } catch (error) {
      console.log("tag.getNdefTag catched error: " + error);
      return null;
    }
  }

  isInRange(): boolean {
    return true;
  }

  maxCommandLength(): number {
    if (this.target != null)
      return this.target.getMaxTransmitSize();
    return 0;
  }

  connect(): boolean {
    if (this.target != null) {
      try {
        this.target.connect();
        return true;
      } catch (error) {
        console.log("tag connect busiError: " + error);
        return false;
      }
    }
    return false;
  }

  isConnected(): boolean {
    if (this.target != null)
      return this.target.isConnected();
    return false;
  }

  async transceive(data): Promise<ArrayBuffer> {
    if (this.target == null)
      return null;
    try {
      let result = await this.target.sendData(data);
      let arrayBuffer = new Uint8Array(result).buffer;
      return arrayBuffer;
    } catch (err) {
      console.log("tagSession sendData Promise err: " + err);
      return null;
    }
  }

  format(data) {
    if (this.target == null)
      return;
    let message = tag.ndef.createNdefMessage(data);
    this.target.format(message);
  }

  writeNdefMessage(data: number[]) {
    if (this.target == null)
      return;
    let message: tag.NdefMessage = tag.ndef.createNdefMessage(data);
    try {
      this.target.writeNdef(message);
    } catch (error) {
      console.log("ndef writeNdef Promise catch busiError Code: ${(busiError as Businsess).code}, " +
        "message: ${(busiError as Businsess).message}");
    }
  }

  getType(): string {
    if (this.target == null)
      return "";
    let type = this.target.getNdefTagType();
    try {
      return this.target.getNdefTagTypeString(type);
    } catch (err) {
      console.log("ndef getNdefTagTypeString catch busiError Code: ${(busiError as Businsess).code}, " +
        "message: ${(busiError as Businsess).message}");
    }
  }

  getAtqa(): ArrayBuffer {
    if (this.target == null)
      return null;
    let result = this.target.getAtqa();
    let arrayBuffer = new Uint8Array(result).buffer;
    return arrayBuffer;
  }

  getSak(): number {
    if (this.target == null)
      return 0;
    return this.target.getSak();
  }

  close(): boolean {
    if (this.target == null)
      return true;
    //Todo close
    return true;
  }
}