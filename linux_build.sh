#!/bin/bash
RED='\E[1;31m'
GREEN='\E[1;32m'      
YELOW='\E[1;33m'    
BLUE='\E[1;34m'     
PINK='\E[1;35m'     
RES='\E[0m'         

usage="$(basename "$0") [-h] [-p platform] -- build Qt For OpenHarmony

where:
    -h show help information
    -platform set target platform(default armeabi-v7a)
        arm64-v8a - platform for arm64-v8a
        armeabi-v7a - platform for armeabi-v7a
        x86_64 - platform for x86_64"

export OHOS_ARCH=armeabi-v7a
while getopts 'hp:' option; do
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
    :)
        printf "missing argument for -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
        ;;
   \?) 
        printf "illegal option: -%s\n" "$OPTARG" >&2
        echo "$usage" >&2
        exit 1
       ;;
  esac
done

echo "OHOS_ARCH=$OHOS_ARCH"

ROOT_DIR=$(cd `dirname $0`;pwd)
echo "ROOT_DIR=${ROOT_DIR}"

SDK_PACKAGE="version-Master_Version-OpenHarmony_3.2.9.2-20221205_200146-ohos-sdk-full.tar.gz"
echo "SDK_PACKAGE=${SDK_PACKAGE}"

if [ "$OHOS_ARCH" == "arm64-v8a" ]
then
    QT_INSTALL_DIR=$ROOT_DIR/bin/Qt5.12.12/aarch64-linux-ohos
elif [ "$OHOS_ARCH" == "x86_64" ]
then
    QT_INSTALL_DIR=$ROOT_DIR/bin/Qt5.12.12/x86_64-linux-ohos
else
    QT_INSTALL_DIR=$ROOT_DIR/bin/Qt5.12.12/arm-linux-ohos
fi
echo "QT_INSTALL_DIR=$QT_INSTALL_DIR"

export OHOS_SDK_PATH=$ROOT_DIR/ohos-sdk/linux
echo "OHOS_SDK_PATH=$OHOS_SDK_PATH"

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

echo "Download OpenHarmony SDK......"
if [ ! -f $ROOT_DIR/$SDK_PACKAGE ] 
then 
    curl -O http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_3.2.9.2/20221205_200146/$SDK_PACKAGE
else
    echo "The $SDK_PACKAGE has already download."
fi

if [ ! -d $ROOT_DIR/ohos-sdk/linux ]
then
    tar -xzvf $SDK_PACKAGE
    cd $ROOT_DIR/ohos-sdk/linux
    unzip native-linux-3.2.9.2-Beta4.zip
    cd $ROOT_DIR
else
    echo "SDK Package has alread unzip."
fi

if [ ! -d $ROOT_DIR/ohos-sdk/linux/native ]
then
	cd $ROOT_DIR/ohos-sdk/linux
	unzip native-linux-3.2.9.2-Beta4.zip
	cd $ROOT_DIR
fi

export PATH=$ROOT_DIR/ohos-sdk/linux/native/llvm/bin:$PATH
echo "Append Compiler Path......$PATH"

echo "<------------------------------download qt5 for openharmony patch------------------------------>"
export PATCH_DIR=$ROOT_DIR/OpenHarmony-qtpatch
if [ ! -d $PATCH_DIR ] 
then
   git clone https://gitee.com/openharmony-sig/qt.git $PATCH_DIR
else
	cd $PATCH_DIR
	git clean -fdx
	git pull --rebase
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

echo "Build Qt......"
cd $ROOT_DIR/qt5
chmod +x ./ -R
./configure -xplatform oh-clang -device-option OHOS_ARCH=$OHOS_ARCH -opensource -confirm-license -disable-rpath -make tests -make examples -v \
            -prefix $QT_INSTALL_DIR -opengl es2 -opengles3 -skip qtserialport -skip webengine \
            -skip qtpurchasing -skip qtwebchannel -skip qtgamepad \
            -skip qtsensors -skip qtlocation -skip qtxmlpatterns -skip qt3d -skip qtscript -skip qtnetworkauth \
            -skip qtsystems -no-feature-bearermanagement -no-feature-http \
            -no-dbus -recheck-all
			
make -j16
make install

echo -e "${GREEN}Press any key to continue...... ${RES}"
read -n 1