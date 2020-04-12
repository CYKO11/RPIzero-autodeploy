#!/bin/bash
./w.sh "<< generating new key .................>>"
echo 'y' | ssh-keygen -t rsa -b $4 -P '' -N '' -f /home/$USER/.ssh/id_rsa > /dev/null
./w.sh "<< sending key to server ..........>>"
sshpass -p $3 ssh-copy-id $1@$2 &> /dev/null
./w.sh "<< key successfuly transfered......>>"
./w.sh "<< new key :"
./w.sh "\n"
sshpass -p $3 ssh $1@$2 "cat ~/.ssh/authorized_keys"
ssh-keygen -lv -f /home/$USER/.ssh/id_rsa
echo ">>"
