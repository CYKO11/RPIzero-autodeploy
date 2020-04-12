#!/bin/bash
echo "copying $PWD/$3"
echo "to $1@$2:$4"
if scp $PWD/$3 $1@$2:$4 > /dev/null ; then
    echo "<< copy success >>"
else
    ssh $1@$2 "ls $4"
fi