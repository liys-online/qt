import pasteboard from '@ohos.pasteboard';

export class QtPasteBoard {

    constructor() {
        let systemPasteboard = pasteboard.getSystemPasteboard();
        systemPasteboard.on('update', () => {
            globalThis.qpa.pasteChanged();
        });
    }

    async hasClipboardText() : Promise<boolean> {
        let systemPasteboard = pasteboard.getSystemPasteboard();
        let result = await systemPasteboard.hasPasteData()
        return result;
    }

    async clipboardText() : Promise<string> {
        let systemPasteboard = pasteboard.getSystemPasteboard();
        let pastedata = await systemPasteboard.getPasteData();
        let result = pastedata.getPrimaryText();
        return result;
    }

    setClipboardText(text: string) : boolean {
        console.log('set clipboard text', text);
        var pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
        let systemPasteboard = pasteboard.getSystemPasteboard();
        systemPasteboard.setPasteData(pasteData);
        return true;
    }
}