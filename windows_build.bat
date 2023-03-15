@echo off
set "e=|| exit /b 1"
set PATH=%PATH%;%cd%;ROOT_DIR%\ohos-sdk\windows\native\llvm\bin

set ARGS=%*
call :doargs %ARGS%
REM goto doneargs


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

REM :platform
    REM shift
    REM set PLATFORM=%~1
    REM goto nextarg

:doneargs
set OHOS_ARCH=%PLATFORM%
set ROOT_DIR=%cd%
REM <------------------------------download qt5 source------------------------------>
echo %ROOT_DIR% 
if not exist "%ROOT_DIR%\qt5" (
  echo "Download qt5 source code ....."
  git clone https://gitee.com/CplusCplus/qt5.git -b v5.12.12 --recursive
  cd qt5
  REM git submodule update --init --recursive
  REM git checkout v5.12.12
  cd %ROOT_DIR%
)

REM <------------------------------download unzip.exe------------------------------>
echo "Download Unzip.exe........."
if not exist "%ROOT_DIR%\unzip.exe" (
  curl -O http://stahlworks.com/dev/unzip.exe
)

REM <------------------------------download openharmony sdk------------------------------>
set SDK_PACKAGE=version-Master_Version-OpenHarmony_3.2.9.7-20230131_021509-ohos-sdk-full.tar.gz
echo "Download OpenHarmony SDK........."
if exist "%ROOT_DIR%\%SDK_PACKAGE%" (
  echo "The %SDK_PACKAGE% has already download."
) else (
  curl -O http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_3.2.9.7/20230131_021509/%SDK_PACKAGE%
)

REM <------------------------------uncompress openharmony sdk------------------------------>
if not exist "%ROOT_DIR%\ohos-sdk" (
  tar -xzvf %SDK_PACKAGE%  
  cd %ROOT_DIR%
) else (
  echo "SDK package has already unzip."
) 

if not exist "%ROOT_DIR%\ohos-sdk\windows\native" (  
  cd %ROOT_DIR%\ohos-sdk\windows
  start /wait unzip -o -d %ROOT_DIR%\ohos-sdk\windows native-windows-x64-3.2.9.7-Beta4.zip
  cd %ROOT_DIR%
) else (
  echo "SDK package has already unzip."
) 
REM <------------------------------download qt5 for openharmony patch------------------------------>
set PATCH_DIR=%ROOT_DIR%\OpenHarmony-qtpatch
if not exist "%PATCH_DIR%" (
  start /wait git clone https://gitee.com/openharmony-sig/qt.git %PATCH_DIR%
)

set OHOS_SDK_PATH=%ROOT_DIR%\ohos-sdk\windows

REM <------------------------------apply git patch to the qt5 source------------------------------>
echo "Apply QtBase Patch......"
cd %ROOT_DIR%/qt5/qtbase
start /wait git reset --hard 
start /wait git clean -fdx
start /wait git apply --check %PATCH_DIR%/patch/qtbase.patch 
start /wait git apply --stat %PATCH_DIR%/patch/qtbase.patch 
start /wait git apply %PATCH_DIR%/patch/qtbase.patch  
cd %ROOT_DIR%

echo "Apply QtConnectivity Patch......"
cd %ROOT_DIR%/qt5/qtconnectivity
start /wait git reset --hard 
start /wait git clean -fdx 
start /wait git apply --check %PATCH_DIR%/patch/qtconnectivity.patch 
start /wait git apply --stat %PATCH_DIR%/patch/qtconnectivity.patch 
start /wait git apply %PATCH_DIR%/patch/qtconnectivity.patch 
cd %ROOT_DIR%


echo "Apply QtMultimedia Patch......"
cd %ROOT_DIR%/qt5/qtmultimedia
start /wait git reset --hard  
start /wait git clean -fdx 
start /wait git apply --check %PATCH_DIR%/patch/qtmultimedia.patch 
start /wait git apply --stat %PATCH_DIR%/patch/qtmultimedia.patch 
start /wait git apply %PATCH_DIR%/patch/qtmultimedia.patch 
cd %ROOT_DIR%


echo "Apply QtRemoteObjects Patch......"
cd %ROOT_DIR%/qt5/qtremoteobjects
start /wait git reset --hard 
start /wait git clean -fdx 
start /wait git apply --check %PATCH_DIR%/patch/qtremoteobjects.patch 
start /wait git apply --stat %PATCH_DIR%/patch/qtremoteobjects.patch 
start /wait git apply %PATCH_DIR%/patch/qtremoteobjects.patch 
cd %ROOT_DIR%

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
call ../qt5/configure.bat -xplatform oh-clang -device-option OHOS_ARCH=%OHOS_ARCH% -opensource -confirm-license -disable-rpath -make tests -make examples -v ^
-prefix %QT_INSTALL_DIR% -opengl es2 -opengles3 -skip qttranslations -skip qtserialport -skip webengine ^
-skip qtpurchasing -skip qtspeech -skip qtwebchannel -skip qtgamepad ^
-skip qtsensors -skip qtlocation -skip qtxmlpatterns -skip qt3d -skip qtscript -skip qtnetworkauth ^
-skip qtsystems -no-feature-bearermanagement -no-feature-http ^
-no-dbus -recheck-all

mingw32-make -j16
mingw32-make install

cd %ROOT_DIR%