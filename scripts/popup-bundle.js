// Page Inspector Chrome Extension
// LanguageTool && Google Lighthouse
// Little Forest 2021
// Author: Francisco 'xhico' Filipe
// Created: 2021/06/02
// Updated: 2021/07/18

console.clear();

(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];
                    return o(n || r)
                }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o
    }
    return r
})()

    ({
        1: [function (require, module, exports) {
            /**
             * @license Copyright 2021 Little Forest.
            */
            'use strict';

            const SettingsController = require('./settings-controller.js');
            const optionsVisibleClass = 'main--options-visible';

            // Set Base URL
            const lighthouseURL = "https://inspector.littleforest.co.uk/LighthouseWS/lighthouseServlet?"

            /**
             * Guaranteed context.querySelector. Always returns an element or throws if
             * @param {string} url
             * @return {JSON}
             * @return {HTMLElement}
             */
            async function getRequest(url) {
                try {
                    const res = await fetch(url);
                    if (url.includes("lighthouseServlet")) {
                        return await res.json();
                    }
                    return await res.text();
                } catch (error) {
                    return error;
                }
            }

            /**
             * Guaranteed context.querySelector. Always returns an element or throws if
             * nothing matches query.
             * @param {string} query
             * @param {ParentNode=} context
             * @return {HTMLElement}
             */
            function find(query, context = document) {
                /** @type {?HTMLElement} */
                const result = context.querySelector(query);
                if (result === null) {
                    throw new Error(`query ${query} not found`);
                }
                return result;
            }

            /**
             * @param {string} text
             * @param {string} id
             * @param {boolean} isChecked
             * @return {HTMLLIElement}
             */
            function createOptionItem(text, id, isChecked) {
                const input = document.createElement('input');
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value', id);
                if (isChecked) { input.setAttribute('checked', 'checked'); }

                const label = document.createElement('label');
                label.appendChild(input);
                label.appendChild(document.createElement('span')).textContent = text;
                const listItem = document.createElement('li');
                listItem.appendChild(label);

                return listItem;
            }

            /**
             * Generates a document fragment containing a list of checkboxes and labels
             * for the categories.
             * @param {SettingsController.Settings} settings
             */
            function generateOptionsList(settings) {
                const frag = document.createDocumentFragment();

                SettingsController.DEFAULT_CATEGORIES.forEach(category => {
                    const isChecked = settings.selectedCategories.includes(category.id);
                    frag.appendChild(createOptionItem(category.title, category.id, isChecked));
                });

                const optionsCategoriesList = find('.options__categories');
                optionsCategoriesList.appendChild(frag);
            }

            /**
             * Generates a document fragment containing a list of checkboxes and labels
             * for the categories.
             * @param {SettingsController.Settings} settings
             */
            function generateLanguageList(settings) {
                const frag = document.createDocumentFragment();

                SettingsController.DEFAULT_LANGUAGES.forEach(language => {
                    const isChecked = settings.selectedLanguages.includes(language.id);

                    var x = document.getElementById("languagesList");
                    var option = document.createElement("option");
                    option.text = language.title;
                    option.value = language.id;
                    if (isChecked) { option.setAttribute('selected', 'undefined'); }
                    x.add(option);
                });

                const optionsLanguageList = find('.options__languages');
                optionsLanguageList.appendChild(frag);
            }

            /**
             * Create the settings from the state of the options form, save in storage, and return it.
             * @returns {SettingsController.Settings}
             */
            function readSettingsFromDomAndPersist() {
                const optionsEl = find('.section--options');

                // Save settings when options page is closed.
                const checkboxesC = (optionsEl.querySelectorAll('.options__categories input:checked'));
                const selectedCategories = Array.from(checkboxesC).map(input => input.value);

                // Save settings when options page is closed.
                const selectedLanguages = document.getElementById("languagesList").value;

                const device = (find('input[name="device"]:checked')).value;
                const settings = { selectedLanguages, selectedCategories, device, };

                SettingsController.saveSettings(settings);
                return settings;
            }

            /**
             * @return {Promise<URL>}
             */
            function getSiteUrl() {
                return new Promise((resolve, reject) => {
                    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
                        if (tabs.length === 0 || !tabs[0].url) {
                            return;
                        }

                        const url = new URL(tabs[0].url);
                        if (url.hostname === 'localhost') {
                            reject(new Error('Use DevTools to audit pages on localhost.'));
                        } else if (/^(chrome|about)/.test(url.protocol)) {
                            reject(new Error(`Cannot audit ${url.protocol}// pages.`));
                        } else {
                            resolve(url);
                        }
                    });
                });
            }

            /**
             * Initializes the popup's state and UI elements.
             */
            async function initPopup() {
                const mainEl = find('main');
                const optionsEl = find('.button--configure');
                const generateReportButton = /** @type {HTMLButtonElement} */ (find('.button--generate'));
                const configureButton = /** @type {HTMLButtonElement} */ (find('.button--configure'));
                const psiDisclaimerEl = find('.psi-disclaimer');
                const errorMessageEl = find('.errormsg');
                const optionsFormEl = find('.options__form');

                /** @type {URL} */
                let siteUrl;
                /** @type {SettingsController.Settings} */
                let settings;
                try {
                    siteUrl = await getSiteUrl();
                    settings = await SettingsController.loadSettings();
                } catch (err) {
                    // Disable everything. A navigation might allow for a working state,
                    // but it's very hard to keep an extension popup alive during a popup
                    // so we don't need to handle reacting to it.
                    generateReportButton.disabled = true;
                    configureButton.disabled = true;
                    psiDisclaimerEl.remove();
                    errorMessageEl.textContent = err.message;
                    return;
                }

                // Generate checkboxes from saved settings.
                generateOptionsList(settings);
                generateLanguageList(settings);

                const selectedDeviceEl = (find(`.options__device input[value="${settings.device}"]`));
                selectedDeviceEl.checked = true;

                optionsEl.addEventListener('click', () => {
                    mainEl.classList.toggle(optionsVisibleClass);
                });

                optionsFormEl.addEventListener('change', () => {
                    settings = readSettingsFromDomAndPersist();
                });

                // ----------------------------------------------------------------------------------------------------------- //
                // ----------------------------------------------------------------------------------------------------------- //

                generateReportButton.addEventListener('click', () => {
                    if (generateReportButton.innerText == "Generate Report") {
                        generateReportButton.innerText = "Starting";
                        document.getElementById("keepMeOpen").innerText = "Please keep me open until finish!"
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, { text: "startInject" });
                        });
                    }
                });


                chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
                    if (msg.question == "sidebarHTML") {
                        let htmlContent = await getRequest(chrome.runtime.getURL("assets/report.html"));
                        chrome.tabs.sendMessage(sender.tab.id, { text: "addSidebarHTML", content: htmlContent });
                    } else if (msg.question == "sidebarJS") {
                        let jsContent = await getRequest(chrome.runtime.getURL("assets/report.js"));
                        chrome.tabs.sendMessage(sender.tab.id, { text: "addSidebarJS", content: jsContent });
                    } else if (msg.question == "sidebarCSS") {
                        let cssContent = await getRequest(chrome.runtime.getURL("assets/report.css"));
                        chrome.tabs.sendMessage(sender.tab.id, { text: "addSidebarCSS", content: cssContent });
                    } else if (msg.question == "addOverlay") {
                        chrome.tabs.sendMessage(sender.tab.id, { text: "addOverlay" });
                    } else if (msg.question == "generealInfo") {
                        generateReportButton.innerText = "Getting General Information";
                        chrome.tabs.sendMessage(sender.tab.id, { text: "addGeneralInfo" });
                    } else if (msg.question == "languageTool") {
                        generateReportButton.innerText = "Running Spell Check";
                        chrome.tabs.sendMessage(sender.tab.id, { lang: settings.selectedLanguages, text: "runLanguageTool" });
                    } else if (msg.question == "removeOverlay") {
                        chrome.tabs.sendMessage(sender.tab.id, { text: "removeOverlay" });
                    } else if (msg.question == "lighthouse") {
                        generateReportButton.innerText = "Running Lighthouse";
                        let cats = "";
                        if (settings.selectedCategories.length !== 0) {
                            settings.selectedCategories.forEach(category => { cats += category + ","; });
                            cats = cats.slice(0, -1);
                        } else {
                            cats = "null";
                        }
                        let lighthouseJson = await getRequest(lighthouseURL + "url=" + siteUrl + "&cats=" + cats + "&device=" + settings.device);
                        chrome.tabs.sendMessage(sender.tab.id, { text: "runLighthouse", content: lighthouseJson, categories: cats });
                    } else if (msg.question == "end" || msg.question == "allDone") {
                        generateReportButton.innerText = "All Done";
                        document.getElementById("keepMeOpen").innerText = "You can close me now!"
                    }

                });
            }

            initPopup();

        }, { "./settings-controller.js": 2 }], 2: [function (require, module, exports) {
            /**
             * @license Copyright 2021 Little Forest.
             */
            'use strict';

            // Manually define the default languages, instead of bundling a lot of i18n code.
            const DEFAULT_LANGUAGES = [
                { id: 'ar', title: 'Arabic', },
                { id: 'ast-ES', title: 'Asturian', },
                { id: 'be-BY', title: 'Belarusian', },
                { id: 'br-FR', title: 'Breton', },
                { id: 'ca-ES', title: 'Catalan', },
                { id: 'ca-ES-valencia', title: 'Catalan (Valencian)', },
                { id: 'zh-CN', title: 'Chinese', },
                { id: 'da-DK', title: 'Danish', },
                { id: 'nl', title: 'Dutch', },
                { id: 'nl-BE', title: 'Dutch (Belgium)', },
                { id: 'en-AU', title: 'English (Australian)', },
                { id: 'en-CA', title: 'English (Canadian)', },
                { id: 'en-GB', title: 'English (GB)', },
                { id: 'en-NZ', title: 'English (New Zealand)', },
                { id: 'en-ZA', title: 'English (South African)', },
                { id: 'en-US', title: 'English (US)', },
                { id: 'eo', title: 'Esperanto', },
                { id: 'fr', title: 'French', },
                { id: 'gl-ES', title: 'Galician', },
                { id: 'de-AT', title: 'German (Austria)', },
                { id: 'de-DE', title: 'German (Germany)', },
                { id: 'de-CH', title: 'German (Swiss)', },
                { id: 'el-GR', title: 'Greek', },
                { id: 'ga-IE', title: 'Irish', },
                { id: 'it', title: 'Italian', },
                { id: 'ja-JP', title: 'Japanese', },
                { id: 'km-KH', title: 'Khmer', },
                { id: 'nb', title: 'Norwegian (Bokmål)', },
                { id: 'no', title: 'Norwegian (Bokmål)', },
                { id: 'fa', title: 'Persian', },
                { id: 'pl-PL', title: 'Polish', },
                { id: 'pt-AO', title: 'Portuguese (Angola preAO)', },
                { id: 'pt-BR', title: 'Portuguese (Brazil)', },
                { id: 'pt-MZ', title: 'Portuguese (Moçambique preAO)', },
                { id: 'pt-PT', title: 'Portuguese (Portugal)', },
                { id: 'ro-RO', title: 'Romanian', },
                { id: 'ru-RU', title: 'Russian', },
                { id: 'sk-SK', title: 'Slovak', },
                { id: 'sl-SI', title: 'Slovenian', },
                { id: 'es', title: 'Spanish', },
                { id: 'es-AR', title: 'Spanish (voseo)', },
                { id: 'sv', title: 'Swedish', },
                { id: 'tl-PH', title: 'Tagalog', },
                { id: 'ta-IN', title: 'Tamil', },
                { id: 'uk-UA', title: 'Ukrainian', },
                { id: 'auto', title: 'Auto-Detect', }
            ];

            // Manually define the default categories, instead of bundling a lot of i18n code.
            const DEFAULT_CATEGORIES = [
                { id: 'performance', title: 'Performance', },
                { id: 'accessibility', title: 'Accessibility', },
                { id: 'best-practices', title: 'Best Practices', },
                { id: 'seo', title: 'SEO', },
                { id: 'pwa', title: 'Progressive Web App', }
            ];

            /** @typedef {{selectedCategories: string[], device: string}} Settings */
            const STORAGE_KEYS = {
                Categories: 'lighthouse_audits',
                Languages: 'lighthouse_languages',
                Settings: 'lighthouse_settings',
            };

            /**
             * Save currently selected set of category categories to local storage.
             * @param {Settings} settings
             */
            function saveSettings(settings) {
                const storage = {
                    /** @type {Record<string, boolean>} */
                    [STORAGE_KEYS.Categories]: {},
                    /** @type {Record<string, boolean>} */
                    [STORAGE_KEYS.Languages]: {},
                    /** @type {Record<string, string>} */
                    [STORAGE_KEYS.Settings]: {},
                };

                // Stash selected categories.
                DEFAULT_CATEGORIES.forEach(category => {
                    const enabled = settings.selectedCategories.includes(category.id);
                    storage[STORAGE_KEYS.Categories][category.id] = enabled;
                });

                // Stash selected language.
                DEFAULT_LANGUAGES.forEach(language => {
                    const enabled = settings.selectedLanguages.includes(language.id);
                    storage[STORAGE_KEYS.Languages][language.id] = enabled;
                });

                // Stash device setting.
                storage[STORAGE_KEYS.Settings].device = settings.device;

                // Save object to chrome local storage.
                chrome.storage.local.set(storage);
            }

            /**
             * Load selected category categories from local storage.
             * @return {Promise<Settings>}
             */
            function loadSettings() {
                return new Promise(resolve => {
                    chrome.storage.local.get([STORAGE_KEYS.Languages, STORAGE_KEYS.Categories, STORAGE_KEYS.Settings], result => {
                        // Start with list of all default categories set to true so list is
                        // always up to date.
                        /** @type {Record<string, boolean>} */
                        const defaultCategories = {};
                        DEFAULT_CATEGORIES.forEach(category => { defaultCategories[category.id] = true; });

                        /** @type {Record<string, boolean>} */
                        const defaultLanguages = {};
                        DEFAULT_LANGUAGES.forEach(language => { defaultLanguages[language.id] = true; });

                        // Load saved categories and settings, overwriting defaults with any
                        // saved selections.
                        const savedCategories = { ...defaultCategories, ...result[STORAGE_KEYS.Categories] };
                        const savedLanguages = { ...defaultLanguages, ...result[STORAGE_KEYS.Languages] };
                        const defaultSettings = { device: 'mobile', };
                        const savedSettings = { ...defaultSettings, ...result[STORAGE_KEYS.Settings] };

                        resolve({
                            device: savedSettings.device,
                            selectedCategories: Object.keys(savedCategories).filter(cat => savedCategories[cat]),
                            selectedLanguages: Object.keys(savedLanguages).filter(lang => savedLanguages[lang]),
                        });

                    });
                });
            }

            module.exports = {
                DEFAULT_CATEGORIES,
                DEFAULT_LANGUAGES,
                STORAGE_KEYS,
                saveSettings,
                loadSettings,
            };

        }, {}]
    }, {}, [1]);
