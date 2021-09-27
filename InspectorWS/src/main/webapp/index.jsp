<%--
Created on : 23 Jul 2021, 10:38:17
Author : xhico
--%>


<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="author" content="Francisco 'xhico' Filipe @ Little Forest UK"/>
    <title>Page Inspector - Little Forest</title>

    <%--    Favicon --%>
    <link rel="icon" href="images/lf_logo-100x100.png" sizes="32x32"/>
    <link rel="icon" href="images/lf_logo.png" sizes="192x192"/>
    <link rel="apple-touch-icon" href="images/lf_logo.png"/>
    <meta name="msapplication-TileImage" content="images/lf_logo.png"/>

    <%--  Bootstrap  --%>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

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

    <%--    Custom  --%>
    <link href="css/styles.css" rel="stylesheet"/>
</head>

<body class="lf-nav-fixed">

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

<%-- USERNAME MODAL --%>
<div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalUserTitle">Hello!</h5>
            </div>
            <div class="modal-body" id="modalUserBody">
                <p>Looks like it's your first time using the Little Forest Page Inspector.</br>Please insert your
                    username.</p>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">@</span>
                    </div>
                    <input id="userModalInput" type="text" class="form-control" placeholder="Username"
                           aria-label="Username" aria-describedby="basic-addon1">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" onclick="setUsername()" class="btn active">Save changes</button>
            </div>
        </div>
    </div>
</div>

<%-- LIGHTHOUSE MODAL --%>
<div class="modal fade" id="lighthouseModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLighthouseTitle">Lighthouse Report</h5>
            </div>
            <div class="modal-body" id="modalLighthouseBody">
                <p>Are you sure you want to run the Lighthouse report?
                    </br>This could take a few moments.
                    </br>Feel free to navigate the other reports.</p>
            </div>
            <div class="modal-footer">
                <button type="button" onclick="runLighthouse()" class="btn active">Proceed</button>
            </div>
        </div>
    </div>
</div>

<%-- LINKS MODAL --%>
<div class="modal fade" id="linksModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLinksTitle">Links Report</h5>
            </div>
            <div class="modal-body" id="modalLinksBody">
                <p>Are you sure you want to run the Links report?
                    </br>This could take a few moments.
                    </br>Feel free to navigate the other reports.</p>
            </div>
            <div class="modal-footer">
                <button type="button" onclick="runLinks()" class="btn active">Proceed</button>
            </div>
        </div>
    </div>
</div>

<%-- NOTIFICATIONS --%>
<div class=" toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <%-- LIGHTHOUSE NOTIFICATION --%>
    <div id="lighthouseNotification" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong id="lighthouseNotificationTitle" class="me-auto"></strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div id="lighthouseNotificationBtn" class="toast-body">
            <button class="btn active" type="button" onclick="toggleView('lighthouse')">View</button>
        </div>
    </div>

    <%-- LINKS NOTIFICATION --%>
    <div id="linksNotification" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong id="linksNotificationTitle" class="me-auto">Your Links Report is ready.</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div id="linksNotificationBtn" class="toast-body">
            <button class="btn active" type="button" onclick="toggleView('links')">View</button>
        </div>
    </div>
</div>

<%-- NAV --%>
<nav class="lf-topnav navbar navbar-expand navbar-light bg-light shadow">
    <!-- Navbar Brand-->
    <a class="navbar-brand text-center" href="https://littleforest.co.uk" target="_blank"><img height="32" src="images/littleforest_logo.png"></a>
    <!-- Sidebar Toggle-->
    <button class="btn active btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle">
        <i class="fas fa-bars"></i></button>
    <!-- Navbar Search-->
    <div class="w-75 d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div class="input-group">
            <input class="w-50 form-control" id="searchURL" type="text" placeholder="Insert URL to check..."
                   aria-label="Insert URL to check..." aria-describedby="btnNavbarSearch"/>
            <select class="form-select" id="languages-list">
                <option disabled>Language</option>
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
            <select class="form-select" id="WCAG-level-list">
                <option disabled>Accessibility Level</option>
                <option value=WCAG2A>WCAG2A</option>
                <option selected value=WCAG2AA>WCAG2AA</option>
                <option value=WCAG2AAA>WCAG2AAA</option>
            </select>
            <div class="btn-group me-2" role="group">
                <button hidden></button>
                <button class="btn active" type="button" onclick="gotoNewPage()">
                    <span class="me-2">Inspect</span><i class="fas fa-play"></i></button>
                <button class="btn active" type="button" onclick="resetPage()">
                    <span class="me-2">Clear</span><i class="fas fa-trash"></i></button>
            </div>
            <div class="btn-group me-2" role="group">
                <a hidden href="#" target="_blank" id="editPageBtn" class="btn active" type="button"><span class="me-2">Edit Page</span><i class="fas fa-edit"></i></a>
            </div>
        </div>
    </div>
