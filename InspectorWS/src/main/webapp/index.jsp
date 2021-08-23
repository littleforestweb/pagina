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

    <%--    Favicon --%>
    <link rel="icon" href="images/lf_logo-100x100.png" sizes="32x32"/>
    <link rel="icon" href="images/lf_logo.png" sizes="192x192"/>
    <link rel="apple-touch-icon" href="images/lf_logo.png"/>
    <meta name="msapplication-TileImage" content="images/lf_logo.png"/>

    <%--    Font-Awesome --%>
    <script src="https://kit.fontawesome.com/a88e1b9070.js" crossorigin="anonymous"></script>

    <%--    jQuery --%>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <%--  Datatables  --%>
    <script src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.25/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.7.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.7.1/js/buttons.html5.min.js"></script>
    <link href="https://cdn.datatables.net/1.10.25/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/buttons/1.7.1/css/buttons.dataTables.min.css" rel="stylesheet">

    <%--  Bootstrap  --%>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

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

<%-- OVERLAY --%>
<div id="overlay">
    <div id="overlay_text">
        <span id="overlayMessage"></span>
        <span id="overlaySndMessage"></span>
        <span id="overlayProgress"></span>
        Please Wait</br>
        <div class="spinner-border"></div>
    </div>
</div>
<%-- END OVERLAY --%>

<%-- ERROR MODAL --%>
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="modalErrorTitle"></h5>
            </div>

            <div class="modal-body" id="modalErrorBody"></div>
        </div>
    </div>
</div>
<%-- END ERROR MODAL--%>

<%-- SPELLING MODAL --%>
<div class="modal fade bd-example-modal-xl" id="dictionary-modal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Spelling Overview</h5>
                <button type="button" class="btn active" onclick="rerunSpelling('')">Re-run Spelling</button>
                <div class="btn-group me-2 d-flex justify-content-center" role="group">
                    <button type="button" class="btn active" id="errorsTableViewBtn" onclick="toggleSpellView('errorsTableDiv')">Errors Found</button>
                    <button type="button" class="btn" id="dictionaryTableViewBtn" onclick="toggleSpellView('dictionaryTableDiv')">Dictionary</button>
                </div>
            </div>

            <div class="modal-body">
                <div id="errorsTableDiv">
                    <table id="errorsTable" class="table table-striped">
                        <thead>
                        <tr>
                            <th>Error</th>
                            <th>Replacements</th>
                            <th>Message</th>
                            <th>Occurrences</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th>Error</th>
                            <th>Replacements</th>
                            <th>Message</th>
                            <th>Occurrences</th>
                            <th>Action</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div hidden id="dictionaryTableDiv">
                    <table id="dictionaryTable" class="table table-striped spellingTable">
                        <thead>
                        <tr>
                            <th>Error</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th>Error</th>
                            <th>Action</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>
<%-- END SPELLING MODAL--%>

<%-- lINKS MODAL --%>
<div class="modal fade bd-example-modal-xl" id="linksModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Links Overview</h5>
            </div>

            <div class="modal-body">
                <table id="linksTable" class="table table-striped">
                    <thead>
                    <tr>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Origin</th>
                    </tr>
                    </thead>
                    <tbody id="linksTableBody"></tbody>
                    <tfoot>
                    <tr>
                        <th>URL</th>
                        <th>Status</th>
                        <th>Origin</th>
                    </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    </div>
</div>
<%-- END lINKS MODAL--%>

<%-- ACCESSIBILITY MODAL --%>
<div class="modal fade bd-example-modal-xl" id="accessibilityModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Accessibility Overview<span id="modal-accessibility-title"></span></h5>
                <div class="btn-group me-2 d-flex justify-content-center" role="group">
                    <button type="button" class="btn active" id="snifferErrorsTableViewBtn" onclick="toggleAccessibilityView('snifferErrorsTableDiv')">Errors</button>
                    <button type="button" class="btn" id="snifferNoticesTableViewBtn" onclick="toggleAccessibilityView('snifferNoticesTableDiv')">Notices</button>
                    <button type="button" class="btn" id="snifferWarningsTableViewBtn" onclick="toggleAccessibilityView('snifferWarningsTableDiv')">Warnings</button>
                </div>
            </div>

            <div class="modal-body">
                <div id="snifferErrorsTableDiv">
                    <table id="snifferErrorsTable" class="table table-striped">
                        <thead>
                        <tr>
                            <th>Guideline</th>
                            <th>Message</th>
                            <th>Tag</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th>Guideline</th>
                            <th>Message</th>
                            <th>Tag</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div hidden id="snifferNoticesTableDiv">
                    <table id="snifferNoticesTable" class="table table-striped">
                        <thead>
                        <tr>
                            <th>Guideline</th>
                            <th>Message</th>
                            <th>Tag</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th>Guideline</th>
                            <th>Message</th>
                            <th>Tag</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div hidden id="snifferWarningsTableDiv">
                    <table id="snifferWarningsTable" class="table table-striped">
                        <thead>
                        <tr>
                            <th>Guideline</th>
                            <th>Message</th>
                            <th>Tag</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th>Guideline</th>
                            <th>Message</th>
                            <th>Tag</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<%-- END ACCESSIBILITY MODAL--%>

