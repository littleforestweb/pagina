#!/bin/sh

curl -s -o $2 "http://127.0.0.1:1459/get?$1"
