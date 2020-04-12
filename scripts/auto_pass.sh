#!/usr/bin/expect -f
set old [lindex $argv 0]
set new [lindex $argv 1]
set timeout 20
spawn passwd
expect  "d:"
send "$old\n"
expect  "d:"
send "$new\n"
expect  "d:"
send "$new\n"
interact
