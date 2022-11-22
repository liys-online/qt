# 贡献说明

由于Qt源码包含多个Qt子库，遵循社区管理要求，Qt For OpenHarmony采用代码补丁的方式进行贡献。

## 子库地址

Gitee子仓库只包含了Qt For OpenHarmony需要修改的子库，主仓库只存放代码补丁，为方便适配代码版本管理和同步，使用以下子库辅助完成适配代码管理。

- qtbase: https://gitee.com/cwc1987/qtbase
- qtconnectivity：https://gitee.com/cwc1987/qtconnectivity
- qtdeclarative：https://gitee.com/cwc1987/qtdeclarative
- qtlocation：https://gitee.com/cwc1987/qtlocation
- qtmultimedia：https://gitee.com/cwc1987/qtmultimedia
- qtsensors：https://gitee.com/cwc1987/qtsensors
- qtsystems：https://gitee.com/cwc1987/qtsystems
- qtvirtualkeyboard：https://gitee.com/cwc1987/qtvirtualkeyboard
- qtremoteobjects：https://gitee.com/cwc1987/qtremoteobjects

## 代码补丁生成

使用"git diff"命令生成代码补丁，代码补丁以子库命名的方式进行存放，如qtbase.patch，qtconnectivity.patch。

> 各子库使用xxxx-ohos的命名方式对适配分支进行代码分支管理，例如"git diff v5.12.12 5.12.12-ohos > qtbase.patch"生成qtbase子模块的5.12.12适配代码补丁，生成代码补丁后，遵循OpenHarmony社区要求提交主仓库补丁。

# 分支说明

- master：存放仓库说明，不存放补丁代码
- Qt5.12.12：存放Qt5.12.12版本Qt For OpenHarmony代码补丁

# 版本支持信息

适配分支代码支持情况参见各分支README.md，包括支持模块、支持功能及对应的OpenHarmony版本号。