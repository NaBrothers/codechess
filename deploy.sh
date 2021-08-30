#!/bin/bash
echo "===== 开始发布 ====="
echo "===== codechess-code ===="
cd codechess-core
./deploy.sh
cd ..
echo "===== codechess-web ===="
cd codechess-web
./deploy.sh
cd ..
echo "===== 发布成功 ====="

