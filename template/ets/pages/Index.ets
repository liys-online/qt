@Entry
@Component
struct Index {
  private xcomponentController: XComponentController = new XComponentController();
  private idName = globalThis.createWindowName
  private surfaceId: string = ''

  build() {
      Row() {
        XComponent({id: this.idName, type: 'surface', libraryname: 'plugins_platforms_qopenharmony' }).width("100%").height("100%")
          .onLoad(()=>{
          })
    }
  }
}