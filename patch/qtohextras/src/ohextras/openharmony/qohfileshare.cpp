/* ***************************************************************************
 *
 * Copyright (C) 2025 iSoftStone. All rights reserved.
 * See LGPL for detailed Information
 *
 * This file is part of the qtohextras module.
 *
 * 文件名称: qohfileshare.cpp
 * 简要描述: 提供了支持基于URI的文件及目录授于持久化权限、权限激活、权限查询等方法
 * 创建日期: 2024/10/22
 * 作者: WangHao
 * 说明:
 *
 * 修改日期:
 * 作者:
 * 说明:
 * **************************************************************** */
#include <QUrl>
#include <QDebug>
#include <malloc.h>
#include <QVarLengthArray>
#include <QLoggingCategory>
#include <filemanagement/fileshare/oh_file_share.h>

#include "qohfileshare.h"

Q_LOGGING_CATEGORY(fileshare, "ohos.fileshare.permission");

namespace {
constexpr int K_MAX_POLICY_COUNT = 500;
}

namespace PermissionType {
Q_NAMESPACE

enum Permission { E_REVOKEPERMISSION, E_PERSISTPERMISSION, E_ACTIVATEPERMISSION, E_DEACTIVATEPERMISSION };
Q_ENUM_NS(Permission)
}


/* !
 * \brief convert policy list to native API format
 * \param policys input policy list
 * \param policyInfos output native policy info array
 * \param urlByts output byte array list to keep URL data alive
 * \return error code
 */
static QOHFileShare::Error convertPoliciesToNativeFormat(const QOHFileShare::Policys &policys,
    QVarLengthArray<FileShare_PolicyInfo> &policyInfos, QByteArrayList &urlByts)
{
    if (policys.size() > K_MAX_POLICY_COUNT) {
        qCWarning(fileshare) << "exceed the limit";
        return QOHFileShare::EXCEED_LIMIT;
    }

    for (const QOHFileShare::Policy &p : qAsConst(policys)) {
        QUrl url = QUrl::fromUserInput(p.file);
        QByteArray urlByt = url.toEncoded();
        FileShare_PolicyInfo fp{ urlByt.data(), static_cast<quint32>(urlByt.length()),
            FileShare_OperationMode(quint8(p.mode)) };
        policyInfos.append(fp);
        urlByts.append(urlByt);
    }

    return QOHFileShare::ERR_OK;
}

/* !
 * \brief execute permission operation based on type
 * \param type permission operation type
 * \param policyInfos native policy info array
 * \param result output result pointer
 * \param resultNum output result count
 * \return native API error code
 */
static FileManagement_ErrCode executePermissionOperation(PermissionType::Permission type,
    const QVarLengthArray<FileShare_PolicyInfo> &policyInfos,
    FileShare_PolicyErrorResult **result, quint32 *resultNum)
{
    switch (type) {
        case PermissionType::E_REVOKEPERMISSION:
            return OH_FileShare_RevokePermission(const_cast<FileShare_PolicyInfo *>(policyInfos.constData()),
                policyInfos.size(), result, resultNum);
        case PermissionType::E_PERSISTPERMISSION:
            return OH_FileShare_PersistPermission(const_cast<FileShare_PolicyInfo *>(policyInfos.constData()),
                policyInfos.size(), result, resultNum);
        case PermissionType::E_ACTIVATEPERMISSION:
            return OH_FileShare_ActivatePermission(const_cast<FileShare_PolicyInfo *>(policyInfos.constData()),
                policyInfos.size(), result, resultNum);
        case PermissionType::E_DEACTIVATEPERMISSION:
            return OH_FileShare_DeactivatePermission(const_cast<FileShare_PolicyInfo *>(policyInfos.constData()),
                policyInfos.size(), result, resultNum);
        default:
            return ERR_UNKNOWN;
    }
}

/* !
 * \brief process permission operation results and collect errors
 * \param ret native API return code
 * \param type permission operation type
 * \param result native API result array
 * \param resultNum result count
 * \param results output results list
 */
