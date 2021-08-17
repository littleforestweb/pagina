<%-- 
Document   : Little Forest - PageInspector
Created on : Jul 7, 2021, 7:13:28 PM
Author     : xhico
--%>

<%@page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <!-- Favicon -->
    <link rel="icon" href="images/lf_logo-100x100.png" sizes="32x32"/>
    <link rel="icon" href="images/lf_logo.png" sizes="192x192"/>
    <link rel="apple-touch-icon" href="images/lf_logo.png"/>
    <meta name="msapplication-TileImage" content="images/lf_logo.png"/>

    <!-- Font-Awesome -->
    <script src="https://kit.fontawesome.com/a88e1b9070.js" crossorigin="anonymous"></script>

    <%--  jQuery  --%>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <%--  Bootstrap  --%>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <%--  X-Frame Bypass  --%>
    <script src="https://unpkg.com/@ungap/custom-elements-builtin"></script>
    <script type="module" src="https://unpkg.com/x-frame-bypass"></script>

    <!-- Custom -->
    <link rel="stylesheet" href="css/styles.css"/>
    <link rel="stylesheet" href="css/iframe.css"/>

    <%-- Google Analytics --%>
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-2666648-2', 'auto');
        ga('send', 'pageview');
    </script>
</head>
<body>
<%
    String url;
    String mainURL;
    String mainLang;
    try {
        url = request.getAttribute("url").toString();
    } catch (Exception ex) {
        url = "null";
    }
    try {
        mainURL = request.getAttribute("mainURL").toString();
    } catch (Exception ex) {
        mainURL = "null";
    }
    try {
        mainLang = request.getAttribute("mainLang").toString();
    } catch (Exception ex) {
        mainLang = "null";
    }
%>

<!-- OVERLAY -->
<div id="overlay">
    <div id="overlay_text">
        <span id="overlayMessage"></span></br>
        <span id="overlaySndMessage"></span>
        <div class="spinner-border"></div>
        <br>Please Wait
    </div>
</div>
<!-- END OVERLAY -->

<%-- ERROR MODAL --%>
<button hidden type="button" id="errorModalBtn" data-bs-toggle="modal" data-bs-target="#errorModal">Error Modal</button>
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalErrorTitle"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="modalErrorBody"></div>
            <div class="modal-footer">
                <button type="button" class="btn active" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<%-- END MODAL--%>

<%-- DICTIONARY MODAL --%>
<div class="modal fade" id="dictionaryModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Manage Dictionary (<span id="totalDictWords">0</span>)</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div id="dictionaryList" class="list-group">
            </div>

            <div class="container input-group mb-3 mt-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Word</span>
                </div>
                <input type="text" class="form-control" id="dictionaryWord">
                <button type="button" class="btn active" onclick="addDictionary('')">Add</button>
            </div>

        </div>
    </div>
</div>
<%-- END MODAL--%>

<!-- TOPNAV -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="d-flex me-auto">
                <input id="searchURL" class="form-control col-md-6 me-2" type="search" placeholder="Check URL"
                       aria-label="Search">
                <button type="button" id="loadBtn" onclick="gotoNewPage()" class="btn active col-md-3  me-2">Go
                </button>
                <button type="button" onclick="resetPage()" class="btn active col-md-3  me-2">Clear
                </button>
                <button type="button" id="goBtn" hidden onclick="setIframe()" class="btn col-md-3  me-2">setIframe
                </button>
            </div>
            <%--            <ul class="navbar-nav mb-2 mb-lg-0">--%>
            <%--                <button type="button" class="btn  me-2">Comment</button>--%>
            <%--                <button type="button" class="btn  me-2">Fix</button>--%>
            <%--                <button type="button" class="btn  me-2">History</button>--%>
            <%--                <button type="button" class="btn  me-2">Crawl</button>--%>
            <%--                <button type="button" class="btn  me-2">Edit</button>--%>
            <%--                <button type="button" class="btn  me-2">Share</button>--%>
            <%--            </ul>--%>
            <div class="btn-group me-2" role="group">
                <button type="button" id="desktopView" onclick="toggleView('Desktop')" class="active btn ">
                    Desktop
                </button>
                <button type="button" id="mobileView" onclick="toggleView('Mobile')" class="btn ">
                    Mobile
                </button>
                <button type="button" id="HTMLBtn" onclick="toggleView('HTML')" class="btn ">
                    Code
                </button>
                <button hidden type="button" id="LighthouseViewBtn" onclick="toggleView('lighthouseReport')"
                        class="btn ">Lighthouse
                </button>
            </div>
        </div>
    </div>
</nav>
<!-- END TOPNAV -->

