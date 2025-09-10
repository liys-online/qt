/*******************************************************************
 *  Copyright(c) 2022-2025 Ltd.
 *  All right reserved. See LGPL for detailed Information
 *
 *  文件名称: qohfileshare.cpp
 *  简要描述: 提供了支持基于URI的文件及目录授于持久化权限、权限激活、权限查询等方法
 *  创建日期: 2024/10/22
 *  作者: WangHao
 *  说明:
 *
 *  修改日期:
 *  作者:
 *  说明:
 ******************************************************************/
#include <QUrl>
#include <QDebug>
#include <malloc.h>
#include <QVarLengthArray>
#include <QLoggingCategory>
#include <filemanagement/fileshare/oh_file_share.h>

#include "qohfileshare.h"

Q_LOGGING_CATEGORY(fileshare, "ohos.fileshare.permission");

namespace PermissionType {
    Q_NAMESPACE

    enum Permission {
        E_REVOKEPERMISSION,
        E_PERSISTPERMISSION,
        E_ACTIVATEPERMISSION,
        E_DEACTIVATEPERMISSION
    };
    Q_ENUM_NS(Permission)
}



/*!
 * \brief permission helper functions
 * \param type permission type
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return error code
 */
static QOHFileShare::Error permissionHelper(PermissionType::Permission type,
                                            const QOHFileShare::Policys &policys,
                                            QOHFileShare::Results &results)
{
    if (500 < policys.size()) {
        qCWarning(fileshare) << "exceed the limit";
        return QOHFileShare::EXCEED_LIMIT;
    }

    QByteArrayList urlByts{};
    QVarLengthArray<FileShare_PolicyInfo> pcs;
    for (const QOHFileShare::Policy &p: qAsConst(policys)) {
        QUrl url = QUrl::fromUserInput(p.file);
        QByteArray urlByt = url.toEncoded();
        FileShare_PolicyInfo fp {
            urlByt.data(),            
            static_cast<quint32>(urlByt.length()),
            FileShare_OperationMode(quint8(p.mode))
        };
        pcs.append(fp);
        urlByts.append(urlByt);
    };

    quint32 resultNum(0);
    FileManagement_ErrCode ret(ERR_UNKNOWN);
    FileShare_PolicyErrorResult* result = nullptr;
    switch(type){
    case PermissionType::E_REVOKEPERMISSION:
        ret = OH_FileShare_RevokePermission(const_cast<FileShare_PolicyInfo*>(pcs.constData()), pcs.size(), &result, &resultNum);
        break;
    case PermissionType::E_PERSISTPERMISSION:
        ret = OH_FileShare_PersistPermission(const_cast<FileShare_PolicyInfo*>(pcs.constData()), pcs.size(), &result, &resultNum);
        break;
    case PermissionType::E_ACTIVATEPERMISSION:
        ret = OH_FileShare_ActivatePermission(const_cast<FileShare_PolicyInfo*>(pcs.constData()), pcs.size(), &result, &resultNum);
        break;
    case PermissionType::E_DEACTIVATEPERMISSION:
        ret = OH_FileShare_DeactivatePermission(const_cast<FileShare_PolicyInfo*>(pcs.constData()), pcs.size(), &result, &resultNum);
        break;
    default:
        return QOHFileShare::INVALID_MODE;
    }

    if (ERR_OK != ret) {
        qCWarning(fileshare) << type << " method failed, code: " << ret << "result size:" << resultNum;
        if (ERR_EPERM != ret && Q_NULLPTR != result) {
            for (quint32 i = 0; i < resultNum; ++i) {
                QOHFileShare::Result r{
                    QOHFileShare::Error(result[i].code),
                    QString::fromLocal8Bit(result[i].uri),
                    QString::fromLocal8Bit(result[i].message)
                };
                results.append(r);

                qCDebug(fileshare) << "error uri: " << result[i].uri
                                   << "error code: " << result[i].code
                                   << "error message: " << result[i].message;
            }
        }
    }

    OH_FileShare_ReleasePolicyErrorResult(result, resultNum);

    return QOHFileShare::Error(ret);
}

/*!
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

/*!
 * \brief unpersist authorization for multiple selected file or directory
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::revokePermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_REVOKEPERMISSION, policys, results);
}

/*!
 * \brief activate multiple files or directories that have persisted authorization
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::activatePermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_ACTIVATEPERMISSION, policys, results);
}

/*!
 * \brief deactivate multiple files or directories that have persisted authorization
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param results the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::deactivatePermission(const Policys &policys, Results &results)
{
    return permissionHelper(PermissionType::E_DEACTIVATEPERMISSION, policys, results);
}

/*!
 * \brief Validates the persistence authorization for multiple files or directories selected
 * \param policys a list of policy information that needs to be granted or active up to 500
 * \param checks the resulted data
 * \return return error code
 */
QOHFileShare::Error QOHFileShare::checkPersistentPermission(const Policys &policys, Checks &checks)
{
    if (500 < policys.size()) {
        qCWarning(fileshare) << "exceed the limit";
        return QOHFileShare::EXCEED_LIMIT;
    }

    QByteArrayList urlByts{};
    QVarLengthArray<FileShare_PolicyInfo> pcs;
    for (const QOHFileShare::Policy &p: qAsConst(policys)) {
        QUrl url = QUrl::fromUserInput(p.file);
        QByteArray urlByt = url.toEncoded();
        FileShare_PolicyInfo fp {
            urlByt.data(),
            static_cast<quint32>(urlByt.length()),
            FileShare_OperationMode(quint8(p.mode))
        };
        pcs.append(fp);
        urlByts.append(urlByt);
    };

    quint32 resultNum(0);
    bool *result(nullptr);
    auto ret = OH_FileShare_CheckPersistentPermission(const_cast<FileShare_PolicyInfo*>(pcs.constData()), pcs.size(), &result, &resultNum);
    if (Q_NULLPTR != result && 0 < resultNum) {
        for(quint32 i = 0; i < resultNum && resultNum <= quint32(pcs.size()); ++i) {
            CheckResult cr { bool(result[i]), policys.at(i).file };
            checks.append(cr);
        }
    }

    free(result);

    return Error(ret);
}

#include "qohfileshare.moc"
