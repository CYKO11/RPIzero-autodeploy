#!/bin/bash
if [ "$1" != "\n" ] ; then  
    echo -ne "                                                           \r"
    echo -ne "$1\r"
else
    echo -ne "\n"
fi