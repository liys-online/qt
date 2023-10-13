@echo off
set "e=|| exit /b 1"
set ROOT_DIR=%cd%
set PATH=%PATH%;%cd%
set V3SDK=http://download.ci.openharmony.cn/version/Daily_Version/OpenHarmony_3.2.10.10/20230303_145524/version-Daily_Version-OpenHarmony_3.2.10.10-20230303_145524-ohos-sdk-full.tar.gz
set V4SDK=http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_4.0.10.5/20230824_120941/version-Master_Version-OpenHarmony_4.0.10.5-20230824_120941-ohos-sdk-full_monthly.tar.gz

set ARGS=%*
set OHOS_ARCH=arm64-v8a

goto :doargs %ARGS%
REM goto doneargs

:doneargs

call :acquireUnzip
call :acquireQtSrc
call :acquirePatch

if not "%V3SDK%" == "" (
	if not "%V4SDK%" == "" (		
		call :acquireOHSDK %V3SDK% 		
		call :buildQt
		
		call :acquireOHSDK %V4SDK%
		call :buildQt
	) else (
		call :acquireOHSDK %V3SDK% 
		call :buildQt
	)
) else (
	if not "%V4SDK%" == "" (					
		call :acquireOHSDK %V4SDK%
		call :buildQt
	) else (
		echo "need to configure sdk"
		exit /b
	)
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
	if /i "%~1" == "-v3" set V4SDK=""
	if /i "%~1" == "-v4" set V3SDK=""
	
    if /i "%~1" == "-platform" goto platform
    if /i "%~1" == "--platform" goto platform

:nextarg
    shift
    goto doargs

:help
    echo 	-h show help information
	echo 	-v3 build v3 openharmony-qt only
	echo 	-v4 build v3 openharmony-qt only
	echo 	-a build v3 and v4 for openharmony-qt(default)
    echo 	-platform set target platform(default arm64-v8a)
    echo    arm64-v8a - platform for arm64-v8a
    echo    armeabi-v7a - platform for armeabi-v7a
    echo    x86_64 - platform for x86_64
    exit /b 1

:platform
    shift
    set PLATFORM=%~1
    goto nextarg

:acquireQtSrc
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
set PATH=%PATH%;%OHOS_SDK_PATH%\native\llvm\bin;%OHOS_SDK_PATH%\native\llvm\lib;
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

goto :eof

:buildQt
echo "<---------------buildQt------------------>"
if "%OHOS_ARCH%" == "arm64-v8a" ( 
  set OHOS_TARGET=aarch64-linux-ohos
) else if "%OHOS_ARCH%" == "x86_64" (
  set OHOS_TARGET=x86_64-linux-ohos
) else (
  set OHOS_ARCH=armeabi-v7a
  set OHOS_TARGET=arm-linux-ohos
)

echo "Build Qt for OpenHarmony with %OHOS_ARCH%"
set QT_INSTALL_DIR=%ROOT_DIR%\qt_oh_sdk_%OHOS_SDK_VERSION%_bin\Qt5.12.12\%OHOS_TARGET%
echo %QT_INSTALL_DIR%

set BUILD_DIR=%ROOT_DIR%\build_qt_oh_sdk_%OHOS_SDK_VERSION%\%OHOS_TARGET%
if not exist "%BUILD_DIR%" (
   mkdir %BUILD_DIR%   
)

cd %BUILD_DIR%
call %ROOT_DIR%\qt5\configure.bat -platform win32-g++ -xplatform oh-clang -device-option OHOS_ARCH=%OHOS_ARCH% -opensource -confirm-license -nomake tests -make examples -v ^
-prefix %QT_INSTALL_DIR% -skip qtvirtualkeyboard -skip qtnetworkauth -skip webengine -skip location -skip qtwebchannel -skip qtgamepad -skip qtscript -opengl es2 -opengles3 -no-dbus -recheck-all

mingw32-make -j16
REM mingw32-make install

cd %ROOT_DIR%
goto :eof