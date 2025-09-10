#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QIntValidator>
#include <QComboBox>
#include <QOpenHarmonyWant>
#include <qopenharmonyability.h>
#include <QDebug>
MainWindow::MainWindow(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    QIntValidator *v = new QIntValidator(this);
    v->setRange(0, 100);
    ui->lineEdit_flags->setValidator(v);


}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_add_clicked()
{
    QTableWidgetItem *item = new QTableWidgetItem("key");
    ui->tableWidget->insertRow(0);
    ui->tableWidget->setItem(0, 0, item);
    item = new QTableWidgetItem("value");
    ui->tableWidget->setItem(0, 1, item);
    QComboBox *box = new QComboBox;
    box->addItems(QStringList() << "string" << "int" << "float" << "bool");
    ui->tableWidget->setCellWidget(0, 2, box);
}

void MainWindow::on_pushButton_delete_clicked()
{
    int index = ui->tableWidget->currentRow();
    ui->tableWidget->removeRow(index);
}

void MainWindow::on_pushButton_ok_clicked()
{
    QOpenHarmonyWant want;
    want.deviceId = ui->lineEdit_deviceId->text();
    want.bundleName = ui->lineEdit_bundleName->text();
    want.abilityName = ui->lineEdit_abilityName->text();
    want.moduleName = ui->lineEdit_moduleName->text();
    want.action = ui->lineEdit_action->text();
    want.entities = ui->lineEdit_entities->text().split(";");
    want.uri = ui->lineEdit_uri->text();
    want.type = ui->lineEdit_type->text();
    want.flags = ui->lineEdit_flags->text().toInt();
    QVariantMap parameters;
    for (int i = 0; i < ui->tableWidget->rowCount(); ++i) {
        QTableWidgetItem *item = ui->tableWidget->item(i, 0);
        QString key = item->text();
        item = ui->tableWidget->item(i, 1);
        QString value = item->text();
        item = ui->tableWidget->item(i, 2);
        QString type = item->text();
        QVariant v;
        if (type == "int") {
            v = value.toInt();
        } else if (type == "bool") {
            v = (value == "true") || (value == "1");
        } else if (type == "float") {
            v = value.toFloat();
        } else {
            v = value;
        }
        want.parameters.insert(key, v);
    }
    bool result = QOpenHarmonyAbility::start(want);
    if (!result) {
        qWarning() << "open app failed";
    }
}
