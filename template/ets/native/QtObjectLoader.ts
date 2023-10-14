import { QtNfc } from './QtNfc/QtNfc'
import { QtDialog } from './QtCore/QtDialog'
import { QtSensors } from './QtSensors/QtSensors'
import { QtPasteBoard } from './QtCore/QtPasteBoard'
import { QtMediaPlayer } from './QtMultiMedia/QtMediaPlayer'
import { QtFileManager } from './QtCore/QtFileManager'
import { QtInputManager } from './QtCore/QtInputManager'
import { QtAudioManager } from './QtMultiMedia/QtAudioManager'
import { QtWindowManager } from './QtCore/QtWindowManager'
import { QtBluetoothServer } from './QtBluetooth/QtBluetoothServer'
import { QtBluetoothManager } from './QtBluetooth/QtBluetoothManager'

let classes = {
  "qtnfc": QtNfc,
  "qtdialog": QtDialog,
  "qtsensors": QtSensors,
  "qtpasteboard": QtPasteBoard,
  "qtmediaplayer": QtMediaPlayer,
  "qtfilemanager": QtFileManager,
  "qtaudiomanager": QtAudioManager,
  "qtinputmanager": QtInputManager,
  "qtwindowmanager": QtWindowManager,
  "qtbluetoothserver": QtBluetoothServer,
  "qtbluetoothmanager": QtBluetoothManager
}

export class QtObjectLoader {
  constructor() {

  }

  // Todo 动态加载
  createObject(name) {
    if (!classes.hasOwnProperty(name)) {
      return false;
    }
    var object = new classes[name];
    Reflect.defineProperty(globalThis, name, { value: object });
    return true;
  }
}