# -*- coding: utf-8 -*-
# !/usr/bin/python3

import cv2
import numpy as np
import urllib.request

# load image
imgUrl = "https://littleforest.co.uk/wp-content/uploads/2021/03/azets_logo.png"
#imgUrl = "https://littleforest.co.uk/wp-content/uploads/2021/04/accessibility_logo.png"

imgContent = urllib.request.urlopen(imgUrl).read()
img = cv2.imdecode(np.asarray(bytearray(imgContent), dtype=np.uint8), -1)

# convert to gray
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# threshold image
thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

# apply morphology to clean up small white or black regions
kernel = np.ones((5,5), np.uint8)
morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
morph = cv2.morphologyEx(morph, cv2.MORPH_OPEN, kernel)

# thin region to remove excess black border
kernel = np.ones((3,3), np.uint8)
morph = cv2.morphologyEx(morph, cv2.MORPH_ERODE, kernel)

# find contours
cntrs = cv2.findContours(morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cntrs = cntrs[0] if len(cntrs) == 2 else cntrs[1]

# Contour filtering -- keep largest, vertically oriented object (h/w > 1)
area_thresh = 0
for c in cntrs:
    area = cv2.contourArea(c)
    x,y,w,h = cv2.boundingRect(c)
    aspect = h / w
    if area > area_thresh and aspect > 1:
        big_contour = c
        area_thresh = area

try:
    # extract region of text contour from image
    x,y,w,h = cv2.boundingRect(big_contour)
    text = img[y:y+h, x:x+w]

    # extract region from thresholded image
    binary_text = thresh[y:y+h, x:x+w]  

    # write result to disk
    cv2.imwrite("/home/user/images/rock_thresh.jpg", thresh)
    cv2.imwrite("/home/user/images/rock_morph.jpg", morph)
    cv2.imwrite("/home/user/images/rock_text.jpg", text)
    cv2.imwrite("/home/user/images/rock_binary_text.jpg", binary_text)
except NameError:
    print("No text")
