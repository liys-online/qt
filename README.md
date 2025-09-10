# 贡献说明

由于Qt源码包含多个Qt子库，遵循社区管理要求，Qt For OpenHarmony采用代码补丁与独立适配模块的方式进行贡献。

## 代码补丁生成

使用"git diff"命令生成代码补丁，提交补丁到对应的Patch目录下。

> 各子库使用"submodulename.patch"的命名方式对子库适配代码补丁进行管理，例如在qtbase子仓库目录下执行"git diff v5.15.12 > qtbase.patch"可生成对应的qtbase子模块代码补丁，生成代码补丁后，遵循OpenHarmony社区要求提交到主仓库分支。

# 目录说明

```
OpenHarmony - Qt
│
└───patch - 源码补丁
|____v5.15.12
│   	│ qtbase - qtbase子模块代码补丁
│   	│ qtsensors - qtsensors子模块代码补丁
│   	│ qtmultimedia - qtmultimedia子模块代码补丁
│   	│ qtdeclarative - qtdeclarative子模块代码补丁
│   	│ qtconnectivity - qtconnectivity子模块代码补丁
│   	│ qtquickcontrols - qtquickcontrols子模块代码补丁
└───LICENSE - Apache License
└───LICENSE.FDL - GNU Free Documentation License
└───LICENSE.GPLv2 - GNU GENERAL PUBLIC LICENSE Version 2
└───LICENSE.GPLv3 - GNU GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv3 - GNU LESSER GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv21 - GNU LESSER GENERAL PUBLIC LICENSE Version 2.1
└───LICENSE.QT-LICENSE-AGREEMENT - QT LICENSE AGREEMENT Agreement
└───OAT.xml - OAT配置文件，OpenHarmony社区的自动化开源审视工具
└───README.md - 中文版本readme
└───README.en.md - 英文版本readme
```

# Qt For OpenHarmony 使用说明

参见仓库wiki：https://gitcode.com/openharmony-sig/qt/wiki/Home.md
