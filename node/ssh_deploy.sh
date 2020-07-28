#!/bin/bash
if [ $1 == "hard" ]
then
    echo "hard_deploy"
    ssh pi@192.168.8.120 rm -rf package;
    ssh pi@192.168.8.120 mkdir package;
    scp -r server.js *.html *.json pi@192.168.8.120:/home/pi/package
    ssh pi@192.168.8.120 "cd package;npm i;node server.js"
else 
    echo "soft_deploy"
    scp -r server.js *.html *.json pi@192.168.8.120:/home/pi/package
    ssh pi@192.168.8.120 "cd package;node server.js"
fi
