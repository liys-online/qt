#ifndef QOHWIDGETHELPER_H
#define QOHWIDGETHELPER_H
#include <QObject>
#include "qopenharmonyextrasglobal.h"

QT_BEGIN_NAMESPACE
class QWidget;
class QWindow;
class QOhWidgetHelperPrivate;

class Q_OPENHARMONYEXTRAS_EXPORT QOhWidgetHelper : public QObject
{
    Q_OBJECT
    Q_DECLARE_PRIVATE(QOhWidgetHelper)
public:
    enum class ColorMode {
        COLOR_MODE_NOT_SET = -1,
        COLOR_MODE_DARK = 0,
        COLOR_MODE_LIGHT = 1
    };

    struct DecorButtonStyle {
        ColorMode colorMode;
        int buttonBackgroundSize;
        int spacingBetweenButtons;
        int closeButtonRightMargin;
    };

    enum SupportedWindowMode {
        /*窗口支持全屏显示*/
        FULL_SCREEN = 0x1,
        /*窗口支持分屏显示*/
        SPLIT = 0x2,
        /*支持窗口化显示*/
        FLOATING = 0x04
    };
    Q_DECLARE_FLAGS(SupportedWindowModes, SupportedWindowMode)

    QOhWidgetHelper(QWidget *widget, QObject *parent = Q_NULLPTR);
    QOhWidgetHelper(QWindow *window, QObject *parent = Q_NULLPTR);
    ~QOhWidgetHelper();

    void setPrivacyMode(bool isPrivacyMode);
    bool isPrivacyMode() const;

    void setWindowRectAutoSave(bool enable);
    bool isWindowRectAutoSave() const;

    void removeStartingWindow();
    QRect titleButtonRect() const;
    void registerTitleButtonRectChangedListener();

    DecorButtonStyle decorButtonStyle() const;
    void setDecorButtonStyle(const DecorButtonStyle &style);

    void setWindowKeepScreenOn(bool isKeepScreenOn);
    void setSupportedWindowModes(SupportedWindowModes modes);
    void setWindowBackgroundColor(const QColor &color);

    void setWindowCornerRadius(qreal cornerRadius = 16);
    qreal windowCornerRadius();

    bool windowDecorVisible() const;
    void setWindowDecorVisible(bool visible);

    void setResizeByDragEnabled(bool enable);
    void setWindowShadowRadius(qreal shadowRadius);

    void setWindowTitleMoveEnabled(bool enable);
    void setWindowTitleButtonVisible(bool maximizeButtonVisible,
                                     bool minimizeButtonVisible,
                                     bool closeButtonVisible);

signals:
    void titleButtonRectChanged(const QRect &rect);
    // QObject interface
public:
    virtual bool eventFilter(QObject *watched, QEvent *event) override;
};
Q_DECLARE_OPERATORS_FOR_FLAGS(QOhWidgetHelper::SupportedWindowModes)
Q_DECLARE_METATYPE(QOhWidgetHelper::DecorButtonStyle)

QT_END_NAMESPACE
#endif
