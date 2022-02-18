# pagina
The amazing web page analyser and patcher, for free from Little Forest

## Sections
* <a href="#LanguageTool">LanguageTool</a>
* <a href="#Lighthouse">Lighthouse</a>
* <a href="#Links">Links</a>
* <a href="#Accessibility">Accessibility</a>
* <a href="#Cookies">Cookies</a>
* <a href="#Technologies">Technologies</a>
* <a href="#Images">Images</a>
* <a href="#token">Token</a>

## Live
Params:
  * URL
  * Language Code [optional]
```
https://127.0.0.1/InspectorWS/Inspector?url=https://example.com&content=text_to_analize&langCode=en-gb
```

## LanguageTool
Params:
  * URL
  * Content
  * Language Code (langCode)
```
https://127.0.0.1/InspectorWS/LanguageTool?url=https://example.com&content=text_to_analize&langCode=en-gb
```
```
let spellCheckJSON = await $.post("https://127.0.0.1/InspectorWS/LanguageTool", {
    content: spellTagsElem,
    langCode: langCode,
    url: siteUrl
}, function (result) {
    return result;
});
```

## Lighthouse
Params:
  * URL,
  * Device
    * desktop
    * mobile
```
https://127.0.0.1/InspectorWS/Lighthouse?url=https://littleforest.co.uk&device=desktop
```
```
let lighthouseJson = await $.post("https://127.0.0.1/InspectorWS/Lighthouse", {
    url: siteUrl, device: device
}, function (result) {
    return result;
});
```

## Links
Params:
  * URL
```
https://127.0.0.1/InspectorWS/Links?url=https://littleforest.co.uk
```
```
let linkJSON = await $.post("https://127.0.0.1/InspectorWS/Links", {
    url: siteUrl,
}, function (result) {
    return result;
});
```

## Accessibility
Params:
  * URL
  * WCAG Level
    * WCAG2A
    * WCAG2AA
    * WCAG2AAA
```
https://127.0.0.1/InspectorWS/Accessibility?url=https://littleforest.co.uk&level=WCAG2AA
```
```
let accessibilityJSON = await $.post("https://127.0.0.1/InspectorWS/Accessibility", {
    url: siteUrl, level: WCAGLevel
}, function (result) {
    return result;
});
```

## Cookies
Params
  * URL
```
https://127.0.0.1/InspectorWS/Cookies?url=https://littleforest.co.uk
```
```
let cookiesJSON = await $.post("https://127.0.0.1/InspectorWS/Cookies", {
    url: siteUrl,
}, function (result) {
    return result;
});
```

## Technologies
Params:
  * URL
```
https://127.0.0.1/InspectorWS/Wappalyzer?url=https://littleforest.co.uk
```
```
let wappalyzerJSON = await $.post("https://127.0.0.1/InspectorWS/Wappalyzer", {
    url: siteUrl,
}, function (result) {
    return result;
});
```

## Images
Params:
  * URL
```
https://127.0.0.1/InspectorWS/Images?url=https://littleforest.co.uk
```
```
let imagesJSON = await $.post("https://127.0.0.1/InspectorWS/Images", {
    url: siteUrl,
}, function (result) {
    return result;
});
```

## Token [In development]
Params:
  * accountId
  * loginUrl
  * username
  * usernameSelector
  * password
  * passwordSelector
  * submitBtn
```
https://127.0.0.1/InspectorWS/GetToken?accountId=123&loginUrl=https://example.com/&username=xhico&usernameSelector=user_login&password=xhico123&passwordSelector=user_pass&submitBtn=submitBtn
```
```
let tokenURL = "https://127.0.0.1/InspectorWS/GetToken";
let accountId = "123";
let loginUrl = "https://example.com/";
let username = "xhico";
let usernameSelector = "#user_login";
let password = "xhico123";
let passwordSelector = "#user_pass";
let submitBtn = "#submitBtn";

let tokenJSON = await $.post(tokenURL, {
	accountId: accountId,
	loginUrl: loginUrl,
	username: username,
	usernameSelector: usernameSelector,
	password: password,
	passwordSelector: passwordSelector,
	submitBtn: submitBtn
}, function (result) {
	return result;
});
```
