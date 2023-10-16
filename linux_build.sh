#!/bin/bash
RED='\E[1;31m'
GREEN='\E[1;32m'      
YELOW='\E[1;33m'    
BLUE='\E[1;34m'     
PINK='\E[1;35m'     
RES='\E[0m'         

export V3SDK=http://download.ci.openharmony.cn/version/Daily_Version/OpenHarmony_3.2.10.10/20230303_145524/version-Daily_Version-OpenHarmony_3.2.10.10-20230303_145524-ohos-sdk-full.tar.gz
export V4SDK=http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_4.0.10.5/20230824_120941/version-Master_Version-OpenHarmony_4.0.10.5-20230824_120941-ohos-sdk-full_monthly.tar.gz

function downloadQtSrc(){
	#  Download qt5 source code
	if [ ! -d $ROOT_DIR/qt5 ]
	then
		echo "Download qt5 source code ......"
		git clone https://gitee.com/CplusCplus/qt5.git -b v5.12.12 --recursive
	else
		echo "Update qt source code ......"
		cd $ROOT_DIR/qt5

		git clean -fdx
		git reset --hard
		git submodule foreach --recursive git clean -fdx
		git submodule update --init --recursive
		git checkout v5.12.12

		git pull origin v5.12.12
		git submodule sync	
		git submodule foreach --recursive git checkout v5.12.12
		git submodule foreach --recursive git pull origin v5.12.12
		cd $ROOT_DIR
	fi
}

function downloadOHSDK() {
	OH_SDK=$1	
	if [ -z "$OH_SDK" ];then
		return
	fi
	
	SUB_DIR=$(echo "$OH_SDK" | awk -F '/' '{print $6}')
	SDK_PACKAGE=$(echo "$OH_SDK" | awk -F '/' '{print $8}')
	echo "SDK_PACKAGE=${SDK_PACKAGE}"
	
	echo "Download OpenHarmony SDK......"
	if [ ! -f $ROOT_DIR/$SDK_PACKAGE ] 
	then 
		curl -O $OH_SDK
	else
		echo "The $SDK_PACKAGE has already download."
	fi

	if [ ! -d $ROOT_DIR/$SUB_DIR/ohos-sdk/linux ]
	then
		mkdir -p $ROOT_DIR/$SUB_DIR/
		tar -xzvf $SDK_PACKAGE -C $ROOT_DIR/$SUB_DIR/
		cd $ROOT_DIR/$SUB_DIR/ohos-sdk/linux
		unzip -o $(ls | grep native-linux)
		cd $ROOT_DIR
	else
		echo "SDK Package has alread unzip."
	fi

	if [ ! -d $ROOT_DIR/$SUB_DIR/ohos-sdk/linux/native ]
	then
		cd $ROOT_DIR/$SUB_DIR/ohos-sdk/linux
		unzip -o $(ls | grep native-linux)
		cd $ROOT_DIR
	fi

	export OHOS_SDK_PATH=$ROOT_DIR/$SUB_DIR/ohos-sdk/linux
	echo "OHOS_SDK_PATH=$OHOS_SDK_PATH"
	
	export PATH=$ROOT_DIR/$SUB_DIR/ohos-sdk/linux/native/llvm/bin:$ROOT_DIR/$SUB_DIR/ohos-sdk/linux/native/llvm/lib:$PATH
	echo "Append Compiler Path......$PATH"
}

function downloadQtSrcPatch() {
	echo "<------------------------------download qt5 for openharmony patch------------------------------>"
	PATCH_DIR=$ROOT_DIR/OpenHarmony-qtpatch
	if [ ! -d $PATCH_DIR ] 
		then
		git clone https://gitee.com/openharmony-sig/qt.git $PATCH_DIR
	else
		cd $PATCH_DIR
		git clean -fdx
		git pull --rebase
		cd $ROOT_DIR
	fi

	echo "Apply QtBase Patch......"
	cd $ROOT_DIR/qt5/qtbase
	git reset --hard
	git clean -fdx
	git apply --check $PATCH_DIR/patch/qtbase.patch
	git apply --stat $PATCH_DIR/patch/qtbase.patch
	git apply $PATCH_DIR/patch/qtbase.patch
	cd $ROOT_DIR

	echo "Apply QtConnectivity Patch......"
	cd $ROOT_DIR/qt5/qtconnectivity
	git reset --hard 
	git clean -fdx 
	git apply --check $PATCH_DIR/patch/qtconnectivity.patch 
	git apply --stat $PATCH_DIR/patch/qtconnectivity.patch 
	git apply $PATCH_DIR/patch/qtconnectivity.patch 
	cd $ROOT_DIR

	echo "Apply QtMultimedia Patch......"
	cd $ROOT_DIR/qt5/qtmultimedia
	git reset --hard  
	git clean -fdx 
	git apply --check $PATCH_DIR/patch/qtmultimedia.patch 
	git apply --stat $PATCH_DIR/patch/qtmultimedia.patch 
	git apply $PATCH_DIR/patch/qtmultimedia.patch 
	cd $ROOT_DIR

	echo "Apply QtRemoteObjects Patch......"
	cd $ROOT_DIR/qt5/qtremoteobjects
	git reset --hard 
	git clean -fdx
	git apply --check $PATCH_DIR/patch/qtremoteobjects.patch
	git apply --stat $PATCH_DIR/patch/qtremoteobjects.patch
	git apply $PATCH_DIR/patch/qtremoteobjects.patch
	cd $ROOT_DIR
	
	echo "Apply QtSensors Patch......"
	cd $ROOT_DIR/qt5/qtsensors
	git reset --hard 
	git clean -fdx
	git apply --check $PATCH_DIR/patch/qtsensors.patch
	git apply --stat $PATCH_DIR/patch/qtsensors.patch
	git apply $PATCH_DIR/patch/qtsensors.patch
	cd $ROOT_DIR
}

