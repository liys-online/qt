# Contribution Note

Since the Qt source code contains multiple Qt sub-libraries, following the requirements of community management, Qt For OpenHarmony contributes in the form of code patches and independent adaptation modules.

## Code Patch Genearate

Use the "git diff" command to generate a code patch, and submit the patch to the corresponding Patch directory.

> Each sub-module uses the naming method of "submodulename.patch" to manage sub-module adaptation code patches. For example, execute "git diff v5.12.12 > qtbase.patch" in the qtbase sub-submodule directory to generate the corresponding qtbase sub-module code patch , after generating the code patch, follow the requirements of the OpenHarmony community and submit it to the main repository branch.

# Catalog Description

```
OpenHarmony - Qt
│
└───patch - Source patch folder
|____v5.12.12
│   	│ qtbase.patch - qtbase submodule patch
|		| qtsensors.patch - qtsensors submodule patch
|		| qtdeclarative.patch qtdeclarative submodule patch
|		| qtmultimedia.patch - qtmultimedia submodule patch
|		| qtconnectivity.patch - qtconnectivity submodule patch		
|		| qtremoteobjects.patch - qtremoteobjects submodule patch
|____v5.15.11
│   	│ qtbase.patch - qtbase submodule patch
|		| qtsensors.patch - qtsensors submodule patch
|		| qtdeclarative.patch qtdeclarative submodule patch
|		| qtmultimedia.patch - qtmultimedia submodule patch
|		| qtconnectivity.patch - qtconnectivity submodule patch		
|		| qtremoteobjects.patch - qtremoteobjects submodule patch
└───windows_build.bat - windows cross compile script
└───linux_build.sh - Linux cross compile script
└───LICENSE.FDL - GNU Free Documentation License
└───LICENSE.GPLv2 - GNU GENERAL PUBLIC LICENSE Version 2
└───LICENSE.GPLv3 - GNU GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv3 - GNU LESSER GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv21 - GNU LESSER GENERAL PUBLIC LICENSE Version 2.1
└───LICENSE.QT-LICENSE-AGREEMENT - QT LICENSE AGREEMENT Agreement
└───README.md - Chinese readme
└───README.en.md - English readme
```

# Using Qt For OpenHarmony

See the repository wiki for instructions:https://gitee.com/openharmony-sig/qt/wikis
