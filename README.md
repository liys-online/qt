# 贡献说明

由于Qt源码包含多个Qt子库，遵循社区管理要求，Qt For OpenHarmony采用代码补丁与独立适配模块的方式进行贡献。

## 代码补丁生成

使用"git diff"命令生成代码补丁，提交补丁到对应的Patch目录下。

> 各子库使用"submodulename.patch"的命名方式对子库适配代码补丁进行管理，例如在qtbase子仓库目录下执行"git diff v5.12.12 > qtbase.patch"可生成对应的qtbase子模块代码补丁，生成代码补丁后，遵循OpenHarmony社区要求提交到主仓库分支。

# 目录说明

```
OpenHarmony - Qt
│
└───patch - 源码补丁
|____v5.12.12
│   	│ qtbase.patch - qtbase子模块代码补丁
|		| qtsensors.patch - qtsensors子模块补丁
|		| qtdeclarative.patch qtdeclarative子模块补丁
|		| qtmultimedia.patch - qtmultimedia子模块补丁
|		| qtconnectivity.patch - qtconnectivity子模块补丁		
|		| qtremoteobjects.patch - qtremoteobjects子模块代码补丁
|____v5.15.11
│   	│ qtbase.patch - qtbase子模块代码补丁
|		| qtsensors.patch - qtsensors子模块补丁
|		| qtdeclarative.patch qtdeclarative子模块补丁
|		| qtmultimedia.patch - qtmultimedia子模块补丁
|		| qtconnectivity.patch - qtconnectivity子模块补丁		
|		| qtremoteobjects.patch - qtremoteobjects子模块代码补丁
└───windows_build.bat - windows环境下的交叉编译脚本
└───linux_build.sh - Linux环境下的交叉编译脚本
└───LICENSE.FDL - GNU Free Documentation License
└───LICENSE.GPLv2 - GNU GENERAL PUBLIC LICENSE Version 2
└───LICENSE.GPLv3 - GNU GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv3 - GNU LESSER GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv21 - GNU LESSER GENERAL PUBLIC LICENSE Version 2.1
└───LICENSE.QT-LICENSE-AGREEMENT - QT LICENSE AGREEMENT Agreement
└───README.md - 中文版本readme
└───README.en.md - 英文版本readme
```

# 编译配置说明

## Linux环境下
### 前置条件
1. 基于Ubuntu20.04 amd64版本完成交叉编译，下载链接：https://releases.ubuntu.com/focal/ubuntu-20.04.5-desktop-amd64.iso
2. 安装Git工具（sudo apt-get install git）
3. 安装Curl工具（sudo apt-get install curl）

### 编译步骤
1. 执行linux_build.sh脚本，完成qt5源码、OpenHarmony NDK及代码补丁应用和编译安装
2. 脚本执行完成后，生成安装目录为当前文件夹的bin目录

## Windows环境下
### 前置条件
1. 安装git, 如果已安装则跳过，下载链接：https://gitforwindows.org/
2. 安装Perl，如果已安装则跳过，下载链接：https://strawberryperl.com/
3. 安装mingw, 如果已安装则跳过，下载链接：https://sourceforge.net/projects/mingw/
4. 将以上安装的程序运行路径设置到系统环境Path中，例：把ming32-make.exe的所在路径设置到系统环境Path中

### 编译步骤
1. 执行windows_build.bat脚本，完成qt5源码、OpenHarmony NDK及代码补丁应用和编译安装
2. 脚本执行完成后，生成安装目录为当前文件夹的bin目录

# Qt For OpenHarmony使用

参见仓库wiki说明：https://gitee.com/openharmony-sig/qt/wikis