function buildQtSrc() {
	OH_SDK_VERSION="$(echo $(echo "$1" | awk -F '/' '{print $6}') | awk -F '_' '{print $2}')"
	BIN_DIR=$ROOT_DIR/qt_oh_sdk_${OH_SDK_VERSION}_bin/Qt5.12.12
	if [ "$OHOS_ARCH" == "arm64-v8a" ]
	then
		QT_INSTALL_DIR=$BIN_DIR/aarch64-linux-ohos
	elif [ "$OHOS_ARCH" == "x86_64" ]
	then
		QT_INSTALL_DIR=$BIN_DIR/x86_64-linux-ohos
	else
		QT_INSTALL_DIR=$BIN_DIR/arm-linux-ohos
	fi
	echo "QT_INSTALL_DIR=$QT_INSTALL_DIR"


	echo "Build Qt......"
	echo "openharmony sdk version:$OH_SDK_VERSION"
	echo "INSTALL path:$QT_INSTALL_DIR"
	
	BUILD_DIR="$ROOT_DIR/build_qt_oh_sdk_$OH_SDK_VERSION"
	if [ ! -d $BUILD_DIR ]
	then
		mkdir -p $BUILD_DIR
	fi

	chmod +x $ROOT_DIR/qt5 -R
	cd $BUILD_DIR
	$ROOT_DIR/qt5/configure -xplatform oh-clang -device-option OHOS_ARCH=$OHOS_ARCH -opensource -confirm-license -nomake tests -make examples -v \
	-prefix $QT_INSTALL_DIR -skip qtvirtualkeyboard -skip qtnetworkauth -skip webengine -skip location -skip qtwebchannel -skip qtgamepad -skip qtscript \
	-opengl es2 -opengles3 -no-dbus -recheck-all
				
	make -j16
	make install
}

usage="$(basename "$0") [-h] [-p platform] [-v all]-- build Qt For OpenHarmony

where:
	-h 		show help information	
	-v		openharmony sdk version
			v3 for openharmony
			v4 for openharmony
			all v3 and v4 for openharmony(default)
	-platform 	set target platform(default arm64-v8a)
			arm64-v8a - platform for arm64-v8a
			armeabi-v7a - platform for armeabi-v7a
			x86_64 - platform for x86_64"

export OHOS_ARCH=arm64-v8a
export OHOS_SDK_V=all
while getopts 'hp:v:' option; do
    case "$option" in
    h)
        echo "$usage"
        exit
        ;;
    p)
        export OHOS_ARCH=$OPTARG
        if [ "$OHOS_ARCH" != "armeabi-v7a" ] && [ "$OHOS_ARCH" != "arm64-v8a" ] && [ "$OHOS_ARCH" != "x86_64" ]; then
            echo "no valid platform value set."
            echo "$usage"
            exit 1
        fi
        ;;
	v)
		export OHOS_SDK_V=$OPTARG
		if [ "$OHOS_SDK_V" != "v3" ] && [ "$OHOS_SDK_V" != "v4" ] && [ "$OHOS_SDK_V" != "all" ]; then
            echo "no valid platform value set."
            echo "$usage"
            exit 1
        fi		
		;;
    :)
        printf "missing argument for -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
        ;;
    ?) 
        printf "illegal option: -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
       ;;
  esac
done

echo "OHOS_ARCH=$OHOS_ARCH"
echo "OHOS_SDK_V=$OHOS_SDK_V"

ROOT_DIR=$(cd `dirname $0`;pwd)
echo "ROOT_DIR=${ROOT_DIR}"

downloadQtSrc
downloadQtSrcPatch

if [ "$OHOS_SDK_V" == "all" ]
then
	downloadOHSDK $V3SDK
	buildQtSrc $V3SDK
	
	downloadOHSDK $V4SDK
	buildQtSrc $V4SDK
elif [ "$OHOS_SDK_V" == "v3" ]
then
	downloadOHSDK $V3SDK
	buildQtSrc $V3SDK
elif [ "$OHOS_SDK_V" == "v4" 
then
	downloadOHSDK $V4SDK
	buildQtSrc $V4SDK
fi

echo -e "${GREEN}Press any key to continue...... ${RES}"
read -n 1