</nav>

<%-- MAIN BODY --%>
<div id="layoutSidenav">

    <%-- SIDEBAR --%>
    <div id="layoutSidenav_nav">
        <nav class="lf-sidenav accordion lf-sidenav-light shadow" id="sidenavAccordion">
            <div class="lf-sidenav-menu">
                <div class="nav">
                    <div class="lf-sidenav-menu-heading">Views</div>
                    <button id="desktop-btn" onclick="toggleView('desktop')" class="active nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-desktop"></i></span>Desktop
                    </button>
                    <button id="mobile-btn" onclick="toggleView('mobile')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-mobile-alt"></i></span>Mobile
                    </button>
                    <button id="code-btn" onclick="toggleView('code')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-code"></i></span>Code
                    </button>

                    <div class="lf-sidenav-menu-heading">Reports</div>
                    <button id="spelling-btn" onclick="toggleView('spelling')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-spell-check"></i></span>Spelling
                    </button>
                    <button id="accessibility-btn" onclick="toggleView('accessibility')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-universal-access"></i></span>Accessibility
                    </button>
                    <button id="cookies-btn" onclick="toggleView('cookies')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-cookie"></i></span>Cookies
                    </button>
                    <button id="technologies-btn" onclick="toggleView('technologies')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fab fa-bootstrap"></i></span>Technologies
                    </button>
                    <button id="images-btn" onclick="toggleView('images')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-image"></i></span>Images
                    </button>
                    <button id="lighthouse-btn" onclick="toggleView('lighthouse')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-tachometer-alt"></i></span>Lighthouse
                    </button>
                    <button id="links-btn" onclick="toggleView('links')" class="nav-link bg-transparent border-0">
                        <span class="lf-nav-link-icon"><i class="fas fa-link"></i></span>Links
                    </button>
                </div>
            </div>
            <%--            <div class="lf-sidenav-footer">--%>
            <%--                <div class="small">Welcome:</div>--%>
            <%--                <span id="username">user</span>--%>
            <%--            </div>--%>
            <div class="lf-sidenav-footer" style="border-top: 1px solid rgba(0, 0, 0, 0.1)">
                <span class="text-muted">Little Forest 2021</span></br><span
                    class="text-muted">All rights reserved</span></br>
                <a style="color: #166713" href="https://littleforest.co.uk/privacy-policy/" target="_blank">Privacy
                    Policy</a>
            </div>
        </nav>
    </div>

    <%-- MAIN CONTENT --%>
    <div id="layoutSidenav_content">
        <main>
            <%-- OVERLAY --%>
            <div id="overlay">
                <div id="overlay_text">
                    <span id="overlayMessage"></span>
                    <span id="overlaySndMessage"></span>
                    Please Wait</br>
                    <div class="spinner-border text-lfi-green"></div>
                </div>
            </div>

            <%-- PAGE IFRAME --%>
            <div id="mainPageDiv" class="iframe-container">
                <iframe id="mainPage" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"></iframe>
            </div>

            <%-- CODE IFRAME --%>
            <div hidden id="mainCodeDiv" class="iframe-container">
                <iframe id="mainCode"></iframe>
            </div>

            <%-- SPELLING --%>
            <div hidden id="mainSpellingDiv" class="container-fluid px-4">
                <%-- TITLE --%>
                <h1 class="mt-4">Spelling</h1>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active">Report</li>
                    <li hidden class="breadcrumb-item active" id="spelling-cache">
                        <span id="spelling-cacheDate"></span>
                        <span class="cache_tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="cache_tooltiptext">We use cached data so that future requests for that data can be served faster</span>
                        </span>
                    </li>
                </ol>
                <span class="btn active mb-4" onclick="rerunSpelling()">Run Again</span>
                <%-- GENERAL INFO --%>
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="spell-card-total" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="spelling-total-errors">0</h5>
                                <p class="card-text">Total Errors</p>
                            </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <button id="spelling-errors-btn" onclick="toggleSpellView('errorsTableDiv')"
                                        class="small text-white stretched-link border-0 bg-transparent">View Details
                                </button>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="spell-card-most" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="spelling-most-errors">None</h5>
                                <p class="card-text">Most Frequent</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="spell-card-least" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="spelling-least-errors">None</h5>
                                <p class="card-text">Least Frequent</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="spell-card-dictionary" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="spelling-total-dictionary">0</h5>
                                <p class="card-text">Dictionary</p>
                            </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <button id="spelling-dictionary-btn" onclick="toggleSpellView('dictionaryTableDiv')"
                                        class="small text-white stretched-link border-0 bg-transparent">View Details
                                </button>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <%-- TABLES --%>
                <div id="errorsTableDiv" class="card mb-4">
                    <div class="card-body">
                        <h3 class="text-center">Errors</h3>
                        <table class="table" id="errorsTable">
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
                </div>
                <div hidden id="dictionaryTableDiv" class="card mb-4">
                    <div class="card-body">
                        <h3 class="text-center">Dictionary</h3>
                        <table class="table" id="dictionaryTable">
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

            <%-- ACCESSIBILITY --%>
            <div hidden id="mainAccessibilityDiv" class="container-fluid px-4">
                <%-- TITLE --%>
                <h1 class="mt-4">Accessibility</h1>
                <%-- SUBTITLE --%>
                <ol class="breadcrumb mb-2">
                    <li class="breadcrumb-item active">Report</li>
                    <li hidden class="breadcrumb-item active" id="accessibility-cache">
                        <span id="accessibility-cacheDate"></span>
                        <span class="cache_tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="cache_tooltiptext">We use cached data so that future requests for that data can be served faster</span>
                        </span>
                    </li>
                </ol>
                <%-- RERUN --%>
                <button class="btn active mb-4" onclick="rerunAccessibility()">Run Again</button>
                <%-- GENERAL INFO --%>
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="accessibility-card-total" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="accessibility-total">0</h5>
                                <p class="card-text">Total</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="accessibility-card-errors" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="accessibility-errors">0</h5>
                                <p class="card-text">Errors</p>
                            </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <button id="accessibility-errors-btn"
                                        onclick="toggleAccessibilityView('snifferErrorsTableDiv')"
                                        class="small text-white stretched-link border-0 bg-transparent">View Details
                                </button>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="accessibility-card-notices" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="accessibility-notices">0</h5>
                                <p class="card-text">Notices</p>
                            </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <button id="accessibility-notices-btn"
                                        onclick="toggleAccessibilityView('snifferNoticesTableDiv')"
                                        class="small text-white stretched-link border-0 bg-transparent">View Details
                                </button>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="accessibility-card-warnings" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="accessibility-warnings">0</h5>
                                <p class="card-text">Warnings</p>
                            </div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <button id="accessibility-warnings-btn"
                                        onclick="toggleAccessibilityView('snifferWarningsTableDiv')"
                                        class="small text-white stretched-link border-0 bg-transparent">View Details
                                </button>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <%-- TABLES --%>
                <div id="snifferErrorsTableDiv" class="card mb-4">
                    <div class="card-body">
                        <h3 class="text-center">Errors</h3>
                        <table id="snifferErrorsTable" class="table">
                            <thead>
                            <tr>
                                <th>Guideline</th>
                                <th>Message</th>
                                <th>Tag</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                            <tfoot>
                            <tr>
                                <th>Guideline</th>
                                <th>Message</th>
                                <th>Tag</th>
                                <th>Action</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div hidden id="snifferNoticesTableDiv" class="card mb-4">
                    <div class="card-body">
                        <h3 class="text-center">Notices</h3>
                        <table id="snifferNoticesTable" class="table">
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
                <div hidden id="snifferWarningsTableDiv" class="card mb-4">
                    <div class="card-body">
                        <h3 class="text-center">Warnings</h3>
                        <table id="snifferWarningsTable" class="table">
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

            <%-- COOKIES --%>
            <div hidden id="mainCookiesDiv" class="container-fluid px-4">
                <%-- TITLE --%>
                <h1 class="mt-4">Cookies</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Report</li>
                    <li hidden class="breadcrumb-item active" id="cookies-cache">
                        <span id="cookies-cacheDate"></span>
                        <span class="cache_tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="cache_tooltiptext">We use cached data so that future requests for that data can be served faster</span>
                        </span>
                    </li>
                </ol>
                <span class="btn active mb-4" onclick="rerunCookies()">Run Again</span>
                <%-- GENERAL INFO --%>
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="cookies-card-total" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="cookies-total">0</h5>
                                <p class="card-text">Total</p>
                            </div>
                        </div>
                    </div>
                </div>
                <%-- TABLES --%>
                <div class="card mb-4">
                    <div class="card-body">
                        <table id="cookiesTable" class="table">
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

            <%-- TECHNOLOGIES --%>
            <div hidden id="mainTechnologiesDiv" class="container-fluid px-4">
                <%-- TITLE --%>
                <h1 class="mt-4">Technologies</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Report</li>
                    <li hidden class="breadcrumb-item active" id="technologies-cache">
                        <span id="technologies-cacheDate"></span>
                        <span class="cache_tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="cache_tooltiptext">We use cached data so that future requests for that data can be served faster</span>
                        </span>
                    </li>
                </ol>
                <span class="btn active mb-4" onclick="rerunTechnologies()">Run Again</span>
                <%-- GENERAL INFO --%>
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="technologies-card-total" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="technologies-total">0</h5>
                                <p class="card-text">Total</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="technologies-card-errors" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="technologies-most">None</h5>
                                <p class="card-text">Most Frequent Category</p>
                            </div>
                        </div>
                    </div>
                </div>
                <%-- TABLES --%>
                <div class="card mb-4">
                    <div class="card-body">
                        <table id="technologiesTable" class="table">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Website</th>
                                <th>Category</th>
                                <th>Confidence</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                            <tfoot>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Website</th>
                                <th>Category</th>
                                <th>Confidence</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <%-- IMAGES --%>
            <div hidden id="mainImagesDiv" class="container-fluid px-4">
                <%-- TITLE --%>
                <h1 class="mt-4">Images</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Report</li>
                    <li hidden class="breadcrumb-item active" id="images-cache">
                        <span id="images-cacheDate"></span>
                        <span class="cache_tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="cache_tooltiptext">We use cached data so that future requests for that data can be served faster</span>
                        </span>
                    </li>
                </ol>
                <span class="btn active mb-4" onclick="rerunImages()">Run Again</span>
                <%-- GENERAL INFO --%>
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="images-card-total" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="images-total">0</h5>
                                <p class="card-text">Total</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="images-card-errors" class="card mb-4 bg-lfi-blue text-white"
                             style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="images-most">None</h5>
                                <p class="card-text">Most Frequent Format</p>
                            </div>
                        </div>
                    </div>
                </div>
                <%-- TABLES --%>
                <div class="card mb-4">
                    <div class="card-body">
                        <table id="imagesTable" class="table">
                            <thead>
                            <tr>
                                <th>Image</th>
                                <th>Width</th>
                                <th>Height</th>
                                <th>Format</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                            <tfoot>
                            <tr>
                                <th>Image</th>
                                <th>Width</th>
                                <th>Height</th>
                                <th>Format</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <%-- LIGHTHOUSE --%>
            <div hidden id="mainLighthouseDiv" class="iframe-container">
                <iframe id="mainLighthouse" src="about:blank"></iframe>
            </div>

            <%-- LINKS --%>
            <div hidden id="mainLinksDiv" class="container-fluid px-4">
                <%-- TITLE --%>
                <h1 class="mt-4">Links</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Report</li>
                    <li hidden class="breadcrumb-item active" id="links-cache">
                        <span id="links-cacheDate"></span>
                        <span class="cache_tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="cache_tooltiptext">We use cached data so that future requests for that data can be served faster</span>
                        </span>
                    </li>
                </ol>
                <span class="btn active mb-4" onclick="rerunLinks()">Run Again</span>
                <%-- GENERAL INFO --%>
                <div class="row d-flex justify-content-center">
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="links-card-total" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="links-total">0</h5>
                                <p class="card-text">Total</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="links-card-ext" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="links-ext">0</h5>
                                <p class="card-text">External</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="links-card-int" class="card mb-4 bg-lfi-blue text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="links-int">0</h5>
                                <p class="card-text">Internal</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 text-center">
                        <div id="links-card-broken" class="card mb-4 bg-danger text-white" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title" id="links-broken">0</h5>
                                <p class="card-text">Broken Links</p>
                            </div>
                        </div>
                    </div>
                </div>
                <%-- TABLES --%>
                <div class="card mb-4">
                    <div class="card-body">
                        <table id="linksTable" class="table">
                            <thead>
                            <tr>
                                <th>URL</th>
                                <th>Status</th>
                                <th>Origin</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody id="linksTableBody"></tbody>
                            <tfoot>
                            <tr>
                                <th>URL</th>
                                <th>Status</th>
                                <th>Origin</th>
                                <th>Action</th>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>

<%-- SCRIPTS --%>
<script src="js/findAndReplaceDOMText.js"></script>
<script src="js/syntaxHighlighter.js"></script>
<script src="js/scripts.js"></script>
<script src="js/main.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

<%-- Get url / mainURL / mainLang --%>
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

<script>
    // Disable sidebar btns
    enableDisableActions("disable");
    document.getElementById("searchURL").disabled = false;
    document.getElementById("languages-list").disabled = false;
    document.getElementById("WCAG-level-list").disabled = false;

    <%-- If a URL Param is present => runMain --%>
    <% if (!(mainURL.equals("null"))) { %>
    runMain("<%=url%>", "<%=mainURL%>", "<%=mainLang%>");
    <% } %>
</script>

</body>
</html>
