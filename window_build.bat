chcp 65001
@echo off
set "e=|| exit /b 1"
setlocal enabledelayedexpansion

set QT_DIR=""
set ROOT_DIR=""
set TARGET_SDK=""
set MINGW_PATH=C:\Tools\mingw730_64\bin
set PATH=%ROOT_DIR%;%MINGW_PATH%;C:\Strawberry\perl\bin;C:\Program Files\Python27;C:\Program Files\7-Zip;%PATH%

if "!QT_DIR!" == "" (
	echo "need to configure QT_DIR"
	exit /b
)

if "!ROOT_DIR!" == "" (
	echo "need to configure QT_DIR"
	exit /b
)

if "!TARGET_SDK!" == "" (
	echo "need to configure QT_DIR"
	exit /b
)

echo "QT_DIR:%QT_DIR%"
echo "ROOT_DIR:%ROOT_DIR%"
echo "TARGET_SDK:%TARGET_SDK%"
echo "MINGW_PATH:%MINGW_PATH%"

if not exist "%ROOT_DIR%" (
	mkdir %ROOT_DIR% 
)

call :acquireUnzip

if not "%TARGET_SDK%" == "" (
	call :acquireOHSDK %TARGET_SDK% 
	call :buildQt
	REM call :sendPkgToRemote
	call :cleanTmpFiles
) else (
	echo "need to configure sdk"
	exit /b
)

pause&exit /b

:acquireUnzip
REM <------------------------------download unzip.exe------------------------------>
echo "Download Unzip.exe........."
if not exist "%ROOT_DIR%\unzip.exe" (
  curl -o %ROOT_DIR%\unzip.exe -O http://stahlworks.com/dev/unzip.exe
)
goto :eof

:acquireOHSDK
REM <------------------------------download openharmony sdk------------------------------>
set SDK_PACKAGE=%~nx1
echo "Download OpenHarmony SDK........."
if exist "%ROOT_DIR%\%SDK_PACKAGE%" (
	echo "The %SDK_PACKAGE% has already download."
) else (	
	curl -o %ROOT_DIR%\%SDK_PACKAGE% -O %~1
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

:buildQt
echo "<---------------buildQt------------------>"
echo "Build Qt for OpenHarmony with %OHOS_ARCH%"
if "%EDITION%" == "" (
	set BUILD_DIR=%ROOT_DIR%\build_Qt%QT_VERSION%_%PKG_TAG%_%OHOS_SDK_VERSION%_%OHOS_ARCH%
	set QT_INSTALL_DIR=%ROOT_DIR%\Qt%QT_VERSION%_%PKG_TAG%_%OHOS_SDK_VERSION%_%OHOS_ARCH%_bin
) else (
	set BUILD_DIR=%ROOT_DIR%\build_Qt%QT_VERSION%_%PKG_TAG%_%OHOS_SDK_VERSION%_%OHOS_ARCH%_%EDITION%
	set QT_INSTALL_DIR=%ROOT_DIR%\Qt%QT_VERSION%_%PKG_TAG%_%OHOS_SDK_VERSION%_%OHOS_ARCH%_%EDITION%_bin
)

echo "QT_INSTALL_DIR:%QT_INSTALL_DIR%"

if not exist "%BUILD_DIR%" (
   mkdir %BUILD_DIR%   
)

echo "BUILD_DIR:%BUILD_DIR%"
echo "API_VERSION:%API_VERSION%"

cd %BUILD_DIR%
call %QT_DIR%\configure.bat -platform win32-g++ -xplatform oh-clang -device-option OHOS_ARCH=%OHOS_ARCH% -opensource -confirm-license ^
-nomake tests -nomake examples -v -prefix %QT_INSTALL_DIR% %PARAMS% -opengl es2 -opengles3 -no-dbus -recheck-all

mingw32-make -j16
mingw32-make install

REM copy qmake dependencise
copy "%MINGW_PATH%\libstdc++-6.dll" "%QT_INSTALL_DIR%\bin\"
copy "%MINGW_PATH%\libgcc_s_seh-1.dll" "%QT_INSTALL_DIR%\bin\"
copy "%MINGW_PATH%\libwinpthread-1.dll" "%QT_INSTALL_DIR%\bin\"

cd %ROOT_DIR%
goto :eof

:sendPkgToRemote
set ZIP_DIR=%ROOT_DIR%\Qt%QT_VERSION%_%OHOS_ARCH%_%PKG_TAG%_%OHOS_SDK_VERSION%
echo "ZIP_DIR:%ZIP_DIR%"

if not exist "%ZIP_DIR%" (
	mkdir %ZIP_DIR%
)

if "%EDITION%" == "" (
        set ZIP_FILE=Qt%QT_VERSION%_%PKG_VERSION%%OHOS_ARCH%_%PKG_TAG%_%OHOS_SDK_VERSION%_win.zip
) else (
        set ZIP_FILE=Qt%QT_VERSION%_%PKG_VERSION%%OHOS_ARCH%_%PKG_TAG%_%OHOS_SDK_VERSION%_%EDITION%_win.zip
)
set ZIP_NAME=%ZIP_DIR%\%ZIP_FILE%
echo "ZIP_NAME:%ZIP_NAME%"

7z a -tzip "%ZIP_NAME%" "%QT_INSTALL_DIR%\*"

if "%PKG_TAG%" =="harmonyos_ndk" (
	set REMOTE_DIR=Linux_HarmonyOS
) else if "%PKG_TAG%" =="openharmony_ndk" (
	set REMOTE_DIR=Linux_OpenHarmony
) else (
	echo "exit support remotedir:%REMOTE_DIR%"
	exit /b
)

REM send file to filebrowser
WinSCP.com /command "open sftp://root:%SERVER_PASSWORD%@10.137.95.10 -hostkey=*" "put %ZIP_NAME% /data/filebrowser/Qt/%REMOTE_DIR%/" "exit"

goto :eof

:cleanTmpFiles
del /F /S /Q %ZIP_NAME%
rd /S /Q %BUILD_DIR%
rd /S /Q %QT_INSTALL_DIR%
goto :eof
