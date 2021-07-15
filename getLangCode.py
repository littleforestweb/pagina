# -*- coding: utf-8 -*-
# !/usr/bin/python3

import requests

if __name__ == "__main__":
    langCode = "https://api.languagetoolplus.com/v2/languages"
    resp = requests.get(url=langCode).json()

    for entry in resp:
        name = entry["name"]
        code = entry["longCode"]
        text = "{ id: '" + code + "', title: '" + name + "',} ,"
        print(text)
