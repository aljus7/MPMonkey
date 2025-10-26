// ==UserScript==
// @name         YouTube Downloader
// @version      0.3
// @description  This little script downloads any YouTube video
// @author       TibixDev
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(async function () {
    'use strict';
    console.log("[YTDL] YouTube downloader script loaded");

    function setButtonInterval() {
        return setInterval(() => {
            if (document.querySelector("#actions>#actions-inner>#menu>ytd-menu-renderer>#top-level-buttons-computed>yt-button-view-model")) {
                console.log("[YTDL] Menu container found, executing...");
                addDlButton()
            }
        }, 2000);
    }

    let waitForButtons = null;

    let location = window.location.href;
    if (location.match(/^https:\/\/www\.youtube\.com\/watch\?v=([^&]*)/)) {
        waitForButtons = setButtonInterval();
      console.log("[YTDL] Video link correct: " + location);
    }

    function handleVideoUrlChange(newUrl) {
        if (location !== newUrl && newUrl.includes("watch?v=") && !waitForButtons) {
            console.log("[YTDL] Video URL detected, toggling waitForButtons...");
            waitForButtons = setButtonInterval();
            location = newUrl;
        }
    }

    // Listen for YouTube's navigation finish event
    window.addEventListener('yt-navigate-finish', () => {
        // Small delay to ensure URL and content are settled
        setTimeout(() => {
            handleVideoUrlChange(window.location.href);
        }, 100);
    });

    function addDlButton() {
        clearInterval(waitForButtons);
        waitForButtons = null;
        const ytButtons = document.querySelector("#actions>#actions-inner>#menu>ytd-menu-renderer>#top-level-buttons-computed");
        const ytButton = document.createElement("button");
        ytButton.id = "ytdlp-button";
        ytButton.classList.add("ytSpecButtonViewModelHost", "style-scope", "ytd-menu-renderer", "yt-spec-button-shape-next", "yt-spec-button-shape-next--tonal", "yt-spec-button-shape-next--mono", "yt-spec-button-shape-next--size-m", "yt-spec-button-shape-next--icon-leading", "yt-spec-button-shape-next--enable-backdrop-filter-experiment");
        const mpvBtnStyle = `
        #ytdlp-button {
            margin-left: 10px;
            padding: 0px 40px;
        }`

        const styleElem = document.createElement("style");
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = mpvBtnStyle;
        } else {
            styleElem.appendChild(document.createTextNode(mpvBtnStyle));
        }
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        //ytButton.style.cssText = "margin-left: 10px;";
        ytButton.textContent = "📥 DOWNLOAD";
        ytButton.addEventListener("click", () => {
            document.querySelector("video").pause();
            document.location = "ytdlp-downloader://" + document.location.href;
            ytButton.textContent = "📥 DOWNLOAD";
            //ytButton.style.cssText = "background-color: #0a6dab;";
            setTimeout(() => {
                ytButton.textContent = "Downloading...";
                ytButton.style.cssText = "";
            }, 3000);
        });

        ytButtons.appendChild(ytButton);
        console.log("[YTDL] DOWNLOAD button added");
        console.log(ytButton, ytButtons);
    }
})();