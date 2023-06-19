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

import media from '@ohos.multimedia.media'
import { MediaUtils }  from './MediaUtils'
import mediaLibrary from '@ohos.multimedia.mediaLibrary'

export default class VideoPlayer {
    private videoPlayer = undefined
    private surfaceID: string = ''
    private finishCallBack: () => void = undefined
    private fileAsset: mediaLibrary.FileAsset = undefined
    private fd: number = undefined
    private mediaUtils = new MediaUtils;

    async create() {
        this.videoPlayer = await media.createVideoPlayer();
        this.videoPlayer.on('error', (error) => {
            console.info(`audio error called, errName is ${error.name}`);
            console.info(`audio error called, errCode is ${error.code}`);
            console.info(`audio error called, errMessage is ${error.message}`);
        });
        this.videoPlayer.on('playbackCompleted', () => {
            console.info('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx playbackCompleted success!');
        });
        this.videoPlayer.on('bufferingUpdate', (infoType, value) => {
            console.log('}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}video bufferingInfo type: ' + infoType);
            console.log('}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}video bufferingInfo value: ' + value);
        });
    }

    async setDisplaySurface(surfaceID) {
        console.log("??????????????????????????????????", this.surfaceID)
        this.surfaceID = surfaceID;
//        await this.videoPlayer.setDisplaySurface(this.surfaceID)
        return true;
    }

    async setDataSource(data) {
        let localFile = "file:";
        let start = data.substr(0, localFile.length);

        console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{", localFile, start, data)
        let url = ''
        if (start == localFile) {
            url = data.substr(localFile.length);
        } else {
            url = data;
        }

//        let fd = await QtApplication.getInstance().getAbilityConext().resourceManager.getRawFd('videoTest.mp4')
//        let fd = 'fd://56';
//        this.videoPlayer.url = fd;
//
//        this.videoPlayer.prepare();
//        console.log("dddddddddddddffffffffffffffffffffffffff");
    }

    async getMediaList() {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx 111111111111111")
        let mediaList = await this.mediaUtils.getFileAssetsFromType(mediaLibrary.MediaType.VIDEO)
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxx 2222222222222222222222")
        mediaList.forEach((file, index) => {
            this.fileAsset = file
        })
    }

    async prepareVideo() {
        this.fd = await this.fileAsset.open('r')
        return 'fd://' + this.fd
    }

    async play() {
        if (typeof (this.videoPlayer) != 'undefined') {
            //            await QtApplication.getInstance().getAbilityConext().requestPermissionsFromUser([
            //                'ohos.permission.MEDIA_LOCATION',
            //                'ohos.permission.READ_MEDIA',
            //                'ohos.permission.WRITE_MEDIA'
            //            ])
            //            await this.videoPlayer.play()
            console.log("<<<<<<<<<<<<<<<<xxxxxxxxxxxxxxxxxxxxxxxxxxx>>>>>>>>>>>>>>>>")
            await this.getMediaList()
            let fdPath = await this.prepareVideo()
            this.videoPlayer.url = fdPath;
            console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", this.videoPlayer.url, this.surfaceID);
            await this.videoPlayer.setDisplaySurface(this.surfaceID)
            await this.videoPlayer.prepare()
            await this.videoPlayer.play()
        }
    }

    async seek(time) {
        if (typeof (this.videoPlayer) != 'undefined') {
            await this.videoPlayer.seek(time)
        }
    }

    getCurrentTime() {
        if (typeof (this.videoPlayer) != 'undefined') {
            return this.videoPlayer.currentTime
        }
        return 0
    }

    async pause() {
        if (typeof (this.videoPlayer) != 'undefined') {
            await this.videoPlayer.pause()
        }
    }

    async stop() {
        if (typeof (this.videoPlayer) != 'undefined') {
            await this.videoPlayer.stop()
        }
    }

//    async reset(playSrc) {
//        if (typeof (this.videoPlayer) != 'undefined') {
//            this.playPath = playSrc
//            await this.videoPlayer.reset()
//            this.videoPlayer.url = this.playPath
//            await this.videoPlayer.prepare()
//            await this.videoPlayer.play()
//        }
//    }

    async release() {
        if (typeof (this.videoPlayer) != 'undefined') {
            await this.videoPlayer.release()
        }
    }

    setFinishCallBack(callback) {
        this.finishCallBack = callback
    }
}
