#!/bin/sh
set -ex

# /home/travis/build/SixthFloor/FECS-Web/test/protractor_test/test_LoginAsMember.js

REPORT_DATE="$(date +"%m-%d-%y")"

TEST_TIME="$(date +"%H:%M:%S")"

npm run update-webdriver
gulp compile
http-server ./www -p 3030 &WEBSERVER_PID=$!

if [ $1 = "-protractor" ] && [ -z "$2" ];
then
	protractor test/protractor.conf.js && echo "skip"
	mv ./reports/ test_"${REPORT_DATE}"_"(${TEST_TIME})"/
	sshpass -p jl scp -o StrictHostKeyChecking=no -pr -P 22 /home/travis/build/SixthFloor/FECS-Web/test_"${REPORT_DATE}"_"(${TEST_TIME})" jl@128.199.133.224:/home/jl/Test_reports/feature-tests/
elif [ $1 = "-protractor" ] && [ $2 = "tester" ];
then
	protractor test/protractor.conf.js && echo "skip"
	mv ./reports/ ./test/test_reports/test_"${REPORT_DATE}"_"(${TEST_TIME})"/
elif [ "$1" = "-unit" ];
then
	npm run unit
else
	npm run runtest
fi

killall node