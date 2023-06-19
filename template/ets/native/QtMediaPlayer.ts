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


import media from '@ohos.multimedia.media';
import HashMap from '@ohos.util.HashMap';
import VideoPlayer from './VideoPlayer'

export class QtMediaPlayer {
    private avPlayers = null;
    private surfaceIds = null;
    private unsetPlayers = null;
    constructor() {
        this.avPlayers = new HashMap;
        this.surfaceIds = new HashMap;
        this.unsetPlayers = new HashMap;
    }

    async createPlayer(player) {
        var p = new VideoPlayer;
        await p.create();
        this.avPlayers.set(player, p);
        return true;
    }

    async setDisplay(player, name) {
        // 如果surfaceId已经创建,取出id,并设置，如果没有则保存下来等待surfaceId
        if (this.surfaceIds.hasKey(name)) {
            var surfaceId = this.surfaceIds.get(name)
            var p = this.avPlayers.get(player);
            await p.setDisplaySurface(surfaceId);
        } else {
            this.unsetPlayers.set(name, player);
        }
    }

    async setSurfaceId(name, id) {
        if (this.unsetPlayers.hasKey(name)) {
            var p = this.unsetPlayers.get(name);
            if (this.avPlayers.hasKey(p)) {
                var player = this.avPlayers.get(p)
                await player.setDisplaySurface(id);
                this.unsetPlayers.remove(name);
            }

        } else {
            this.surfaceIds.set(name, id);
        }
    }

    setDataSource(player, data) {
        if (this.avPlayers.hasKey(player)) {
            var p = this.avPlayers.get(player)
            p.setDataSource(data)
            return true;
        }
        return false;
    }

    play(player) {
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb", this.avPlayers.hasKey(player))
        if (this.avPlayers.hasKey(player)) {
            var p = this.avPlayers.get(player);
            p.play();
            return true;
        }
        return false;
    }
}
