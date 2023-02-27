@Entry
@Component
struct EditBoxDialog {
  private showMessage: string = ''
  private inputMessage: string = ''
  onTextChange: (msg: string) => void
  accept: (msg: string) => void
  controller: CustomDialogController
  cancel: () => void
  confirm: () => void

  build() {
    Row() {
      TextInput()
        .backgroundColor('#ffffff')
        .layoutWeight(1)
        .onChange((value) => {
          if (this.onTextChange) {
            this.onTextChange(value);
          }
          this.inputMessage = value;
        })
      Blank(8).width(16)
      Button('完成').onClick(() => {
        globalThis.qtinputmanager.complete(this.inputMessage);
        this.inputMessage = '';
        globalThis.qtinputmanager.close();
      })
        .width('40%')
        .height('30%')
    }
    .backgroundColor(Color.Gray)
  }
}