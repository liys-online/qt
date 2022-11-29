#!/bin/bash

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

ROOT_DIR=$PWD
echo "ROOT_DIR=${ROOT_DIR}"

SDK_PACKAGE="version-Master_Version-OpenHarmony_3.2.8.2-20221020_161555-ohos-sdk.tar.gz"
echo "SDK_PACKAGE=${SDK_PACKAGE}"

if [ "$OHOS_ARCH" == "arm64-v8a" ]
then
    QT_INSTALL_DIR=$PWD/bin/Qt5.12.12/aarch64-linux-ohos
elif [ "$OHOS_ARCH" == "x86_64" ]
then
    QT_INSTALL_DIR=$PWD/bin/Qt5.12.12/x86_64cd .-linux-ohos
else
    QT_INSTALL_DIR=$PWD/bin/Qt5.12.12/arm-linux-ohos
fi
echo "QT_INSTALL_DIR=$QT_INSTALL_DIR"

export OHOS_SDK_PATH=$PWD/ohos-sdk/linux
echo "OHOS_SDK_PATH=$OHOS_SDK_PATH"

echo "Download qt5 source code......"
git clone https://github.com/qt/qt5.git
cd qt5
git submodule update --init --recursive
git checkout 5.12.12
cd $ROOT_DIR

echo "Download OpenHarmony SDK......"
if [ ! -f $PWD/$SDK_PACKAGE ] 
then 
    curl -O http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_3.2.8.2/20221020_161555/$NDK_PACKAGE
else
    echo "The $SDK_PACKAGE has already download."
fi
if [ ! -d $PWD/ohos-sdk/linux ]
then
    tar -xzvf $SDK_PACKAGE
    cd $PWD/ohos-sdk/linux
    unzip native-linux-3.2.8.2-Beta3.2.zip
    cd $ROOT_DIR
else
    echo "SDK Package has alread unzip."
fi

echo "Apply QtBase Patch......"
cd $ROOT_DIR/qt5/qtbase
git reset --hard origin/5.12.12
git apply --check $ROOT_DIR/patch/qtbase.patch
git apply --stat $ROOT_DIR/patch/qtbase.patch
git apply $ROOT_DIR/patch/qtbase.patch
cd $ROOT_DIR

echo "Apply QtRemoteObjects Patch......"
cd $ROOT_DIR/qt5/qtremoteobjects
git reset --hard origin/5.12.12
git apply --check $ROOT_DIR/patch/qtremoteobjects.patch
git apply --stat $ROOT_DIR/patch/qtremoteobjects.patch
git apply $ROOT_DIR/patch/qtremoteobjects.patch
cd $ROOT_DIR

echo "Build Qt......"
cd $ROOT_DIR/qt5
./configure -xplatform oh-clang -opensource -confirm-license -disable-rpath -make tests -make examples -v \
            -prefix $QT_INSTALL_DIR -skip qtdeclarative -skip qttranslations -skip qtserialport -skip webengine \
            -skip qtpurchasing -skip qtconnectivity -skip qtmultimedia -skip qtspeech -skip qtwebchannel -skip qtgamepad \
            -skip qtsensors -skip qtlocation -skip qtxmlpatterns -skip qt3d -skip qtscript -skip qtnetworkauth \
            -skip qtsystems -no-feature-bearermanagement -no-feature-http -no-gui -no-widgets \
            -no-dbus -no-opengl -recheck-all
make -j4
make install