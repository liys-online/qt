import media from '@ohos.multimedia.media';
import mediaLibrary from '@ohos.multimedia.mediaLibrary';

export class QtMultimediaUtils {
    private media = mediaLibrary.getMediaLibrary(globalThis.appContext);

    constructor(){}

    async getMediaDirectory(type:number){
        const dictResult = await this.media.getPublicDirectory(type);
        return dictResult;
    }
}