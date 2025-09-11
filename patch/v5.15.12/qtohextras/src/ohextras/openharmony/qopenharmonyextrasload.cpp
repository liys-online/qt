/****************************************************************************
 *
 * Copyright (C) 2025 iSoftStone. All rights reserved.
 * See LGPL for detailed Information
 * 
 * This file is part of the qtohextras module.
 * 
 ****************************************************************************/
#include <napi/native_api.h>
#include <hilog/log.h>

#include "qopenharmonywant.h"
#include "qopenharmonydefines.h"
#include "private/qtnihelpers_p.h"
#include "qopenharmonyjsenvironment.h"
#include "qohmsgnotice.h"
/*
 * function for module exports
 */
EXTERN_C_START
static napi_value Init(napi_env env, napi_value exports)
{
    static bool initialized = false;
    if (initialized)
        return exports;


    initialized = true;
    LOGI("init in qt openharmony extras");
    qRegisterMetaType<QOpenHarmonyWant>();
    std::function<napi_value(const QOpenHarmonyWant &)> wantCreatorFunc = QOpenHarmonyWant2JsWant;
    qJs::registerCreator(wantCreatorFunc);
    QtOhPrivate::init(env, exports);
    QOpenHarmonyAbility::init(env, exports);
    QOpenHarmonyMsgNotice::init(env, exports);
    return exports;
}
EXTERN_C_END

/*
 * Napi Module define
 */
static napi_module openharmonyQtOHExtrasModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = Init,
    .nm_modname = "Qt5OhExtras",
    .nm_priv = ((void*)0),
    .reserved = { 0 },
};
/*
 * Module register function
 */
extern "C" __attribute__((constructor)) void RegisterModule(void)
{
    napi_module_register(&openharmonyQtOHExtrasModule);
}
