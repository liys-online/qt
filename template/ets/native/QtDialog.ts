import prompt from '@ohos.prompt'

export class QtDialog {

    constructor() {
    }

    messageBox(handler, title, text, buttons) {
        var opt: prompt.ShowDialogOptions = {
            title: title,
            message: text,
            buttons: [{
                text: "default",
                color: "#000000"
            }]
        };

        var first : prompt.Button = {
            text: buttons[0],
            color: '#000000',
        }
        opt.buttons[0] = first;
        for (var i = 1; i < buttons.length; i++) {
            var button : prompt.Button = {
                text: buttons[i],
                color: '#000000',
            }
            opt.buttons.push(button)
        }

        prompt.showDialog(opt, (err, data) => {
            let index = err ? -1 : data.index;
            globalThis.qpa.dialogResult(handler, index);
        });
    }

    fileDialog(open) {
        globalThis.abilityContext.startAbilityForResult({
            bundleName: "com.ohos.filepicker",
            abilityName: "MainAbility",
            parameters: {
                startMode: open ? 'choose' : 'save'
            }
        }).then(async (data) => {
            let result = data.want.parameters.result
            globalThis.qpa.selectedFilesResult(result);
        })
    }
}