<%-- COOKIES MODAL --%>
<div class="modal fade bd-example-modal-xl" id="cookiesModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Cookies Overview</h5>
            </div>

            <div class="modal-body">
                <div id="cookiesTableDiv">
                    <table id="cookiesTable" class="table table-striped">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain</th>
                            <th>Expires</th>
                            <th>Http Only</th>
                            <th>Secure</th>
                            <th>Source Port</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th>Name</th>
                            <th>Domain</th>
                            <th>Expires</th>
                            <th>Http Only</th>
                            <th>Secure</th>
                            <th>Source Port</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<%-- END COOKIES MODAL--%>

<%-- TECHNOLOGIES MODAL --%>
<div class="modal fade bd-example-modal-xl" id="technologiesModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Technologies Overview</h5>
            </div>

            <div class="modal-body">
                <div id="technologiesTableDiv">
                    <table id="technologiesTable" class="table table-striped">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Website</th>
                            <th>Categories</th>
                            <th>Confidence</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Website</th>
                            <th>Categories</th>
                            <th>Confidence</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<%-- END TECHNOLOGIES MODAL--%>

<%-- TOPNAV --%>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="d-flex me-auto">
                <input id="searchURL" class="form-control col-md-6 me-2" type="search" placeholder="Check URL" aria-label="Search">
                <button type="button" id="loadBtn" onclick="gotoNewPage()" class="btn active col-md-3  me-2">Go</button>
                <button type="button" onclick="resetPage()" class="btn active col-md-3  me-2">Clear</button>
                <button type="button" id="goBtn" hidden onclick="setIframe()" class="btn col-md-3  me-2">setIframe</button>
            </div>
            <div class="btn-group me-2" role="group">
                <button type="button" id="desktopView" onclick="toggleView('Desktop')" class="active btn">Desktop</button>
                <button type="button" id="mobileView" onclick="toggleView('Mobile')" class="btn">Mobile</button>
                <button type="button" id="HTMLBtn" onclick="toggleView('HTML')" class="btn">Code</button>
                <button hidden type="button" id="LighthouseViewBtn" onclick="toggleView('lighthouseReport')" class="btn">Lighthouse</button>
            </div>
        </div>
    </div>
</nav>
<%-- END TOPNAV- -%>

