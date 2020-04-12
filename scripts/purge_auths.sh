#!/bin/bash
./w.sh "<< checking for old keys...........>>\r"
sshpass -p $3 ssh $1@$2 "cat ~/.ssh/authorized_keys" > /dev/null
sshpass -p $3 ssh $1@$2 "rm ~/.ssh/authorized_keys" > /dev/null
./w.sh "<< purged ...........>>\r"
./w.sh "\n"