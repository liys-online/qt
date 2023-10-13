import mediaLibrary from '@ohos.multimedia.mediaLibrary'
import QtApplication from '../QtApplication'
import abilityAccessCtrl from '@ohos.abilityAccessCtrl';

export class MediaUtils {
  private tag: string = 'MediaUtils'
  private mediaList: Array<mediaLibrary.FileAsset> = []
  private qtApp: QtApplication = QtApplication.getInstance()
  private atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
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
    await this.atManager.requestPermissionsFromUser(QtApplication.getInstance().getAbilityContext(), [
      'ohos.permission.MEDIA_LOCATION',
      'ohos.permission.READ_MEDIA',
      'ohos.permission.WRITE_MEDIA'
    ])
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