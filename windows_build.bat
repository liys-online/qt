@echo off
set ARGS=%*
call :doargs %ARGS%
goto doneargs

:doargs
    if "%~1" == "" goto doneargs
    if "%~1" == "-?" goto help
    if /i "%~1" == "/h" goto help
    if /i "%~1" == "-h" goto help
    if /i "%~1" == "/help" goto help
    if /i "%~1" == "-help" goto help
    if /i "%~1" == "--help" goto help

    if /i "%~1" == "-platform" goto platform
    if /i "%~1" == "--platform" goto platform

:nextarg
    shift
    goto doargs

:help
    echo -h show help information
    echo -platform set target platform(default armeabi-v7a)
    echo    arm64-v8a - platform for arm64-v8a
    echo    armeabi-v7a - platform for armeabi-v7a
    echo    x86_64 - platform for x86_64
    exit /b 1

:platform
    shift
    set PLATFORM=%~1
    goto nextarg

:doneargs
set OHOS_ARCH=%PLATFORM%
set ROOT_DIR=%cd%
echo %ROOT_DIR% 
if not exist %ROOT_DIR%\qt5 (
  echo "Download qt5 source code ....."
  git clone https://github.com/qt/qt5.git
  cd qt5
  git submodule update --init --recursive
  git checkout 5.12.12
  cd %ROOT_DIR%
)
set SDK_PACKAGE=version-Master_Version-OpenHarmony_3.2.8.2-20221020_161555-ohos-sdk.tar.gz
echo "Download OpenHarmony SDK........."
if exist %ROOT_DIR%\%SDK_PACKAGE% (
  echo "The %SDK_PACKAGE% has already download."
) else (
  curl -O http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_3.2.8.2/20221020_161555/%SDK_PACKAGE%
)

if not exist %ROOT_DIR%\ohos-sdk (
  tar -xzvf %SDK_PACKAGE%
  cd %ROOT_DIR%\ohos-sdk\windows
  unzip -o -d %ROOT_DIR%\ohos-sdk\windows native-windows-3.2.8.2-Beta3.2.zip
  cd %ROOT_DIR%
) else (
  echo "SDK package has already unzip."
) 

set PATCH_DIR=%ROOT_DIR%\OpenHarmony-qtpatch
if not exist %PATCH_DIR% (
  git clone https://gitee.com/openharmony-sig/qt.git %PATCH_DIR%
)

set OHOS_SDK_PATH=%ROOT_DIR%\ohos-sdk\windows
echo "Apply QtBase Patch......"
cd $ROOT_DIR/qt5/qtbase
git reset --hard origin/5.12.12
git apply --check %PATCH_DIR%/patch/qtbase.patch
git apply --stat %PATCH_DIR%/patch/qtbase.patch
git apply %PATCH_DIR%/patch/qtbase.patch
cd $ROOT_DIR

echo "Apply QtRemoteObjects Patch......"
cd $ROOT_DIR/qt5/qtremoteobjects
git reset --hard origin/5.12.12
git apply --check %PATCH_DIR%/patch/qtremoteobjects.patch
git apply --stat %PATCH_DIR%/patch/qtremoteobjects.patch
git apply %PATCH_DIR%/patch/qtremoteobjects.patch
cd $ROOT_DIR

if "%OHOS_ARCH%" == "arm64-v8a" ( 
  set OHOS_TARGET=aarch64-linux-ohos
) else if "%OHOS_ARCH%" == "x86_64" (
  set OHOS_TARGET=x86_64-linux-ohos
) else (
  set OHOS_ARCH=armeabi-v7a
  set OHOS_TARGET=arm-linux-ohos
)
echo "Build Qt for OpenHarmony with %OHOS_ARCH%"
set QT_INSTALL_DIR=%ROOT_DIR%\bin\Qt5.12.12\%OHOS_TARGET%
echo %QT_INSTALL_DIR%

set BUILD_DIR=%ROOT_DIR%\%OHOS_TARGET%
if not exist %BUILD_DIR% (
   mkdir %BUILD_DIR%
)
cd %BUILD_DIR%
call ../qt5/configure -xplatform oh-clang -opensource -confirm-license -disable-rpath -make tests -make examples -v \
            -prefix %QT_INSTALL_DIR% -opengl es2 -opengles3 -skip qttranslations -skip qtserialport -skip webengine \
            -skip qtpurchasing -skip qtconnectivity -skip qtmultimedia -skip qtspeech -skip qtwebchannel -skip qtgamepad \
            -skip qtsensors -skip qtlocation -skip qtxmlpatterns -skip qt3d -skip qtscript -skip qtnetworkauth \
            -skip qtsystems -no-feature-bearermanagement -no-feature-http \
            -no-dbus -recheck-all
mingw32-make -j4
mingw32-make install
cd %ROOT_DIR%