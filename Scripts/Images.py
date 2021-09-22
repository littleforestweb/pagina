# -*- coding: utf-8 -*-
# !/usr/bin/python3

# python3 -m pip install opencv-python requests bs4 tqdm numpy --no-cache-dir

import os
import cv2
import sys
import imghdr
import requests
import numpy as np
from tqdm import tqdm
import urllib.request
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin, urlparse
import json



def is_valid(url):
    # Checks whether `url` is a valid URL.
    
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)
    
    
def get_all_images(url):
    # Returns all image URLs on a single `url`
    
    # Disable request warnings
    from requests.packages.urllib3.exceptions import InsecureRequestWarning
    requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
    
    # Get URL content // Ignore SSL Certificate Warnings
    soup = bs(requests.get(url, verify=False).content, "html.parser")
    urls = []
    
    # Iterate over every img tag
    for img in tqdm(soup.find_all("img"), disable=True):
        img_url = img.attrs.get("src")
        
        # if img does not contain src attribute, just skip
        if not img_url:
            continue
            
        # make the URL absolute by joining domain with the URL that is just extracted
        img_url = urljoin(url, img_url)
        
        # remove URLs like '/hsts-pixel.gif?c=3.2.5'
        try:
            pos = img_url.index("?")
            img_url = img_url[:pos]
        except ValueError:
            pass
        
        # finally, if the url is valid
        if is_valid(img_url):
            urls.append(img_url)
            
    return urls
    
    
def getDimensions(imgUrls):

    jsonArr = []

    for imgUrl in imgUrls:
    
        # Downlaod imgUrl to img
        imgContent = urllib.request.urlopen(imgUrl).read()
        img = cv2.imdecode(np.asarray(bytearray(imgContent), dtype=np.uint8), -1)
        
        # Try to get img shape
        try:
            w, h, c = img.shape
            w, h, c = str(w), str(h), str(c)
            format = imghdr.what(None, imgContent)
            
        except AttributeError:
            w, h, c, format = "null", "null", "null", "null"
            
        dict = {}
        dict["url"] = imgUrl
        dict["width"] = w
        dict["height"] = h
        dict["channels"] = c
        dict["format"] = format
        jsonArr.append(dict)
        
    return json.dumps({"images": jsonArr}, indent=4)

def main(siteUrl, jsonPath):
    print(siteUrl)
    print(jsonPath)
    print("")
    
    # Check if siteUrl is valid
    if is_valid(siteUrl) == False:
        print("Invalid Url")
        return
        
    # Get all img Urls
    imgUrls = get_all_images(siteUrl)
    
    # Get IMG Info
    jsonStr = str(getDimensions(imgUrls))
    # print(jsonStr)
    
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


    # siteUrl = "https://inspector.littleforest.co.uk/TestWS/test.html"
    # siteUrl = "https://littleforest.co.uk/"
    # jsonPath = "/home/user/images/jsonPath.json"
    # main(siteUrl, jsonPath)