#!/bin/bash

ssh pi@192.168.8.120 rm -rf package;
ssh pi@192.168.8.120 mkdir package;
scp -r server.js *.html *.json ./node_modules pi@192.168.8.120:/home/pi/package
ssh pi@192.168.8.120 "cd package; ls;npm i;node server.js"
