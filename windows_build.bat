@echo off
set "e=|| exit /b 1"
set ROOT_DIR=%cd%
set PATH=%PATH%;%cd%;
set API9_SDK=http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_3.2.10.9/20230225_073754/version-Master_Version-OpenHarmony_3.2.10.9-20230225_073754-ohos-sdk-full.tar.gz
set API10_SDK=http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_4.0.10.5/20230824_120941/version-Master_Version-OpenHarmony_4.0.10.5-20230824_120941-ohos-sdk-full_monthly.tar.gz

set ARGS=%*
set QT_VERSION=v5.12.12
set OHOS_ARCH=arm64-v8a
set TARGET_API=%API10_SDK%
goto :doargs %ARGS%
REM goto doneargs

:doneargs

call :acquireUnzip
call :acquireQtSrc
call :acquirePatch
echo %TARGET_API%

if not "%TARGET_API%" == "" (
	call :acquireOHSDK %TARGET_API% 
	call :buildQt
) else (
	echo "need to configure sdk"
	exit /b
)

pause&exit /b

:doargs
    if "%~1" == "" goto doneargs
    if "%~1" == "-?" goto help
    if /i "%~1" == "/h" goto help
    if /i "%~1" == "-h" goto help
    if /i "%~1" == "/help" goto help
    if /i "%~1" == "-help" goto help
    if /i "%~1" == "--help" goto help
	if /i "%~1" == "-qt" goto qtset
	if /i "%~1" == "-api" goto apiset
	
    if /i "%~1" == "-platform" goto platform
    if /i "%~1" == "--platform" goto platform

:nextarg
    shift
    goto doargs

:help
    echo 	-h show help information
	echo    -qt specifying the qt version,support v5.15.11 and v5.12.12(default)
	echo 	-api build qt with openharmony api, support 9 and 10(default 10)
    echo 	-platform set target platform(default arm64-v8a)
    echo    	arm64-v8a - platform for arm64-v8a
    echo    	armeabi-v7a - platform for armeabi-v7a
    echo    	x86_64 - platform for x86_64
    exit /b 1

:platform
    shift
    set PLATFORM=%~1
    goto nextarg
:qtset
	shift
	set QT_VERSION=%~1
	goto nextarg
	
:apiset
	shift
	set API_VERSION=%~1
	call set TARGET_API=%%API%API_VERSION%_SDK%%  
	goto nextarg

:acquireQtSrc
REM <------------------------------download qt5 source------------------------------>
set QT_SRC_DIR=%ROOT_DIR%\%QT_VERSION%_SRC
echo %QT_SRC_DIR% 
if not exist "%QT_SRC_DIR%" (
  echo "Download %QT_VERSION%  source code ....."
  git clone https://gitee.com/CplusCplus/qt5.git -b %QT_VERSION% --recursive %QT_SRC_DIR%
  REM cd %QT_SRC_DIR%
  REM git submodule update --init --recursive
  REM git checkout origin %QT_VERSION%
  REM cd %ROOT_DIR%
) else (
	echo "Update qt source code ......"
	cd %QT_SRC_DIR%

	git clean -fdx
	git reset --hard
	git submodule foreach --recursive git clean -fdx
	git submodule update --init --recursive
	git checkout %QT_VERSION%

	git pull origin %QT_VERSION%
	git submodule sync	
	git submodule foreach --recursive git checkout %QT_VERSION%
	git submodule foreach --recursive git pull origin %QT_VERSION%
	cd %ROOT_DIR%
)
goto :eof

:acquireUnzip
REM <------------------------------download unzip.exe------------------------------>
echo "Download Unzip.exe........."
if not exist "%ROOT_DIR%\unzip.exe" (
  curl -O http://stahlworks.com/dev/unzip.exe
)
goto :eof

:acquireOHSDK
REM <------------------------------download openharmony sdk------------------------------>
set SDK_PACKAGE=%~nx1
echo "Download OpenHarmony SDK........."
if exist "%ROOT_DIR%\%SDK_PACKAGE%" (
  echo "The %SDK_PACKAGE% has already download."
) else (
  curl -O %~1
)

