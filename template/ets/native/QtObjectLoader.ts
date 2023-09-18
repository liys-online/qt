import { QtDialog } from './QtDialog'
import { QtPasteBoard } from './QtPasteBoard'
import { QtInputManager } from './QtInputManager'
import { QtWindowManager } from './QtWindowManager'
import { QtMediaPlayer } from './QtMediaPlayer'
import { QtAudioManager } from './QtAudioManager'
import { QtFileManager } from './QtFileManager'

let classes = {
    "qtdialog": QtDialog,
    "qtpasteboard": QtPasteBoard,
    "qtinputmanager": QtInputManager,
    "qtwindowmanager": QtWindowManager,
    "qtmediaplayer": QtMediaPlayer,
    "qtaudiomanager": QtAudioManager,
    "qtfilemanager": QtFileManager,
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