openharmony {
    TEMPLATE = subdirs
    SUBDIRS += ohextras
} else {
    TEMPLATE = aux
    CONFIG += force_qt
    QMAKE_DOCS = $$PWD/ohextras/doc/qtohextras.qdocconf
}
