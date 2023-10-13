import { QtDialog } from './QtCore/QtDialog'
import { QtPasteBoard } from './QtCore/QtPasteBoard'
import { QtInputManager } from './QtCore/QtInputManager'
import { QtWindowManager } from './QtCore/QtWindowManager'
import { QtFileManager } from './QtCore/QtFileManager'

let classes = {
    "qtdialog": QtDialog,
    "qtpasteboard": QtPasteBoard,
    "qtinputmanager": QtInputManager,
    "qtwindowmanager": QtWindowManager,
    "qtfilemanager": QtFileManager,
}

export class QtObjectLoader {
    constructor() {

    }

    // Todo 动态加载
    createObject(name: string) {
        if (!classes.hasOwnProperty(name)) {
            return false;
        }
        var object = new classes[name];
        Reflect.defineProperty(globalThis, name, {value: object});
        return true;
    }
}