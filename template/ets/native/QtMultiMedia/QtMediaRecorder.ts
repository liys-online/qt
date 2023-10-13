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


import to from './QtUtils'
import media from '@ohos.multimedia.media';

export class MediaRecorder {
    private mRecorder: media.AVRecorder = null;

    constructor() {
    }

    private async hasRecorder() {
        if (null != this.mRecorder) {
            return true;
        }

        let [error, record] = await to(media.createAVRecorder());
        if (null != error) {
            console.error(`createAVRecorder catchCallback, error:${error}`);
            return false;
        }
        this.mRecorder = record;
        return true;
    }

    async release() {
        if (this.hasRecorder()) {
            let [error, placeholder] = await to(this.mRecorder.release());
            if (null != error) {
                console.error('release AVRecorder failed and catch error is ' + error.message);
            }
        }
    }

    /* NOTE 配置项数据,C++端调用时传入json字符串 */
    async prepare(configs:string) {
        if (this.hasRecorder()) {
            //TODO
            var obj = JSON.parse(configs);
            let AVRecorderProfile = {
                audioBitrate : 48000,
                audioChannels : 2,
                audioCodec : media.CodecMimeType.AUDIO_AAC,
                audioSampleRate : 48000,
                fileFormat : media.ContainerFormatType.CFT_MPEG_4,
                videoBitrate : 48000,
                videoCodec : media.CodecMimeType.VIDEO_MPEG4,
                videoFrameWidth : 640,
                videoFrameHeight : 480,
                videoFrameRate : 30
            }
            let AVRecorderConfig = {
                audioSourceType : media.AudioSourceType.AUDIO_SOURCE_TYPE_MIC,
                videoSourceType : media.VideoSourceType.VIDEO_SOURCE_TYPE_SURFACE_YUV,
                profile : AVRecorderProfile,
                url : 'fd://', // 文件需先由调用者创建，赋予读写权限，将文件fd传给此参数，eg.fd://45
                rotation : 0, // 合理值0、90、180、270，非合理值prepare接口将报错
                location : { latitude : 30, longitude : 130 }
            }

            this.mRecorder.prepare(AVRecorderConfig);
        }
    }

    async reset() {
        if (this.hasRecorder()) {
            let [error, placeholder] = await to(this.mRecorder.reset());
            if (null != error) {
                console.error('reset AVRecorder failed and catch error is ' + error.message);
            }
        }
    }

    async start() {
        if (this.hasRecorder()) {
            let [error, placeholder] = await to(this.mRecorder.start());
            if (null != error) {
                console.info('start AVRecorder failed and catch error is ' + error.message);
            }
        }
    }

    async stop() {
        if (this.hasRecorder()) {
            let [error, placeholder] = await to(this.mRecorder.stop());
            if (null != error) {
                console.info('stop AVRecorder failed and error is ' + error.message);
            }
        }
    }
}

