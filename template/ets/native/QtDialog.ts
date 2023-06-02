import promptAction from '@ohos.promptAction'

export class QtDialog {

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

    async fileDialog(handler, open) {
        console.log("ddddddddddddddddddddddddddddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", handler, open);
//        globalThis.abilityContext.startAbilityForResult({
//            bundleName: "com.ohos.filepicker",
//            abilityName: "MainAbility",
//            parameters: {
//                 startMode: 'choose'
//            }
//            }, { windowMode: 102 }).then(async (data) => {
//                let result = data.want.parameters.result
//                console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{", JSON.stringify(result));
//                var files = []
//                files.push("/data/el1/1.txt");
//                globalThis.qpa.selectedFilesResult(handler, files);
//            })
        let config = {
            action: 'ohos.want.action.OPEN_FILE',
            parameters: {
                startMode: 'choose',
            }
        }
        try {
            let result = await globalThis.abilityContext.startAbilityForResult(config, {windowMode: 1});
            if (result.resultCode !== 0) {
                console.error(`DocumentPicker.select failed, code is ${result.resultCode}, message is ${result.want.parameters.message}`);
                return;
            }
            // 获取到文档文件的URI
            let select_item_list = result.want.parameters.select_item_list;
            console.log("ddddddddddddddddddddddd", JSON.stringify(select_item_list))
            // 获取到文档文件的文件名称
            let file_name_list = result.want.parameters.file_name_list;
            console.log("yyyyyyyyyyyyyyyyyyyyyyyy", JSON.stringify(file_name_list))
        } catch (err) {
            console.error(`Invoke documentPicker.select failed, code is ${err.code}, message is ${err.message}`);
        }

        return true;
    }
}