set UN_ZIP_DIR="";
for /f "tokens=3 delims=-" %%a in ("%SDK_PACKAGE%") do (
    set UN_ZIP_DIR=%%a
)

if "%UN_ZIP_DIR%" == "" (
	echo "sdk unzip dir is empty";
	exit /b
)
echo "unzip ohos sdk dir：%UN_ZIP_DIR%"

REM Qt编译时使用了OHOS_SDK_VERSION
set OHOS_SDK_VERSION=""
for /f "tokens=2 delims=_" %%i in ("%UN_ZIP_DIR%") do (
	set OHOS_SDK_VERSION=%%i
)

REM <------------------------------uncompress openharmony sdk------------------------------>
if not exist "%ROOT_DIR%\%UN_ZIP_DIR%" (
	mkdir %ROOT_DIR%\%UN_ZIP_DIR%
	tar -xzvf %SDK_PACKAGE% -C %ROOT_DIR%\%UN_ZIP_DIR%
	cd %ROOT_DIR%
) else (
	echo "SDK package has already unzip."	
) 

if not exist "%ROOT_DIR%\%UN_ZIP_DIR%\ohos-sdk" (
	mkdir %ROOT_DIR%\%UN_ZIP_DIR%
	tar -xzvf %SDK_PACKAGE% -C %ROOT_DIR%\%UN_ZIP_DIR%
	cd %ROOT_DIR%
) else (
	echo "SDK package has already unzip."	
)

for /f "delims="  %%a in ('dir %ROOT_DIR%\%UN_ZIP_DIR%\ohos-sdk\windows^|findstr native-windows') do (				
	for /f "tokens=4" %%i in ("%%a") do (		
		set nativefile=%%i
	)	
)
echo "native file:%nativefile%"

if not exist "%ROOT_DIR%\%UN_ZIP_DIR%\ohos-sdk\windows\native" (  
	cd %ROOT_DIR%\%UN_ZIP_DIR%\ohos-sdk\windows
	unzip -o -d %ROOT_DIR%\%UN_ZIP_DIR%\ohos-sdk\windows %nativefile%
  cd %ROOT_DIR%
) else (
	echo "SDK package has already unzip."
) 

set OHOS_SDK_PATH=%ROOT_DIR%\%UN_ZIP_DIR%\ohos-sdk\windows
set LLVM_INSTALL_DIR=%OHOS_SDK_PATH%\native\llvm
set PATH=%PATH%;%OHOS_SDK_PATH%\native\llvm\bin;%OHOS_SDK_PATH%\native\llvm\lib;%OHOS_SDK_PATH%\native\llvm\include;
echo "OHOS_SDK_PATH:%OHOS_SDK_PATH%"
goto :eof

:acquirePatch
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

REM <------------------------------apply git patch to the qt5 source------------------------------>
echo "Apply QtBase Patch......"
cd %ROOT_DIR%/qt5/qtbase
 git reset --hard 
 git clean -fdx
 git apply --check %PATCH_DIR%/patch/%QT_VERSION%/qtbase.patch 
 git apply --stat %PATCH_DIR%/patch/%QT_VERSION%/qtbase.patch 
 git apply %PATCH_DIR%/patch/%QT_VERSION%/qtbase.patch  
cd %ROOT_DIR%

echo "Apply QtConnectivity Patch......"
cd %ROOT_DIR%/qt5/qtconnectivity
 git reset --hard 
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/%QT_VERSION%/qtconnectivity.patch 
 git apply --stat %PATCH_DIR%/patch/%QT_VERSION%/qtconnectivity.patch 
 git apply %PATCH_DIR%/patch/%QT_VERSION%/qtconnectivity.patch 
cd %ROOT_DIR%

echo "Apply QtDeclarative Patch......"
cd %ROOT_DIR%/qt5/qtdeclarative
 git reset --hard 
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/%QT_VERSION%/qtdeclarative.patch 
 git apply --stat %PATCH_DIR%/patch/%QT_VERSION%/qtdeclarative.patch 
 git apply %PATCH_DIR%/patch/%QT_VERSION%/qtdeclarative.patch 