static void processPermissionResults(FileManagement_ErrCode ret, PermissionType::Permission type,
    FileShare_PolicyErrorResult *result, quint32 resultNum, QOHFileShare::Results &results)
{
    if (ERR_OK != ret && (ERR_EPERM != ret && Q_NULLPTR != result)) {
        qCWarning(fileshare) << type << " method failed, code: " << ret << "result size:" << resultNum;
        for (quint32 i = 0; i < resultNum; ++i) {
            QOHFileShare::Result r{ QOHFileShare::Error(result[i].code), QString::fromLocal8Bit(result[i].uri),
                QString::fromLocal8Bit(result[i].message) };
            results.append(r);

            qCDebug(fileshare) << "error uri: " << result[i].uri << "error code: " << result[i].code <<
                "error message: " << result[i].message;
        }
    }
}

/* !
 * \brief permission helper functions
 * \param type permission type
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return error code
 */
static QOHFileShare::Error permissionHelper(PermissionType::Permission type, const QOHFileShare::Policys &policys,
    QOHFileShare::Results &results)
{
    QByteArrayList urlByts{};
    QVarLengthArray<FileShare_PolicyInfo> pcs;
    
    // Convert policies to native format
    QOHFileShare::Error convertError = convertPoliciesToNativeFormat(policys, pcs, urlByts);
    if (convertError != QOHFileShare::ERR_OK) {
        return convertError;
    }

    // Execute permission operation
    quint32 resultNum(0);
    FileShare_PolicyErrorResult *result = nullptr;
    FileManagement_ErrCode ret = executePermissionOperation(type, pcs, &result, &resultNum);
    // Handle invalid operation type
    if (ret == ERR_UNKNOWN && type > PermissionType::E_DEACTIVATEPERMISSION) {
        return QOHFileShare::INVALID_MODE;
    }

    // Process results and collect errors
    processPermissionResults(ret, type, result, resultNum, results);

    // Process results and collect errors
    processPermissionResults(ret, type, result, resultNum, results);

    OH_FileShare_ReleasePolicyErrorResult(result, resultNum);

    return QOHFileShare::Error(ret);
}

/* !
 * \brief activate multiple files or directories that have persisted authorization
 * \param files list of files or directories to activate up to 500
 * \param mode enumerates the uri operate mode types.
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::persistPermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_PERSISTPERMISSION, policys, results);
}

/* !
 * \brief unpersist authorization for multiple selected file or directory
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::revokePermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_REVOKEPERMISSION, policys, results);
}

/* !
 * \brief activate multiple files or directories that have persisted authorization
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::activatePermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_ACTIVATEPERMISSION, policys, results);
}

/* !
 * \brief deactivate multiple files or directories that have persisted authorization
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::deactivatePermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_DEACTIVATEPERMISSION, policys, results);
}

/* !
 * \brief Validates the persistence authorization for multiple files or directories selected
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param checks the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::checkPersistentPermission(const Policys &policys, Checks &checks)
{
    if (policys.size() > K_MAX_POLICY_COUNT) {
        qCWarning(fileshare) << "exceed the limit";
        return QOHFileShare::EXCEED_LIMIT;
    }

    QByteArrayList urlByts{};
    QVarLengthArray<FileShare_PolicyInfo> pcs;
    for (const QOHFileShare::Policy &p : qAsConst(policys)) {
        QUrl url = QUrl::fromUserInput(p.file);
        QByteArray urlByt = url.toEncoded();
        FileShare_PolicyInfo fp{ urlByt.data(), static_cast<quint32>(urlByt.length()),
            FileShare_OperationMode(quint8(p.mode)) };
        pcs.append(fp);
        urlByts.append(urlByt);
    };

    quint32 resultNum(0);
    bool *result(nullptr);
    auto ret = OH_FileShare_CheckPersistentPermission(const_cast<FileShare_PolicyInfo *>(pcs.constData()), pcs.size(),
        &result, &resultNum);
    if (Q_NULLPTR != result && 0 < resultNum) {
        for (quint32 i = 0; i < resultNum && resultNum <= quint32(pcs.size()); ++i) {
            CheckResult cr{ bool(result[i]), policys.at(i).file };
            checks.append(cr);
        }
    }

    free(result);

    return Error(ret);
}

#include "qohfileshare.moc"
