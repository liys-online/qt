/* ***************************************************************************
 *
 * Copyright (C) 2025 iSoftStone. All rights reserved.
 * See LGPL for detailed Information
 *
 * This file is part of the qtohextras module.
 *
 * 文件名称: qohfunctions.h
 * 简要描述: 提供鸿蒙Native开发的辅助接口函数
 * 创建日期: 2024/11/06
 * 作者: WangHao
 * 说明:
 *
 * 修改日期: 2025/1/14
 * 作者: WangHao
 * 说明: 添加接口
 * requestPermissionsOnSetting
 * requestPermissionsOnSettingSync
 * **************************************************************** */
#ifndef QOHFUNCTIONS_H
#define QOHFUNCTIONS_H

#include <QDebug>
#include <functional>
#include <QStringList>

#include "qopenharmonyextrasglobal.h"

QT_BEGIN_NAMESPACE

namespace QtOh {
enum class PermissionResult { Denied = -1, Granted = 0, InValidRequest = 2 };

struct PermissionRequestResult {
    QStringList permissions;
    QList<PermissionResult> authResults;
    QList<bool> dialogShownResults;

    PermissionRequestResult() = default;
    PermissionRequestResult(const QStringList &perms, const QList<PermissionResult> &auth,
        const QList<bool> &dialogShown)
        : permissions(perms), authResults(auth), dialogShownResults(dialogShown)
    {}
};

using PermissionResultCallback = std::function<void(const PermissionRequestResult &)>;
using enableNotificationFunc = std::function<void(bool)>;

/* !
 * \brief get the api version supported by the os.
 * \return version
 */
Q_OPENHARMONYEXTRAS_EXPORT int ohSdkVersion();
/* !
 * \brief verify whether the application has been granted permissions,
 * with the result returned synchronously.
 * \param permission authorization
 * \return authorization result
 */
Q_OPENHARMONYEXTRAS_EXPORT PermissionResult checkPermission(const QString &permission);

/* !
 * \brief used by uiability to bring up a pop-up box to request user authorization.
 * returns the result synchronously.
 * \param permissions authorization list
 * \param timeoutMs timeout (in milliseconds)
 * \return authorization result
 */
Q_OPENHARMONYEXTRAS_EXPORT PermissionRequestResult requestPermissionsSync(const QStringList &permissions,
    int timeoutMs = INT_MAX);

/* !
 * \brief used by uiability to bring up a pop-up box to request user authorization.
 * utilizes asynchronous callback with callback.
 * \param permissions authorization list
 * \param callbackFunc asynchronous callback
 */
Q_OPENHARMONYEXTRAS_EXPORT void requestPermissions(const QStringList &permissions,
    const PermissionResultCallback &callbackFunc);

/* !
 * \brief Used for UIAbility/UIExtensionAbility secondary prompt to set permission pop-ups.(Synchronous)
 * Before calling this interface, the application needs to call \b{requestPermissionsFromUser} first.
 * If the user has already granted permission in the initial pop-up, calling this interface will not bring up the pop-up
 * window \param permissions authorization list \param timeoutMs timeout (in milliseconds) \return authorization result
 */
Q_OPENHARMONYEXTRAS_EXPORT PermissionRequestResult requestPermissionsOnSettingSync(const QStringList &permissions,
    int timeoutMs = INT_MAX);

/* !
 * \brief Used for UIAbility/UIExtensionAbility secondary prompt to set permission pop-ups.(Asynchronous Callback)
 * Before calling this interface, the application needs to call \b{requestPermissionsFromUser} first.
 * If the user has already granted permission in the initial pop-up, calling this interface will not bring up the pop-up
 * window \param permissions authorization list \param callbackFunc asynchronous callback
 */
Q_OPENHARMONYEXTRAS_EXPORT void requestPermissionsOnSetting(const QStringList &permissions,
    const PermissionResultCallback &callbackFunc);

/* !
 * \brief used by uiability to bring up a pop-up box to request Notification.
 * utilizes asynchronous callback with callback.
 * \param callbackFunc asynchronous callback
 */
Q_OPENHARMONYEXTRAS_EXPORT void requestEnableNotification(const enableNotificationFunc &callbackFunc);

/* !
 * \brief used by uiability to bring up a pop-up box to request Notification.
 * returns the result synchronously.
 * \param timeoutMs timeout (in milliseconds)
 * \return request result
 */
Q_OPENHARMONYEXTRAS_EXPORT bool requestEnableNotificationSync(int timeoutMs = INT_MAX);

/* !
 * \brief Verify that the application has notification rights,
 * with the result returned synchronously.
 * \return request result
 */
Q_OPENHARMONYEXTRAS_EXPORT bool isNotificationEnabled();

/* !
 * \brief Pull up the notification setting interface of the application.
 */
Q_OPENHARMONYEXTRAS_EXPORT void openNotificationSettings();
}

#ifndef QT_NO_DEBUG_STREAM
Q_OPENHARMONYEXTRAS_EXPORT QDebug operator << (QDebug, const QtOh::PermissionRequestResult &);
#endif

QT_END_NAMESPACE

#endif // QOHFUNCTIONS_H