cd %ROOT_DIR%

echo "Apply QtMultimedia Patch......"
cd %ROOT_DIR%/qt5/qtmultimedia
 git reset --hard  
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/%QT_VERSION%/qtmultimedia.patch 
 git apply --stat %PATCH_DIR%/patch/%QT_VERSION%/qtmultimedia.patch 
 git apply %PATCH_DIR%/patch/%QT_VERSION%/qtmultimedia.patch 
cd %ROOT_DIR%


echo "Apply QtRemoteObjects Patch......"
cd %ROOT_DIR%/qt5/qtremoteobjects
 git reset --hard 
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/%QT_VERSION%/qtremoteobjects.patch 
 git apply --stat %PATCH_DIR%/patch/%QT_VERSION%/qtremoteobjects.patch 
 git apply %PATCH_DIR%/patch/%QT_VERSION%/qtremoteobjects.patch 
cd %ROOT_DIR%

echo "Apply QtSensors Patch......"
cd %ROOT_DIR%/qt5/qtsensors
 git reset --hard 
 git clean -fdx 
 git apply --check %PATCH_DIR%/patch/%QT_VERSION%/qtsensors.patch
 git apply --stat %PATCH_DIR%/patch/%QT_VERSION%/qtsensors.patch 
 git apply %PATCH_DIR%/patch/%QT_VERSION%/qtsensors.patch
cd %ROOT_DIR%

goto :eof

:buildQt
echo "<---------------buildQt------------------>"
if "%OHOS_ARCH%" == "arm64-v8a" ( 
  set OHOS_TARGET=aarch64-windows-ohos
) else if "%OHOS_ARCH%" == "x86_64" (
  set OHOS_TARGET=x86_64-windows-ohos
) else (
  set OHOS_ARCH=armeabi-v7a
  set OHOS_TARGET=arm-windows-ohos
)

echo "Build Qt for OpenHarmony with %OHOS_ARCH%"
set QT_INSTALL_DIR=%ROOT_DIR%\qt_%QT_VERSION%_oh_sdk_%OHOS_SDK_VERSION%_bin\%QT_VERSION%\%OHOS_TARGET%
echo %QT_INSTALL_DIR%

set BUILD_DIR=%ROOT_DIR%\build_qt_%QT_VERSION%_oh_sdk_%OHOS_SDK_VERSION%\%OHOS_TARGET%
if not exist "%BUILD_DIR%" (
   mkdir %BUILD_DIR%   
)
echo "BUILD_DIR:%BUILD_DIR%"
cd %BUILD_DIR%
REM api 9 does not support the bluetooth module
if "%TARGET_API%" == "%API10_SDK%" (
	call %ROOT_DIR%\%QT_SRC_DIR%\configure.bat -platform win32-g++ -xplatform oh-clang -device-option OHOS_ARCH=%OHOS_ARCH% -opensource -confirm-license -nomake tests -make examples -v ^
	-prefix %QT_INSTALL_DIR% -skip doc -skip qtvirtualkeyboard -skip qtnetworkauth -skip qtwebengine -skip qtlocation -skip qtwebchannel -skip qtgamepad -skip qtscript -opengl es2 ^
	-opengles3 -no-dbus -recheck-all
) else (
	call %ROOT_DIR%\%QT_SRC_DIR%\configure.bat -platform win32-g++ -xplatform oh-clang -device-option OHOS_ARCH=%OHOS_ARCH% -opensource -confirm-license -nomake tests -make examples -v ^
	-prefix %QT_INSTALL_DIR% -skip doc -skip qtconnectivity -skip qtvirtualkeyboard -skip qtnetworkauth -skip qtwebengine -skip qtlocation -skip qtwebchannel -skip qtgamepad -skip qtscript -opengl es2 ^
	-opengles3 -no-dbus -recheck-all
)


mingw32-make -j16
mingw32-make install

cd %ROOT_DIR%
goto :eof