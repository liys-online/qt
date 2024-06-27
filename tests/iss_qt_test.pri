INCLUDEPATH += $$PWD/harmony

defineReplace(pris){
    path = $$1
    FILES = $$files($$path/*.pri, true)
    return($$FILES)
}

defineReplace(sources){
    path = $$1
    FILES = $$files($$path/*.cpp, true)
    return($$FILES)
}

defineReplace(tst_sources){
    path = $$1
    FILES = $$files($$path/tst_*.cpp, true)
    return($$FILES)
}

defineReplace(headers){
    path = $$1
    FILES = $$files($$path/*.h, true)
    return($$FILES)
}

defineReplace(qrcs){
    path = $$1
    FILES = $$files($$path/*.qrc, true)
    return($$FILES)
}

defineReplace(appendInclude){
    SRCS += $$sources($$1)
    SRCS += $$headers($$1)
    DIRS = $$dirname(SRCS)
    SORTEDDIRS = $$sorted(DIRS)
    TMP_LIST = $$split(SORTEDDIRS, " ")
    DIR_LIST = $$unique(TMP_LIST)
    return($$DIR_LIST)
}
