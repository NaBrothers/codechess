#!/bin/bash
echo "【codechess-web】"
echo "===== 开始发布 ====="
TOMCAT="/etc/tomcat/bin/catalina.sh"
TOMCAT_PATH="/etc/tomcat"
echo "开始结束旧进程..."
$TOMCAT stop
rm -rf $TOMCAT_PATH/webapps/codechess-web*
echo "旧进程结束成功！"

echo "开始编译源代码..."
mvn clean package
cp target/*.war $TOMCAT_PATH/webapps/codechess-web.war
unzip $TOMCAT_PATH/webapps/codechess-web.war -d $TOMCAT_PATH/webapps/codechess-web
cp -r ../codechess-frontend/* $TOMCAT_PATH/webapps/codechess-web
echo "源代码编译成功！"

echo "开始启动新进程..."
$TOMCAT start
echo "新进程启动成功！"

echo "===== 发布成功 ====="

