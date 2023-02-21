import pasteboard from '@ohos.pasteboard';
import LightWeightMap from '@ohos.util.LightWeightMap';

export class QtPasteBoard {

    constructor() {
    }

    async registerSystemPasteboard() {
        let systemPasteboard = pasteboard.getSystemPasteboard();
        systemPasteboard.on('update', () => {
            globalThis.qpa.pasteChanged();
        });
        return true;
    }

    async hasClipboardText() {
        let systemPasteboard = pasteboard.getSystemPasteboard();
        let result = await systemPasteboard.hasPasteData()
        return result;
    }

    async clipboardText() {
        let systemPasteboard = pasteboard.getSystemPasteboard();
        let pastedata = await systemPasteboard.getPasteData();
        let result = pastedata.getPrimaryText();
        return result;
    }

    setClipboardText(text) {
        console.log('set clipboard text', text);
        var pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
        let systemPasteboard = pasteboard.getSystemPasteboard();
        systemPasteboard.setPasteData(pasteData);
        return true;
    }
}