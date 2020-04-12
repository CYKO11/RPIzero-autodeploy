#!/bin/bash
./send.sh $1 $2 auto_pass.sh /home/pi
ssh $1@$2 "./auto_pass.sh $3 $4; rm ./auto_pass.sh"
./make_key.sh $1 $2 $4 1024