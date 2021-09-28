# -*- coding: utf-8 -*-
# !/usr/bin/python3

# python3 -m pip install Pillow requests bs4 --no-cache-dir

import json
import os
import requests
import sys
from PIL import Image
from bs4 import BeautifulSoup as bs
from io import BytesIO
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from urllib.parse import urljoin, urlparse

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


def is_valid(url):
    # Checks whether url is a valid URL.
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)


def get_all_images(url):
    # Get URL content // Ignore SSL Certificate Warnings
    soup = bs(requests.get(url, verify=False).content, "html.parser")
    jsonArr = []

    # Iterate over every img tag
    for img in soup.find_all("img"):

        # Get src attribute
        img_url = img.attrs.get("src")

        # Alt text attribute
        img_alt = img.attrs.get("alt")
        img_alt = "None" if img_alt is None else img_alt

        # Filename 
        filename = os.path.basename(urlparse(img_url).path)

        # If img does not contain src attribute, just skip
        if not img_url:
            continue

        # Make the URL absolute by joining domain with the URL that is just extracted
        img_url = urljoin(url, img_url)

        # Remove URLs like '/hsts-pixel.gif?c=3.2.5'
        try:
            pos = img_url.index("?")
            img_url = img_url[:pos]
        except ValueError:
            pass

        # Finally, if the url is valid
        if is_valid(img_url):

            # Status Code
            try:
                r = requests.head(img_url)
                statuscode = str(r.status_code)
            except requests.ConnectionError:
                statuscode = "999"

            try:
                # Downlaod imgUrl to img
                img = Image.open(BytesIO(requests.get(img_url).content))

                # Dimensions
                dimensions = str(img.size[0]) + "x" + str(img.size[1])

                # Format
                format = str(img.format)

                # Size
                size = str(round(sys.getsizeof(img.tobytes()) / 1024, 1))
            except:
                dimensions = "None"
                format = "None"
                size = "None"

                if img_url[len(img_url) - 3:len(img_url)] == "svg":
                    format = "SVG"

        # Add to jsonArray
        dict = {"url": img_url, "dimensions": dimensions, "format": format, "alt": img_alt, "size": size, "filename": filename, "statuscode": statuscode}
        jsonArr.append(dict)

    return json.dumps({"images": jsonArr}, indent=4)


def main(siteUrl, jsonPath):
    # print(siteUrl)
    # print(jsonPath)

    # Check if siteUrl is valid
    if is_valid(siteUrl) == False:
        return

    # Get IMG Info
    jsonStr = str(get_all_images(siteUrl))
    # print(jsonStr)

    # Save JSON to File
    with open(jsonPath, 'w') as jsonFile:
        jsonFile.write(jsonStr)
    jsonFile.close()


if __name__ == '__main__':
    if 2 <= len(sys.argv) <= 4:
        siteUrl = sys.argv[1].split("=")[1]
        jsonPath = sys.argv[2].split("=")[1]
        main(siteUrl, jsonPath)
    else:
        print("Wrong Args")

    # siteUrl = "https://inspector.littleforest.co.uk/DevWS/test.html"
    # # siteUrl = "https://littleforest.co.uk/"
    # jsonPath = "jsonPath.json"
    # main(siteUrl, jsonPath)
