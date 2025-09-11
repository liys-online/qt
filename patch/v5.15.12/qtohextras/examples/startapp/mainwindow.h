/* ***************************************************************************
 *
 * Copyright (C) 2025 iSoftStone. All rights reserved.
 * See LGPL for detailed Information
 *
 * This file is part of the qtohextras module.
 *
 * ************************************************************************** */
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QWidget>

namespace Ui {
class MainWindow;
}

class MainWindow : public QWidget {
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_pushButton_add_clicked();

    void on_pushButton_delete_clicked();

    void on_pushButton_ok_clicked();

private:
    Ui::MainWindow *ui;
};

#endif // MAINWINDOW_H
