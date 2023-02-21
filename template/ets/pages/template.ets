//@Entry
//@Component
//struct template {
//  build() {
//    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
//      XComponent({ id: globalThis.createWindowName, type: 'texture', libraryname: 'plugins_platforms_qopenharmony'})
//        .onLoad((context) => {
//          console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
//        })
//        .onDestroy(() => {
//        })
//    }
//    .width('100%')
//    .height('100%')
//  }
//}

@Entry
@Component
struct template {
  build() {
    Row() {
      XComponent({ id: globalThis.createWindowName, type: 'texture', libraryname: 'plugins_platforms_qopenharmony'})
        .onLoad((context) => {
          console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
        })
        .onDestroy(() => {
        })
    }
    .width('100%')
    .height('100%')
  }
}

