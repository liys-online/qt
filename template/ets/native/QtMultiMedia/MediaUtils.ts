/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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
import mediaLibrary from '@ohos.multimedia.mediaLibrary'
import QtApplication from '../QtApplication'

export class MediaUtils {
    private tag: string = 'MediaUtils'
    private mediaList: Array<mediaLibrary.FileAsset> = []
    private qtApp: QtApplication = QtApplication.getInstance()
    private mediaLib: mediaLibrary.MediaLibrary = mediaLibrary.getMediaLibrary(this.qtApp.getAbilityContext())

    async queryFile() {
        let fileKeyObj = mediaLibrary.FileKey
        let id = mediaLibrary.MediaType.VIDEO;
        let args = id.toString()
        let fetchOp = {
            selections: fileKeyObj.MEDIA_TYPE + '= ?',
            selectionArgs: [args],
        }
        const fetchFileResult = await this.mediaLib.getFileAssets(fetchOp)
        const asset = await fetchFileResult.getFirstObject();
        return asset;
    }

    getMediaList() {
        return this.mediaList
    }

    async getFdPath(fileAsset: any) {
        let fd = await fileAsset.open('Rw')
        return fd
    }

    async getFileAssetsFromType(mediaType: number) {
        let fileKeyObj = mediaLibrary.FileKey
        let fetchOp = {
            selections: `${fileKeyObj.MEDIA_TYPE}=?`,
            selectionArgs: [`${mediaType}`],
        }

        this.mediaLib = mediaLibrary.getMediaLibrary(QtApplication.getInstance().getAbilityContext())
        let fetchFileResult = await this.mediaLib.getFileAssets(fetchOp)
        if (fetchFileResult.getCount() > 0) {
            this.mediaList = await fetchFileResult.getAllObject()
        }
        return this.mediaList
    }
}