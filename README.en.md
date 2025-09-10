# Contribution Instructions

Since the Qt source code includes multiple Qt sub-libraries, and in accordance with community management requirements, Qt For OpenHarmony contributes through code patches and independent adaptation modules.

## Generating Code Patches

Use the “git diff” command to generate code patches and submit them to the corresponding Patch directory.

> Each sub-library manages adaptation code patches using the naming convention “submodulename.patch”. For example, executing “git diff v5.15.12 > qtbase.patch” in the qtbase sub-repository directory generates the corresponding qtbase sub-module code patch. After generating the code patch, follow the OpenHarmony community requirements to submit it to the main repository branch.

# Directory Description

```
OpenHarmony - Qt
│
└───patch - Source code patches
|____v5.15.12
│   	│ qtbase - qtbase sub-module code patch
│   	│ qtsensors - qtsensors sub-module code patch
│   	│ qtmultimedia - qtmultimedia sub-module code patch
│   	│ qtdeclarative - qtdeclarative sub-module code patch
│   	│ qtconnectivity - qtconnectivity sub-module code patch
│   	│ qtquickcontrols - qtquickcontrols sub-module code patch
└───LICENSE - Apache License
└───LICENSE.FDL - GNU Free Documentation License
└───LICENSE.GPLv2 - GNU GENERAL PUBLIC LICENSE Version 2
└───LICENSE.GPLv3 - GNU GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv3 - GNU LESSER GENERAL PUBLIC LICENSE Version 3
└───LICENSE.LGPLv21 - GNU LESSER GENERAL PUBLIC LICENSE Version 2.1
└───LICENSE.QT-LICENSE-AGREEMENT - QT LICENSE AGREEMENT Agreement
└───OAT.xml - OAT configuration file, the automated open source review tool of the OpenHarmony community
└───README.md - Chinese version readme
└───README.en.md - English version readme
```

# Using Qt For OpenHarmony

Refer to the repository wiki: https://gitcode.com/openharmony-sig/qt/wiki/Home.md
