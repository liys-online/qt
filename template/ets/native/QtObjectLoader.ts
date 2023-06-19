/*
 * Copyright (C) 2022 Sinux Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { QtDialog } from './QtDialog'
import { QtPasteBoard } from './QtPasteBoard'
import { QtInputManager } from './QtInputManager'
import { QtWindowManager } from './QtWindowManager'
import { QtMediaPlayer } from './QtMediaPlayer'
import { QtAudioManager } from './QtAudioManager'

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
