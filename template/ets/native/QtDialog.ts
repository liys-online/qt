import promptAction from '@ohos.promptAction'
import picker from '@ohos.file.picker';
import QtApplication from './QtApplication'
import uri from '@ohos.uri';

export class QtDialog {
    private context  = QtApplication.getInstance().getAbilityContext()

    constructor() {
    }

    messageBox(handler, title, text, buttons) {
        var opt: promptAction.ShowDialogOptions = {
            title: title,
            message: text,
            buttons: [{
                text: "default",
                color: "#000000"
            }]
        };

        var first : promptAction.Button = {
            text: buttons[0],
            color: '#000000',
        }
        opt.buttons[0] = first;
        for (var i = 1; i < buttons.length; i++) {
            var button : promptAction.Button = {
                text: buttons[i],
                color: '#000000',
            }
            opt.buttons.push(button)
        }

        promptAction.showDialog(opt, (err, data) => {
            if (err) {
                console.log("show dialog error: ", JSON.stringify(err));
            }
            let index = err ? -1 : data.index;
            globalThis.qpa.dialogResult(handler, index);
        });
        return true;
    }

    isVideo(filter) {
        return filter.includes("mp4") || filter.includes("MPEG")
        || filter.includes("MPG") || filter.includes("DAT")
        || filter.includes("MOV") || filter.includes("FLV");
    }

    isAudio(filter) {
        return filter.includes("mp3") || filter.includes("wma") || filter.includes("ogg") || filter.includes("flac")
        || filter.includes("wv");
    }

    isImage(filter) {
        return filter.includes("png") || filter.includes("jpeg")
        || filter.includes("jpg") || filter.includes("bmp")
    }

    async openFileDialog(handler, filter) {
        // let isImage = this.isImage(filter);
        // let isVideo = this.isVideo(filter);
        // let isAudio = this.isAudio(filter);
        // if (isImage || isVideo) {
        //     const photoSelectOptions = new picker.PhotoSelectOptions();
        //     if (isImage)
        //         photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
        //     if (isVideo)
        //         photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.VIDEO_TYPE;
        //     if (isVideo && isImage)
        //         photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_VIDEO_TYPE;
        //     photoSelectOptions.maxSelectNumber = 5;
        //     const photoViewPicker = new picker.PhotoViewPicker();
        //     photoViewPicker.select(photoSelectOptions).then((photoSelectResult) => {
        //         console.info('photoViewPicker.select to file succeed and uri is:' + uri);
        //         globalThis.qpa.selectedFilesResult(handler, photoSelectResult.photoUris);
        //     }).catch((err) => {
        //         console.error(`Invoke photoViewPicker.select failed, code is ${err.code}, message is ${err.message}`);
        //         globalThis.qpa.selectedFilesResult(handler, []);
        //     })
        // } else if (isAudio) {
        //     const audioSelectOptions = new picker.AudioSelectOptions();
        //     const audioViewPicker = new picker.AudioViewPicker();
        //     audioViewPicker.select(audioSelectOptions).then(audioSelectResult => {
        //         globalThis.qpa.selectedFilesResult(handler, audioSelectResult);
        //         console.info('audioViewPicker.select to file succeed and uri is:' + JSON.stringify(audioSelectResult));
        //     }).catch((err) => {
        //         console.error(`Invoke audioViewPicker.select failed, code is ${err.code}, message is ${err.message}`);
        //         globalThis.qpa.selectedFilesResult(handler, []);
        //     })
        // } else  {
        //     const documentSelectOptions = new picker.DocumentSelectOptions();
        //     const documentViewPicker = new picker.DocumentViewPicker();
        //     documentViewPicker.select(documentSelectOptions).then((documentResult) => {
        //         console.info('documentViewPicker.select to file succeed and uri is:' + JSON.stringify(documentResult));
        //         globalThis.qpa.selectedFilesResult(handler, documentResult);
        //     }).catch((error) => {
        //         console.error(`Invoke documentViewPicker.select failed, code is ${error.code}, message is ${error.message}`);
        //         globalThis.qpa.selectedFilesResult(handler, []);
        //     });
        // }

        let config = {
            action: 'ohos.want.action.OPEN_FILE',
            parameters: {
                startMode: 'choose',
            }
        }

        this.context.startAbilityForResult(config).then((result) => {
            // 获取到文档文件的uri
            let select_item_list = result.want.parameters.select_item_list;

            globalThis.qpa.selectedFilesResult(handler, [select_item_list.toString()]);
        }).catch((error) => {
            console.log("open file dialog result", JSON.stringify(error));
            globalThis.qpa.selectedFilesResult(handler, []);
        });
        return true;
    }

    async saveFileDialog(handler, fileName) {
        // let isImage = this.isImage(fileName);
        // let isVideo = this.isVideo(fileName);
        // let isAudio = this.isAudio(fileName);
        // if (isImage || isVideo) {
        //     const photoSaveOptions = new picker.PhotoSaveOptions();
        //     photoSaveOptions.newFileNames = [fileName];
        //     const photoViewPicker = new picker.PhotoViewPicker();
        //     photoViewPicker.save(photoSaveOptions).then((photoResult) => {
        //         globalThis.qpa.selectedFilesResult(handler, photoResult);
        //     }).catch((error) => {
        //         console.error(`Invoke documentViewPicker.select failed, code is ${error.code}, message is ${error.message}`);
        //         globalThis.qpa.selectedFilesResult(handler, []);
        //     });
        // } else if (isAudio) {
        //     const audioSaveOptions = new picker.AudioSaveOptions();
        //     audioSaveOptions.newFileNames = [fileName];
        //     const audioViewPicker = new picker.AudioViewPicker();
        //     audioViewPicker.save(audioSaveOptions).then((audioResult) => {
        //         globalThis.qpa.selectedFilesResult(handler, audioResult);
        //     }).catch((error) => {
        //         console.error(`Invoke documentViewPicker.select failed, code is ${error.code}, message is ${error.message}`);
        //         globalThis.qpa.selectedFilesResult(handler, []);
        //     });
        // } else {
        //     const documentSaveOptions = new picker.DocumentSaveOptions();
        //     documentSaveOptions.newFileNames = [fileName];
        //     const documentViewPicker = new picker.DocumentViewPicker();
        //     documentViewPicker.save(documentSaveOptions).then((documentResult) => {
        //         globalThis.qpa.selectedFilesResult(handler, documentResult);
        //     }).catch((error) => {
        //         console.error(`Invoke documentViewPicker.select failed, code is ${error.code}, message is ${error.message}`);
        //         globalThis.qpa.selectedFilesResult(handler, []);
        //     });
        // }
        // return true;
        let config = {
            action: 'ohos.want.action.CREATE_FILE',
            parameters: {
                startMode: 'save',
                key_pick_file_name: [fileName],
                saveFile: fileName,
            }
        }

        this.context.startAbilityForResult(config, {windowMode: 0}).then((result) => {
            globalThis.qpa.selectedFilesResult(handler, [result.want.parameters.pick_path_return.toString()]);
        }, (error) => {
            console.info("startAbilityForResult Promise.Reject is called, error.code = " + error.code)
            globalThis.qpa.selectedFilesResult(handler, []);
        })
        return true;
    }
}