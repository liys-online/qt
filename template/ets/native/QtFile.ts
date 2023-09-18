import fs from '@ohos.file.fs';
import uri from '@ohos.uri';
import deviceInfo from '@ohos.deviceInfo'
import QtApplication  from './QtApplication'

export class QtFile {

  private uri = null;
  private file = null;
  private valid : Boolean = false;
  private offset : number = 0;


  constructor(uriString) {
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

  open(mode) {
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

   write(buffer) {
    try {
      return fs.writeSync(this.file.fd, buffer);
    } catch (error) {
      console.log("file write: ", error)
      return -1;
    }
  }

  seek(offset) {
    this.offset = offset;
    return true;
  }

  pos() {
    return this.offset;
  }

  size() {
    return fs.statSync(this.file.fd).size;
  }

  flush() {
    return true;
  }

  read(length) {
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

  close() {
    if (this.valid) {
      try {
        fs.closeSync(this.file);
      } catch (error) {
        console.log("file close", error);
      } finally {
        this.valid = false;
        return true;
      }
    }
  }
}