# pagina
The amazing web page analyser and patcher, for free from Little Forest

## Sections
* <a href="#Spelling">Spelling</a>
* <a href="#Accessibility">Accessibility</a>
* <a href="#Cookies">Cookies</a>
* <a href="#Technologies">Technologies</a>
* <a href="#Images">Images</a>
* <a href="#Subdomains">Subdomains</a>
* <a href="#Lighthouse">Lighthouse</a>
* <a href="#Links">Links</a>

## Live
Params:
  * URL
  * Language Code [optional]
```
https://127.0.0.1/InspectorWS/Inspector?url=https://example.com
```

## Spelling
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

## Subdomains
Params:
  * URL
```
https://127.0.0.1/InspectorWS/DomainDiscovery?url=https://littleforest.co.uk
```
```
let domainsJSON = await $.post("https://127.0.0.1/InspectorWS/DomainDiscovery", {
    url: siteUrl,
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
