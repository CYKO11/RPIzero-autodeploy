#!/bin/bash
# usage -> ./new_key.sh <server username> <server ip> <server password>
./purge_auths.sh $1 $2 $3
sleep 1
./make_key.sh $1 $2 $3 4096
