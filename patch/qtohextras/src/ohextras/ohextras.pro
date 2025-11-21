TARGET = QtOhExtras
CONFIG += c++latest
DEFINES += QT_NO_USING_NAMESPACE
QMAKE_DOCS = \
             $$PWD/doc/qtohextras.qdocconf

include(openharmony/openharmony.pri)
QT += core core-private gui-private

load(qt_module)
