/*******************************************************************
 *  Copyright(c) 2022-2025 Ltd.
 *  All right reserved. See LGPL for detailed Information
 *
 *  文件名称: qohappcontext.h
 *  简要描述: 主题相关处理类
 *  创建日期: 2025/06/18
 *  作者: WangHao
 *  说明:
 *
 *  修改日期:
 *  作者:
 *  说明:
 ******************************************************************/
#ifndef QOHAPPCONTEXT_H
#define QOHAPPCONTEXT_H
#include <QObject>
#include "qopenharmonyextrasglobal.h"

class QOhAppContextPrivate;
class Q_OPENHARMONYEXTRAS_EXPORT QOhAppContext : public QObject
{
    Q_OBJECT
    Q_DECLARE_PRIVATE(QOhAppContext)
    Q_DISABLE_COPY_MOVE(QOhAppContext)
    QOhAppContext(QObject *parent = nullptr);

public:
    enum class ColorMode {
        Dark,
        Light,
        Default,
        FollowSystemSetting
    };
    ~QOhAppContext();
    static QOhAppContext *instance();

    ColorMode colorMode() const;

public Q_SLOTS:
    void setColorMode(QOhAppContext::ColorMode mode);

Q_SIGNALS:
    void colorModeChanged(QOhAppContext::ColorMode, QPrivateSignal);
};
Q_DECLARE_METATYPE(QOhAppContext::ColorMode)

#endif // QOHAPPCONTEXT_H