<!-- SIDEBAR -->
<div class="sidebar-nav bg-light">

    <!-- LOGO -->
    <a href="https://littleforest.co.uk" target="_blank">
        <img class="sidebar-logo" alt="sidebar Logo"
             src="https://littleforest.co.uk/wp-content/uploads/2020/11/littleforest_logo.png">
    </a>

    <%--    SPELLING--%>
    <ul id="spelling-section" class="sidebar-list">
        <li><b><a id="spelling-title" href="#">SPELLING REPORT <i class="arrow down"></i></a></b></li>
        <div id="language-select-div">
            <label>Language <span id="detectedLanguage"></span></label>
            <select class="form-select" id="languages_list">
                <option selected value=auto>Auto-Detect</option>
                <option value=ar>Arabic</option>
                <option value=ast-ES>Asturian</option>
                <option value=be-BY>Belarusian</option>
                <option value=br-FR>Breton</option>
                <option value=ca-ES>Catalan</option>
                <option value=ca-ES-valencia>Catalan (Valencian)</option>
                <option value=zh-CN>Chinese</option>
                <option value=da-DK>Danish</option>
                <option value=nl>Dutch</option>
                <option value=nl-BE>Dutch (Belgium)</option>
                <option value=en-AU>English (Australian)</option>
                <option value=en-CA>English (Canadian)</option>
                <option value=en-GB>English (GB)</option>
                <option value=en-NZ>English (New Zealand)</option>
                <option value=en-ZA>English (South African)</option>
                <option value=en-US>English (US)</option>
                <option value=eo>Esperanto</option>
                <option value=fr>French</option>
                <option value=gl-ES>Galician</option>
                <option value=de-AT>German (Austria)</option>
                <option value=de-DE>German (Germany)</option>
                <option value=de-CH>German (Swiss)</option>
                <option value=el-GR>Greek</option>
                <option value=ga-IE>Irish</option>
                <option value=it>Italian</option>
                <option value=ja-JP>Japanese</option>
                <option value=km-KH>Khmer</option>
                <option value=nb>Norwegian (Bokmål)</option>
                <option value=no>Norwegian (Bokmål)</option>
                <option value=fa>Persian</option>
                <option value=pl-PL>Polish</option>
                <option value=pt-AO>Portuguese (Angola preAO)</option>
                <option value=pt-BR>Portuguese (Brazil)</option>
                <option value=pt-MZ>Portuguese (Moçambique preAO)</option>
                <option value=pt-PT>Portuguese (Portugal)</option>
                <option value=ro-RO>Romanian</option>
                <option value=ru-RU>Russian</option>
                <option value=sk-SK>Slovak</option>
                <option value=sl-SI>Slovenian</option>
                <option value=es>Spanish</option>
                <option value=es-AR>Spanish (voseo)</option>
                <option value=sv>Swedish</option>
                <option value=tl-PH>Tagalog</option>
                <option value=ta-IN>Tamil</option>
                <option value=uk-UA>Ukrainian</option>
            </select>

            <button type="button" hidden id="rerunSpelling" onclick="clearSpelling(); runLanguageTool()"
                    class="btn active mt-2">Re-Run
            </button>
        </div>
        <div id="spelling-div" hidden>
            <li id="spelling-li">
                <p id="spellErrors-p">Found <span id="totalErrors">0</span> occurrences.</p>
                <ul id="spelling_errors"></ul>
            </li>
        </div>
        <button type="button" id="dictionaryModalBtn" class="btn active  mt-2"
                data-bs-toggle="modal"
                data-bs-target="#dictionaryModal">Manage Dictionary
        </button>
    </ul>

    <%--    LINKS--%>
    <%--    <ul id="links-section" class="sidebar-list">--%>
    <%--        <li><b><a id="links-title" href="#">LINKS REPORT<i class="arrow down"></i></a></b></li>--%>
    <%--        <div id="links-div" hidden>--%>
    <%--            <li id="links-li">--%>
    <%--                <p>Found <span id="totalLinks">0</span> link(s) (<span id="extLinks">0</span> external and <span--%>
    <%--                        id="intLinks">0</span> internal).--%>
    <%--                </p>--%>
    <%--                <p id="brokenLinks-p" hidden>Found <span id="brokenLinks">0</span> broken links(s).</p>--%>
    <%--            </li>--%>
    <%--        </div>--%>
    <%--    </ul>--%>

    <%--    ACCESSIBILITY--%>
    <%--    <ul id="accessibility-section" class="sidebar-list">--%>
    <%--        <li><b><a id="accessibility-title" href="#">ACCESSIBILITY REPORT <i class="arrow down"></i></a></b></li>--%>
    <%--        <div id="accessibility-div" hidden>--%>
    <%--            <li id="accessibility-li">--%>
    <%--            </li>--%>
    <%--        </div>--%>
    <%--    </ul>--%>

    <%--    CONTENT--%>
    <%--    <ul id="content-section" class="sidebar-list">--%>
    <%--        <li><b><a id="content-title" href="#">CONTENT REPORT<i class="arrow down"></i></a></b></li>--%>
    <%--        <div id="content-keyword-div">--%>
    <%--            <label>Keyword</label>--%>
    <%--            <input class="form-control" placeholder="Not done">--%>
    <%--            <br>--%>
    <%--        </div>--%>
    <%--        <button type="button" id="content-btn" class="btn " onclick="addContentInfo()">Run Content--%>
    <%--            Report--%>
    <%--        </button>--%>
    <%--        <div id="content-div" hidden>--%>
    <%--            <li id="content-li">--%>
    <%--                <p>Found <span id="totalImages">0</span> image(s)</p>--%>
    <%--            </li>--%>
    <%--        </div>--%>
    <%--    </ul>--%>

    <%--    LIGHTHOUSE--%>
    <ul id="lighthouse-section" class="sidebar-list">
        <li><b><a id="lighthouse-title" href="#">LIGHTHOUSE REPORT<i class="arrow down"></i></a></b></li>
        <button type="button" id="lighthouse-btn" class="btn active " onclick="runLighthouse()">
            Run Lighthouse Report
        </button>
        <div id="lighthouse-div" hidden>
            <li id="lighthouse-li">
                <ul id="lighthouse_info"></ul>
            </li>
        </div>
    </ul>

    <%--    TECHNOLOGIES--%>
    <%--    <ul id="technologies-section" class="sidebar-list">--%>
    <%--        <li><b><a id="technologies-title" href="#">TECHNOLOGIES REPORT <i class="arrow down"></i></a></b></li>--%>
    <%--        <button type="button" id="technologies-btn" class="btn " onclick="runTechnologies()">Run--%>
    <%--            Technologies Report--%>
    <%--        </button>--%>
    <%--        <div id="technologies-div" hidden>--%>
    <%--            <li id="technologies-li">--%>
    <%--                <ul id="technologies_info"></ul>--%>
    <%--            </li>--%>
    <%--        </div>--%>
    <%--    </ul>--%>

    <%--    COOKIES--%>
    <%--    <ul id="cookies-section" class="sidebar-list">--%>
    <%--        <li><b><a id="cookies-title" href="#">COOKIES REPORT <i class="arrow down"></i></a></b></li>--%>
    <%--        <button type="button" id="cookies-btn" class="btn " onclick="runCookies()">Run Cookies Report--%>
    <%--        </button>--%>
    <%--        <div id="cookies-div" hidden>--%>
    <%--            <li id="cookies-li">--%>
    <%--                <ul id="cookies_info"></ul>--%>
    <%--            </li>--%>
    <%--        </div>--%>
    <%--    </ul>--%>

