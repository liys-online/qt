import fs from '@ohos.file.fs';
import deviceInfo from '@ohos.deviceInfo'

export class QtFile {

  private uri : string = '';
  private file : fs.File= null;
  private valid : boolean = false;
  private offset : number = 0;


  constructor(uriString: string) {
    let _uri = uriString;
    const versionRegex = /(\d+\.\d+\.\d+\.\d+)/;
    const match = deviceInfo.displayVersion.match(versionRegex);
    let version = '';
    if (match) {
      version = match[0]
    }
    if (version != '' && version.localeCompare("4.0.7.5") == -1)
      _uri = _uri.replace("datashare://", "file:")
    this.uri = _uri;
  }

  open(mode: number): boolean {
    try {
      console.log("open file:", this.uri, mode)
      this.file = fs.openSync(this.uri, mode);
      this.valid = true;
    } catch (error) {
      console.log("file open: ", error)
      this.valid = false;
    } finally {
      return this.valid;
    }
  }

   write(buffer : ArrayBuffer): number {
    try {
      return fs.writeSync(this.file.fd, buffer);
    } catch (error) {
      console.log("file write: ", error)
      return -1;
    }
  }

  seek(offset: number): boolean {
    this.offset = offset;
    return true;
  }

  pos(): number {
    return this.offset;
  }

  size(): number {
    return fs.statSync(this.file.fd).size;
  }

  flush(): boolean {
    return true;
  }

  read(length: number): ArrayBuffer {
    let buf = new ArrayBuffer(length);
    try {
      let options = { "offset": this.offset, "length": length }
      let result = fs.readSync(this.file.fd, buf, options);
      this.offset = this.offset + result;
      return buf;
    } catch (error) {
      console.log("file read error: ", error);
      return null;
    }
  }

  close(): boolean {
    if (this.valid) {
      try {
        fs.closeSync(this.file);
      } catch (error) {
        console.log("file close", error);
      } finally {
        this.valid = false;
        return true;
      }
    } else {
      return true;
    }
  }
}