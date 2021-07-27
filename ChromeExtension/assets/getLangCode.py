# -*- coding: utf-8 -*-
# !/usr/bin/python3

import requests

if __name__ == "__main__":

    # langCode = "https://api.languagetoolplus.com/v2/languages"
    # resp = requests.get(url=langCode).json()

    # for entry in resp:
    #     name = entry["name"]
    #     code = entry["longCode"]
    #     text = "<option value=" + code + ">" + name + "</option>"
    #     print(text)

    with open("assets/names.txt") as f:
        names = f.readlines()
    names = [x.strip() for x in names]

    with open("assets/methods.txt") as f:
        methods = f.readlines()
    methods = [x.strip().replace("()", "") for x in methods]

    for name, method in zip(names, methods):
        print('case "' + method + '":')
        print('langTool = new JLanguageTool(new ' + method + '());')
        print("disableAll();")
        print('break;')
