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
│   │   qtbase.patch - qtbase submodule patch
|	|   qtremoteobjects.patch - qtremoteobjects submodule patch
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

# Compile Configuration Instructions

## Linux
### Precondition
1. Complete cross-compilation based on Ubuntu20.04 amd64 version, download link: https://releases.ubuntu.com/focal/ubuntu-20.04.5-desktop-amd64.iso
2. Install Git tools (sudo apt-get install git)
3. Install Curl tools (sudo apt-get install curl)

### Compilation Steps
1. Execute the linux_build.sh script to complete the qt5 source code, OpenHarmony NDK and code patch application, compilation and installation
2. After the script is executed, the installation directory is generated as the bin directory of the current folder

## Windows
### Precondition
1.  Install git, if installed skip, download link: https://gitforwindows.org/
2. Install Perl, if installed skip, download link: https://strawberryperl.com/
3. Install mingw, if installed skip, download link: https://sourceforge.net/projects/mingw/
3. Set the running Path of the above installed program to the Path of the system environment. For example, set the path of ming32-make.exe to the path of the system environment

### Compilation Steps
1. Execute the windows_build.bat script to complete the qt5 source code, OpenHarmony NDK and code patch application, compilation and installation
2. After the script is executed, the installation directory is generated as the bin directory of the current folder
