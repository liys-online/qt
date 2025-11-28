#ifndef QOPENHARMONYABILITY_H
#define QOPENHARMONYABILITY_H

#include <functional>

#include <QString>
#include <QtNapi/napi.h>
#include <QVariantMap>
#include <QPixmap>
#include "qopenharmonyextrasglobal.h"

#define     DEFAULT_VAL   (0xFFFFU)

enum class SupportWindowMode {
    FULL_SCREEN = 0,
    SPLIT = 1,
    FLOATING = 2,
    INVALID_VAL = DEFAULT_VAL
};

struct QOpenHarmonyWant {
    QString deviceId;
    QString bundleName;
    QString moduleName;
    QString abilityName;
    QString action;
    QStringList entities;
    QString uri;
    QString type;
    QVariantMap parameters;
    int flags = 0;
};

/*https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V14/
 * js-apis-app-ability-startoptions-V14?catalogVersion=V14*/
struct QOpenHarmonyStartOptions {
    int windowMode;
    int displayId;
    bool withAnimation;
    int windowLeft;
    int windowTop;
    int windowWidth;
    int windowHeight;
    int processMode;
    int startupVisibility;
    QPixmap startWindowIcon;
    QString startWindowBackgroundColor;
    QList<SupportWindowMode> supportWindowModes;

    QOpenHarmonyStartOptions()
        : windowMode(DEFAULT_VAL),
          displayId(0),
          withAnimation(true),
          windowLeft(DEFAULT_VAL),
          windowTop(DEFAULT_VAL),
          windowWidth(DEFAULT_VAL),
          windowHeight(DEFAULT_VAL),
          processMode(DEFAULT_VAL),
          startupVisibility(DEFAULT_VAL),
          startWindowIcon(),
          startWindowBackgroundColor(),
          supportWindowModes({ }){ }
};

Q_DECLARE_METATYPE(QOpenHarmonyWant)
Q_DECLARE_METATYPE(QOpenHarmonyStartOptions)
Q_DECLARE_METATYPE(SupportWindowMode)

namespace QOpenHarmonyAbility {
class Q_OPENHARMONYEXTRAS_EXPORT QAbilityResultReceiver
{
    Q_DISABLE_COPY(QAbilityResultReceiver)
public:
    QAbilityResultReceiver();
    virtual ~QAbilityResultReceiver();
    /*!
     * \brief handle the startAbility result.
     * \param err error code(BusinessError)(Napi::Object)
     * \param result startAbility's result(AbilityResult)(Napi::Object)
     */
    virtual void handleResult(const Napi::Value &err, const Napi::Value &result = Napi::Value()) = 0;
};

Q_OPENHARMONYEXTRAS_EXPORT void start(const QOpenHarmonyWant &want,
                                      const QOpenHarmonyStartOptions &startOptions,
                                      QAbilityResultReceiver* receiver);
Q_OPENHARMONYEXTRAS_EXPORT void start(const QOpenHarmonyWant &want);
Q_OPENHARMONYEXTRAS_EXPORT void start(const QOpenHarmonyWant &want, QAbilityResultReceiver* receiver);

Q_OPENHARMONYEXTRAS_EXPORT void startForResult(const QOpenHarmonyWant &want,
                                               const QOpenHarmonyStartOptions &startOptions,
                                               QAbilityResultReceiver* receiver);

Q_OPENHARMONYEXTRAS_EXPORT void startForResult(const QOpenHarmonyWant &want);
Q_OPENHARMONYEXTRAS_EXPORT void startForResult(const QOpenHarmonyWant &want, QAbilityResultReceiver* receiver);
}

#endif // QOPENHARMONYABILITY_H
