# Contribution Note

Since the Qt source code contains multiple Qt sub-module, following the requirements of community management, Qt For OpenHarmony contributes in the form of code patches.

## SubModule

The Gitee sub-repository only contains sub-repositories that need to be modified for Qt For OpenHarmony, and the main repository only stores code patches. In order to facilitate adaptation code version management and synchronization, the following sub-repositories are used to assist in the completion of adaptation code management.
 
 - qtbase: https://gitee.com/cwc1987/qtbase
- qtconnectivity：https://gitee.com/cwc1987/qtconnectivity
- qtdeclarative：https://gitee.com/cwc1987/qtdeclarative
- qtlocation：https://gitee.com/cwc1987/qtlocation
- qtmultimedia：https://gitee.com/cwc1987/qtmultimedia
- qtsensors：https://gitee.com/cwc1987/qtsensors
- qtsystems：https://gitee.com/cwc1987/qtsystems
- qtvirtualkeyboard：https://gitee.com/cwc1987/qtvirtualkeyboard
- qtremoteobjects：https://gitee.com/cwc1987/qtremoteobjects

## Code Patch Genearate

Use the "git diff" command to generate code patches, which are stored in sub-module names, such as qtbase.patch, qtconnectivity.patch.

> Each sub-module uses the naming method of xxxx-ohos to manage the code branch of the adaptation branch, for example, "git diff v5.12.12 5.12.12-ohos > qtbase.patch" generates the 5.12.12 adaptation code patch of the qtbase submodule, and generates After the code is patched, follow the OpenHarmony community's requirements to submit the main repository patch.

# Branch Description

- master：Store repository instructions, not patch code
- Qt5.12.12：Store the Qt For OpenHarmony code patch of Qt5.12.12 version

# Version Support Information

For the code support of the adaptation branch, see the README.md of each branch, including the supported modules, supported functions, and corresponding OpenHarmony version numbers.