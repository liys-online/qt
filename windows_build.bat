@echo off
set "e=|| exit /b 1"
set PATH=%PATH%;%cd%;%ROOT_DIR%\ohos-sdk\windows\native\llvm\bin

set ARGS=%*
goto :doargs %ARGS%
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

:platform
    shift
    set PLATFORM=%~1
    goto nextarg

:doneargs
set OHOS_ARCH=%PLATFORM%
set ROOT_DIR=%cd%
REM <------------------------------download qt5 source------------------------------>
echo %ROOT_DIR% 
if not exist "%ROOT_DIR%\qt5" (
  echo "Download qt5 source code ....."
  git clone https://gitee.com/CplusCplus/qt5.git -b v5.12.12 --recursive
  REM cd qt5
  REM git submodule update --init --recursive
  REM git checkout origin v5.12.12
  REM cd %ROOT_DIR%
) else (
	echo "Update qt source code ......"
	cd qt5

	git clean -fdx
	git reset --hard
	git submodule foreach --recursive git clean -fdx
	git submodule update --init --recursive
	git checkout v5.12.12

	git pull origin v5.12.12
	git submodule sync	
	git submodule foreach --recursive git checkout v5.12.12
	git submodule foreach --recursive git pull origin v5.12.12
	cd %ROOT_DIR%
)

REM <------------------------------download unzip.exe------------------------------>
echo "Download Unzip.exe........."
if not exist "%ROOT_DIR%\unzip.exe" (
  curl -O http://stahlworks.com/dev/unzip.exe
)

REM <------------------------------download openharmony sdk------------------------------>
set SDK_PACKAGE=version-Master_Version-OpenHarmony_3.2.9.2-20221205_200146-ohos-sdk-full.tar.gz
echo "Download OpenHarmony SDK........."
if exist "%ROOT_DIR%\%SDK_PACKAGE%" (
  echo "The %SDK_PACKAGE% has already download."
) else (
  curl -O http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_3.2.9.2/20221205_200146/%SDK_PACKAGE%
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
   unzip -o -d %ROOT_DIR%\ohos-sdk\windows native-windows-3.2.9.2-Beta4.zip
  cd %ROOT_DIR%
) else (
  echo "SDK package has already unzip."
) 
REM <------------------------------download qt5 for openharmony patch------------------------------>
set PATCH_DIR=%ROOT_DIR%\OpenHarmony-qtpatch
if not exist "%PATCH_DIR%" (
   git clone https://gitee.com/openharmony-sig/qt.git %PATCH_DIR%
) else (

	cd %PATCH_DIR%
	git clean -fdx
	git pull --rebase
	cd %ROOT_DIR%
)

set OHOS_SDK_PATH=%ROOT_DIR%\ohos-sdk\windows

REM <------------------------------apply git patch to the qt5 source------------------------------>
echo "Apply QtBase Patch......"
cd %ROOT_DIR%/qt5/qtbase
 git reset --hard 
 git clean -fdx
 git apply --check %PATCH_DIR%/patch/qtbase.patch 
 git apply --stat %PATCH_DIR%/patch/qtbase.patch 
 git apply %PATCH_DIR%/patch/qtbase.patch  
cd %ROOT_DIR%

echo "Apply QtConnectivity Patch......"
cd %ROOT_DIR%/qt5/qtconnectivity
 git reset --hard 
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/qtconnectivity.patch 
 git apply --stat %PATCH_DIR%/patch/qtconnectivity.patch 
 git apply %PATCH_DIR%/patch/qtconnectivity.patch 
cd %ROOT_DIR%


echo "Apply QtMultimedia Patch......"
cd %ROOT_DIR%/qt5/qtmultimedia
 git reset --hard  
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/qtmultimedia.patch 
 git apply --stat %PATCH_DIR%/patch/qtmultimedia.patch 
 git apply %PATCH_DIR%/patch/qtmultimedia.patch 
cd %ROOT_DIR%


echo "Apply QtRemoteObjects Patch......"
cd %ROOT_DIR%/qt5/qtremoteobjects
 git reset --hard 
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/qtremoteobjects.patch 
 git apply --stat %PATCH_DIR%/patch/qtremoteobjects.patch 
 git apply %PATCH_DIR%/patch/qtremoteobjects.patch 
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
-prefix %QT_INSTALL_DIR% -opengl es2 -opengles3 -skip qtserialport -skip webengine ^
-skip qtpurchasing -skip qtwebchannel -skip qtgamepad ^
-skip qtsensors -skip qtlocation -skip qtxmlpatterns -skip qt3d -skip qtscript -skip qtnetworkauth ^
-skip qtsystems -no-feature-bearermanagement -no-feature-http ^
-no-dbus -recheck-all

mingw32-make -j16
mingw32-make install

cd %ROOT_DIR%

pause