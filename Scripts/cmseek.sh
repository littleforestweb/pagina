#!/bin/sh

python3 /opt/scripts/wappalyzer/CMSeeK/cmseek.py --url "$1" --follow-redirect --log "$2"
