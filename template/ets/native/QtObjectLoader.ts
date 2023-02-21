import { QtDialog } from '../native/QtDialog'
import { QtPasteBoard } from '../native/QtPasteBoard'
import { QtInputManager } from '../native/QtInputManager'
import { QtWindowManager } from '../native/QtWindowManager'

let classes = {
    "qtdialog": QtDialog,
    "qtpasteboard": QtPasteBoard,
    "qtinputmanager": QtInputManager,
    "qtwindowmanager": QtWindowManager,
}

export class QtObjectLoader {
    constructor() {
    }

    createObject(name) {
        if (!classes.hasOwnProperty(name)) {
            return false;
        }
        var object = new classes[name];
        Reflect.defineProperty(globalThis, name, {value: object});
        return true;
    }
}