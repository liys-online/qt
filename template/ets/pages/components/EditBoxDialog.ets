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