</div>
<!-- END SIDEBAR -->

<% if (!(mainURL.equals("null"))) {%>
<main class="main">
    <!-- IFRAME -->
    <iframe is="x-frame-bypass" sandbox="allow-same-origin allow-scripts" id="mainContent"></iframe>
    <!-- END IFRAME -->

    <!-- CODE -->
    <iframe hidden sandbox="allow-same-origin allow-scripts" id="mainCode" src="about:blank"></iframe>
    <!-- END CODE -->

    <!-- LIGHTHOUSE REPORT -->
    <iframe hidden sandbox="allow-same-origin allow-scripts" id="mainLighthouse"></iframe>
    <!-- LIGHTHOUSE REPORT -->
</main>
<% }%>

<!-- SCRIPTS -->
<script src="js/findAndReplaceDOMText.js"></script>
<script src="js/syntaxHighlighter.js"></script>
<script src="js/scripts.js"></script>
<script src="js/main.js"></script>

<script>
    // If a URL Param is present auto run
    <% if (!(mainURL.equals("null"))) {%>

    // Redirect
    <% if (!(mainURL.equals(url))) {%>
    setErrorModal("Redirect found", "<b><%=url%></b><br>was redirected to<br><b><%=mainURL%></b>");
    <% }%>

    // Set URL on search bar
    document.getElementById("searchURL").value = "<%=mainURL%>";

    // Set Language on Languages Dropdown list
    <% if (!(mainLang.equals("null"))) {%>
    console.log("<%=mainLang%>");
    document.getElementById("languages_list").value = "<%=mainLang%>";
    <% }%>

    // Start Running Reports
    document.getElementById("goBtn").click();

    <% } else { %>

    // Disable Actions
    enableDisableActions("disable");

    // Enable searchURL
    document.getElementById("searchURL").disabled = false;

    // Check if url is Null
    <% if (!(url.equals("null"))) {%>
    setErrorModal("", "Failed to load <b><%=url%></b></br>Please check the URL.");
    <% } %>

    <% } %>
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
</body>
</html>
