#!/bin/bash
pid=`ps -ax | grep 'java -jar' | grep -v 'grep' | cut -d ' ' -f 1`
kill -9 $pid

mvn clean package
cp -r codechess-frontend/* codechess-core/target/codechess-core/src/main/webapp

cd codechess-core/target
nohup java -jar codechess-core.jar &
