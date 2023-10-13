import { QtFile } from './QtFile';

export class QtFileManager {

  async createFile(fileHandler: string, fileName: string) : Promise<boolean> {
    let file = new QtFile(fileName);
    console.log("create js file object for file: ", fileHandler, fileName)
    Reflect.defineProperty(globalThis, fileHandler, {value: file});
    return true;
  }

  async deleteFile(fileHandler: string) : Promise<boolean> {
    console.log("delete js file object for: ", fileHandler)
    Reflect.deleteProperty(globalThis, fileHandler);
    return true;
  }
}