<%-- SIDEBAR --%>
<div class="sidebar-nav bg-light">

    <%--    LOGO--%>
    <a href="https://littleforest.co.uk" target="_blank"><img class="sidebar-logo" alt="sidebar Logo" src="images/littleforest_logo.png"></a>

    <%--    SPELLING--%>
    <ul class="sidebar-list">
        <li><b><a href="#" onclick="toggleSidebar('spelling')">SPELLING REPORT <i class="arrow down"></i></a></b></li>
        <div id="spelling-main">
            <label>Language <span id="detectedLanguage"></span></label>
            <select class="form-select" id="languages-list">
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
                <option value=en-GB>English (GB)</option>
                <option value=en-AU>English (Australian)</option>
                <option value=en-CA>English (Canadian)</option>
                <option value=en-NZ>English (New Zealand)</option>
                <option value=en-ZA>English (South African)</option>
                <option value=en-US>English (US)</option>
                <option value=eo>Esperanto</option>
                <option value=fr>French</option>
                <option value=gl-ES>Galician</option>
                <option value=de-DE>German (Germany)</option>
                <option value=de-AT>German (Austria)</option>
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
                <option value=pt-PT>Portuguese (Portugal)</option>
                <option value=pt-AO>Portuguese (Angola preAO)</option>
                <option value=pt-BR>Portuguese (Brazil)</option>
                <option value=pt-MZ>Portuguese (Moçambique preAO)</option>
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
            <button type="button" id="spelling-btn" onclick="runLanguageTool()" class="btn active mt-2">Run Spelling Report</button>

            <div hidden id="spelling-info" class="mt-2">
                <p id="spelling-total-p">Found <span id="spelling-total-errors">0</span> occurrence(s).</p>
                <ul id="spelling-errors"></ul>
                <button type="button" id="dict-modal-btn" class="btn active" data-bs-toggle="modal" data-bs-target="#dictionary-modal">View Overview</button>
            </div>

        </div>
    </ul>

    <%--    LIGHTHOUSE--%>
    <ul class="sidebar-list">
        <li><b><a href="#" onclick="toggleSidebar('lighthouse')">LIGHTHOUSE REPORT<i class="arrow down"></i></a></b></li>
        <div id="lighthouse-main">
            <button type="button" id="lighthouse-btn" class="btn active" onclick="runLighthouse()">Run Lighthouse Report</button>

            <div id="lighthouse-info" hidden>
                <ul id="lighthouse-categories"></ul>
            </div>
        </div>
    </ul>

    <%--    LINKS--%>
    <ul class="sidebar-list">
        <li><b><a href="#" onclick="toggleSidebar('links')">LINKS REPORT<i class="arrow down"></i></a></b></li>
        <div id="links-main">
            <button type="button" id="links-btn" class="btn active" onclick="runLinks()">Run Links Report</button>

            <div id="links-info" hidden>
                <p>Found <span id="links-total">0</span> link(s) (<span id="links-ext">0</span> external and <span id="links-int">0</span> internal).</p>
                <p id="links-broken-p" hidden>Found <span id="links-broken">0</span> broken links(s).</p>
            </div>
            <button hidden type="button" id="links-modal-btn" class="btn active mt-2" data-bs-toggle="modal" data-bs-target="#linksModal">View Overview</button>
        </div>
    </ul>

    <%--    ACCESSIBILITY--%>
    <ul class="sidebar-list">
        <li><b><a href="#" onclick="toggleSidebar('accessibility')">ACCESSIBILITY REPORT<i class="arrow down"></i></a></b></li>
        <div id="accessibility-main">
            <label id="wcag-level-label">WCAG Level</label>
            <select class="form-select" id="WCAG-level-list">
                <option value=WCAG2A>WCAG2A</option>
                <option selected value=WCAG2AA>WCAG2AA</option>
                <option value=WCAG2AAA>WCAG2AAA</option>
            </select>
            <button type="button" id="accessibility-btn" class="btn active mt-2 mb-2" onclick="runAccessibility()">Run Accessibility Report</button>

            <div hidden id="accessibility-info" class="mt-2">
                <p>Found <span id="accessibility-Errors">0</span> Error(s)</p>
                <p>Found <span id="accessibility-Notices">0</span> Notice(s)</p>
                <p>Found <span id="accessibility-Warnings">0</span> Warning(s)</p>
            </div>
            <button hidden type="button" id="accessibility-modal-btn" class="btn active" data-bs-toggle="modal" data-bs-target="#accessibilityModal">View Overview</button>
        </div>
    </ul>

    <%--    COOKIES--%>
    <ul class="sidebar-list">
        <li><b><a href="#" onclick="toggleSidebar('cookies')">COOKIES REPORT<i class="arrow down"></i></a></b></li>
        <div id="cookies-main">
            <button type="button" id="cookies-btn" class="btn active" onclick="runCookies()">Run Cookies Report</button>

            <div id="cookies-info" hidden>
                <p>Found <span id="cookies-total">0</span> cookie(s)</p>
            </div>
            <button hidden type="button" id="cookies-modal-btn" class="btn active mt-2" data-bs-toggle="modal" data-bs-target="#cookiesModal">View Overview</button>
        </div>
    </ul>

    <%--    TECHNOLOGIES--%>
    <ul class="sidebar-list">
        <li><b><a href="#" onclick="toggleSidebar('technologies')">TECHNOLOGIES REPORT<i class="arrow down"></i></a></b></li>
        <div id="technologies-main">
            <button type="button" id="technologies-btn" class="btn active" onclick="runTechnologies()">Run Technologies Report</button>

            <div id="technologies-info" hidden>
                <p>Found <span id="technologies-total">0</span> Technologies</p>
            </div>
            <button hidden type="button" id="technologies-modal-btn" class="btn active mt-2" data-bs-toggle="modal" data-bs-target="#technologiesModal">View Overview</button>
        </div>
    </ul>

    <%--    BOTTOM LINE--%>
    <ul class="sidebar-list"></ul>

    <%--    COPYRIGHT--%>
    <div class="copyright">
        <a target="_blank" href="https://littleforest.co.uk/"><img src="images/lf_logo.png" class="sidebar-footer-icon" alt="littleforest logo"></a>
        <a target="_blank" href="https://www.linkedin.com/company/little-forest/"><img data-pin-nopin="true" alt="LinkedIn" title="LinkedIn" src="images/thin_linkedin.png" width="40" height="40" style="" class="sidebar-footer-icon" data-effect=""></a>
        <a target="_blank" href="https://twitter.com/thelittleforest"><img data-pin-nopin="true" alt="Twitter" title="Twitter" src="images/thin_twitter.png" width="40" height="40" style="" class="sidebar-footer-icon" data-effect=""></a>
        </br></br>Created by <a class="copyright-link" target="_blank" href="https://github.com/littleforestweb/pagina">Little Forest</a></br>Powered by: <a class="copyright-link" target="_blank" href="https://languagetool.org/">LanguageTool</a> |
        <a class="copyright-link" target="_blank" href="https://developers.google.com/web/tools/lighthouse/">Lighthouse</a> |
        <a class="copyright-link" target="_blank" href="https://developers.google.com/web/tools/puppeteer/">Puppeteer</a> |
        <a class="copyright-link" target="_blank" href="https://squizlabs.github.io/HTML_CodeSniffer/">HTML CodeSniffer</a> |
        <a class="copyright-link" target="_blank" href="https://www.wappalyzer.com/">Wappalyzer</a>
        <p> © Little Forest 2021</br>All rights reserved - <a class="copyright-link" target="_blank" href="https://littleforest.co.uk/privacy-policy/">Privacy Policy</a></p>
    </div>

