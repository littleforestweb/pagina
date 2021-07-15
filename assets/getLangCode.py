# -*- coding: utf-8 -*-
# !/usr/bin/python3

import requests

if __name__ == "__main__":
    # langCode = "https://api.languagetoolplus.com/v2/languages"
    # resp = requests.get(url=langCode).json()

    # for entry in resp:
    #     name = entry["name"]
    #     code = entry["code"]
    #     print('<option value="' + code + '">' + name + '</option>')

    method = [
        "Arabic",
        "Asturian",
        "Belarusian",
        "Breton",
        "Catalan",
        "ValencianCatalan",
        "Chinese",
        "Danish",
        "Dutch",
        "BelgianDutch",
        "AustralianEnglish",
        "CanadianEnglish",
        "BritishEnglish",
        "NewZealandEnglish",
        "SouthAfricanEnglish",
        "AmericanEnglish",
        "Esperanto",
        "French",
        "Galician",
        "AustrianGerman",
        "GermanyGerman",
        "SwissGerman",
        "Greek",
        "Icelandic",
        "Irish",
        "Italian",
        "Japanese",
        "Khmer",
        "Persian",
        "Polish",
        "Portuguese",
        "AngolaPortuguese",
        "BrazilianPortuguese",
        "MozambiquePortuguese",
        "PortugalPortuguese",
        "Romanian",
        "Russian",
        "SimpleGerman",
        "Slovak",
        "Slovenian",
        "Spanish",
        "SpanishVoseo",
        "Swedish",
        "Tagalog",
        "Tamil",
        "Ukrainian"]

    names = [
        "Arabic",
        "Asturian",
        "Belarusian",
        "Breton",
        "Catalan",
        "Catalan(Valencian)",
        "Chinese",
        "Danish",
        "Dutch",
        "Dutch(Belgium)",
        "English(Australian)",
        "English(Canadian)",
        "English(GB)",
        "English(New Zealand)",
        "English(South African)",
        "English(US)",
        "Esperanto",
        "French",
        "Galician",
        "German(Austria)",
        "German(Germany)",
        "German(Swiss)",
        "Greek",
        "Icelandic",
        "Irish",
        "Italian",
        "Japanese",
        "Khmer",
        "Persian",
        "Polish",
        "Portuguese",
        "Portuguese(Angola preAO)",
        "Portuguese(Brazil)",
        "Portuguese(Moçambique preAO)",
        "Portuguese(Portugal)",
        "Romanian",
        "Russian",
        "Simple German",
        "Slovak",
        "Slovenian",
        "Spanish",
        "Spanish(voseo)",
        "Swedish",
        "Tagalog",
        "Tamil",
        "Ukrainian"]

    for idx in range(len(names)):
        java = 'case "' + method[idx] + '": langTool = new JLanguageTool(new ' + method[idx] + ' ()); break;'
        print(java)
