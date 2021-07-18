# -*- coding: utf-8 -*-
# !/usr/bin/python3

if __name__ == "__main__":
    with open("assets/names.txt") as f:
        names = f.readlines()
    names = [x.strip() for x in names]

    with open("assets/methods.txt") as f:
        methods = f.readlines()
    methods = [x.strip().replace("()", "") for x in methods]

    with open("assets/codes.txt") as f:
        codes = f.readlines()
    codes = [x.strip().replace("()", "") for x in codes]

    for name, method, code in zip(names, methods, codes):
        print("{ id: '" + code + "', title: '" + name + "', },")

        # print('case "' + code + '":')
        # print('langTool = new JLanguageTool(new ' + method + '());')
        # print('langName = "' + name + '";')
        # print('break;')