</div>
<%-- END SIDEBAR --%>

<%-- MAIN CONTENT --%>
<% if (!(mainURL.equals("null"))) {%>
<main class="main">
    <%--    MAIN CONTENT--%>
    <iframe is="x-frame-bypass" id="mainContent"></iframe>
    <%--    END MAIN CONTENT--%>

    <%--    CODE--%>
    <iframe hidden id="mainCode" src="about:blank"></iframe>
    <%--    END CODE--%>

    <%--    LIGHTHOUSE REPORT--%>
    <iframe hidden id="mainLighthouse"></iframe>
    <%--    END LIGHTHOUSE --%>
</main>
<% }%>
<%-- END LOAD PAGE --%>

<%-- SCRIPTS --%>
<script src="js/findAndReplaceDOMText.js"></script>
<script src="js/syntaxHighlighter.js"></script>
<script src="js/main.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
<%-- END SCRIPTS --%>

<%-- LOAD PAGE  --%>
<script>
    // If a URL Param is present auto run
    <% if (!(mainURL.equals("null"))) {%>

    // Redirect
    <% if (!(mainURL.equals(url))) {%>
    setErrorModal("Redirect found", "<b><%=url%></b> was redirected to <b><%=mainURL%></b>");
    <% }%>

    // Set URL on search bar
    document.getElementById("searchURL").value = "<%=mainURL%>";

    // Set Language on Languages Dropdown list
    <% if (!(mainLang.equals("null"))) {%>
    console.log("<%=mainLang%>");
    document.getElementById("languages-list").value = "<%=mainLang%>";
    <% }%>

    // Start Running Reports
    document.getElementById("goBtn").click();

    <% } else { %>

    // Disable Actions
    enableDisableActions("disable");

    // Enable searchURL
    document.getElementById("searchURL").disabled = false;
    document.getElementById("languages-list").disabled = false;
    document.getElementById("dict-modal-btn").disabled = false;

    // Check if url is Null
    <% if (!(url.equals("null"))) {%>
    setErrorModal("", "Failed to load <b><%=url%></b></br>Please check the URL.");
    <% } %>

    <% } %>
</script>
<%-- END LOAD PAGE  --%>

</body>
</html>
