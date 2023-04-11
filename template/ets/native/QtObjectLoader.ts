import { QtDialog } from '../native/QtDialog'
import { QtPasteBoard } from '../native/QtPasteBoard'
import { QtInputManager } from '../native/QtInputManager'
import { QtAudioManager } from '../native/QtAudioManager'
import { QtWindowManager } from '../native/QtWindowManager'
import { QtCameraManager } from '../native/QtCameraManager'
import { QtBtDeviceDiscoveryAgent } from '../native/QtBtDeviceDiscoveryAgent'

let classes = {
    "qtdialog": QtDialog,
    "qtpasteboard": QtPasteBoard,
    "qtinputmanager": QtInputManager,
    "qtaudiomanager" : QtAudioManager,
    "qtwindowmanager": QtWindowManager,
    "qtcameramanager" : QtCameraManager,
    "qtbtdevicediscoveryagent" : QtBtDeviceDiscoveryAgent,
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