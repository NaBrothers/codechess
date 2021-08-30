#!/bin/bash
echo "===== 开始发布 ====="
echo "开始结束旧进程..."
pid=`ps -ax | grep 'java -jar codechess-core' | grep -v 'grep' | cut -d ' ' -f 1`
if [ -z $pid ];then
	pid=`ps -ax | grep 'java -jar' | grep -v 'grep' | cut -d ' ' -f 2 | cut -d ' ' -f 1`
fi
echo "旧进程结束成功！pid=[${pid}]"
kill -9 $pid

echo "开始编译源代码..."
mvn clean package
echo "源代码编译成功！"

echo "开始启动新进程..."
cd ./target
nohup java -jar codechess-core.jar &
newPid=`ps -ax | grep 'java -jar codechess-core' | grep -v 'grep' | cut -d ' ' -f 1`
if [ -z $newPid ];then
	newPid=`ps -ax | grep 'java -jar codechess-core' | grep -v 'grep' | cut -d ' ' -f 2 | cut -d ' ' -f 1`
fi
echo "新进程启动成功！pid=[${newPid}]"

echo "===== 发布成功 ====="

