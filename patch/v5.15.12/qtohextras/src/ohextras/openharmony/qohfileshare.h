/****************************************************************************
 *
 * Copyright (C) 2025 iSoftStone. All rights reserved.
 * See LGPL for detailed Information
 * 
 * This file is part of the qtohextras module.
 *
 *  文件名称: qohfileshare.h
 *  简要描述: 提供了支持基于URI的文件及目录授于持久化权限、权限激活、权限查询等方法
 *  创建日期: 2024/10/22
 *  作者: WangHao
 *  说明:
 *
 *  修改日期:
 *  作者:
 *  说明:
 ******************************************************************/
#ifndef QOHFILESHARE_H
#define QOHFILESHARE_H

#include <QStringList>
#include "qopenharmonyextrasglobal.h"

class Q_OPENHARMONYEXTRAS_EXPORT QOHFileShare
{
public:
    enum Q_OPENHARMONYEXTRAS_EXPORT Mode {
        /**
         * @brief Indicates read permissions.
         */
        READ_MODE = 1 << 0,

        /**
         * @brief Indicates write permissions.
         */
        WRITE_MODE = 1 << 1
    };
    Q_DECLARE_FLAGS(Modes, Mode)


    enum Q_OPENHARMONYEXTRAS_EXPORT Error {
        /**
         * operation completed successfully.
         */
        ERR_OK = 0,

        /**
         * @brief exceed the limit
         */
        EXCEED_LIMIT = -1,

        /**
         * @brief Indicates that the policy is not allowed to be persisted.
         */
        PERSISTENCE_FORBIDDEN = 1,

        /**
         * @brief Indicates that the mode of this policy is invalid.
         */
        INVALID_MODE = 2,

        /**
         * @brief Indicates that the path of this policy is invalid.
         */
        INVALID_PATH = 3,

        /**
         * @brief Indicates that the policy is no persistent capability.
         */
        PERMISSION_NOT_PERSISTED = 4
    };

    struct Q_OPENHARMONYEXTRAS_EXPORT Policy {
        Modes mode;
        QString file;
    };
    using Policys = QList<Policy>;

    struct Q_OPENHARMONYEXTRAS_EXPORT Result {
        Error code;
        QString file;
        QString errMsg;
    };
    using Results = QList<Result>;

    struct Q_OPENHARMONYEXTRAS_EXPORT CheckResult {
        bool result;
        QString file;
    };
    using Checks = QList<CheckResult>;

    /*!
     * \brief persistent authorization for multiple selected file or directory
     * \param policys a list of policy information that needs to be granted or active up to 500
     * \param results the resulted data
     * \return return error code
     */
    static Error persistPermission(const Policys &policys, Results &results);

    /*!
     * \brief unpersist authorization for multiple selected file or directory
     * \param policys a list of policy information that needs to be granted or active up to 500
     * \param results the resulted data
     * \return return error code
     */
    static Error revokePermission(const Policys &policys, Results &results);

    /*!
     * \brief activate multiple files or directories that have persisted authorization
     * \param policys a list of policy information that needs to be granted or active up to 500
     * \param results the resulted data
     * \return return error code
     */
    static Error activatePermission(const Policys &policys, Results &results);

    /*!
     * \brief deactivate multiple files or directories that have persisted authorization
     * \param policys a list of policy information that needs to be granted or active up to 500
     * \param results the resulted data
     * \return return error code
     */
    static Error deactivatePermission(const Policys &policys, Results &results);

    /*!
     * \brief Validates the persistence authorization for multiple files or directories selected
     * \param policys a list of policy information that needs to be granted or active up to 500
     * \param checks the resulted data
     * \return return error code
     */
    static Error checkPersistentPermission(const Policys &policys, Checks &checks);
};

Q_DECLARE_OPERATORS_FOR_FLAGS(QOHFileShare::Modes)

#endif // QOHFILESHARE_H
