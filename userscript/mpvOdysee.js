// ==UserScript==
// @name         Odysee MPV Player
// @version      0.2
// @description  This little script opens any Odysee video in MPV with a simple button click
// @author       TibixDev
// @match        https://odysee.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Odysee_Logo.svg/1200px-Odysee_Logo.svg.png
// @grant        GM_addStyle
// ==/UserScript==

(async function () {
    'use strict';
    console.log("[YTMPV] Odysee MPV player script loaded");
	let urlRegex = /^https:\/\/(www\.)?odysee\.com\/@[^:]+:[^\/]+\/[^:]+:[^\/]*$/

    function setButtonInterval() {
        return setInterval(() => {
            if (document.querySelector(".card__body>.media__subtitle--between>.media__actions")) {
                console.log("[YTMPV] Menu container found, executing...");
                addMpvButton()
            }
        }, 2000);
    }

    let waitForButtons = null;

    let location = window.location.href;;
    if (location.match(urlRegex)) {
        waitForButtons = setButtonInterval();
      console.log("[YTMPV] Starting video link correct: " + location);
    }


    function addMpvButton() {
        clearInterval(waitForButtons);
        waitForButtons = null;
        const ytButtons = document.querySelector(".card__body>.media__subtitle--between>.media__actions");
        const ytButton = document.createElement("button");
        ytButton.id = "mpv-button";
        ytButton.classList.add("button", "button--no-style", "button--file-action");
        const mpvBtnStyle = `
        #mpv-button {
            margin-right: 10px;
        }`

        const styleElem = document.createElement("style");
        if (styleElem.styleSheet) {
            styleElem.styleSheet.cssText = mpvBtnStyle;
        } else {
            styleElem.appendChild(document.createTextNode(mpvBtnStyle));
        }
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        //ytButton.style.cssText = "margin-right: 10px;";
        ytButton.textContent = "▶ MPV";
        ytButton.addEventListener("click", () => {
            document.querySelector("video").pause();
            document.location = "mpv://" + document.location.href;
            ytButton.textContent = "⌛ Opening...";
            ytButton.style.cssText = "background-color: #0a6dab;";
            setTimeout(() => {
                ytButton.textContent = "▶ MPV";
                ytButton.style.cssText = "";
            }, 3000);
        });

        ytButtons.appendChild(ytButton);
        console.log("[YTMPV] MPV button added");
        console.log(ytButton, ytButtons);
    }
})();