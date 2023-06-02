import { QtDialog } from '../native/QtDialog'
import { QtPasteBoard } from '../native/QtPasteBoard'
import { QtInputManager } from '../native/QtInputManager'
import { QtWindowManager } from '../native/QtWindowManager'
import { QtMediaPlayer } from '../native/QtMediaPlayer'
import { QtAudioManager } from '../native/QtAudioManager'

let classes = {
    "qtdialog": QtDialog,
    "qtpasteboard": QtPasteBoard,
    "qtinputmanager": QtInputManager,
    "qtwindowmanager": QtWindowManager,
    "qtmediaplayer": QtMediaPlayer,
    "qtaudiomanager": QtAudioManager,
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