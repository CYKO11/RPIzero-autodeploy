#!/bin/bash

git add .
git commit -m "$1"
git push
ssh pi@"$2" "cd RPIzero-autodeploy; git reset --hard; git pull; cd node; node server.js"