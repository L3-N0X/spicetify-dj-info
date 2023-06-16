// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: 1.1.0
// DESCRIPTION: BPM and Energy display for each song

/// <reference path='../globals.d.ts' />

; (async function djInfoList() {
    while (!Spicetify.showNotification) {
        await new Promise((resolve) => setTimeout(resolve, 500))
    }
    const { CosmosAsync, ContextMenu, URI } = Spicetify;
    if (!(CosmosAsync && URI)) {
        setTimeout(djInfoList, 300)
        return
    }

    let isPlaylistEnabled = true;
    let isNowPlayingEnabled = true;

    let isBPMEnabled = true;
    let isKeyEnabled = true;
    let isPopularityEnabled = true;
    let isEnergyEnabled = true;

    const fiveColumnGridCss = "[index] 16px [first] 3fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr)"
    const sixColumnGridCss = "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr)"
    const sevenColumnGridCss = "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var4] 2fr [last] minmax(120px,1fr)"

    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect()
                    resolve(document.querySelector(selector))
                }
            })
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        })
    }

    function getTracklistTrackUri(tracklistElement) {
        let values = Object.values(tracklistElement)
        if (!values) return null

        return (
            values[0]?.pendingProps?.children[0]?.props?.children?.props?.uri ||
            values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.uri ||
            values[0]?.pendingProps?.children[0]?.props?.children[0]?.props?.uri
        )
    }

    function getPageType() {
        const pathname = Spicetify.Platform.History.location.pathname
        let matches = null
        if (pathname === "/collection/tracks") {
            return ["LIKED_SONGS", null]
        }
        if ((matches = pathname.match(/playlist\/(.*)/))) {
            return ["PLAYLIST", matches[1]]
        }
        if ((matches = pathname.match(/album\/(.*)/))) {
            return ["ALBUM", matches[1]]
        }
        if ((matches = pathname.match(/artist\/([^/]*)$/))) {
            return ["ARTIST", matches[1]]
        }
        if ((matches = pathname.match(/artist\/([^/]*)\/saved/))) {
            return ["ARTIST_LIKED", matches[1]]
        }
        return ["OTHER", null]
    }

    let oldTracklist = null
    let tracklist = null

    let oldNowPlayingWidget = null
    let nowPlayingWidget = null

    let updateNowPlayingWidget = null
    let updateTracklist = null
    let nowPlayingWidgetdjInfoData = null

    isPlaylistEnabled = Spicetify.LocalStorage.get("dj-playlists-enabled") == 1 || Spicetify.LocalStorage.get("dj-playlists-enabled") == null;
    isNowPlayingEnabled = Spicetify.LocalStorage.get("dj-nowplaying-enabled") == 1 || Spicetify.LocalStorage.get("dj-nowplaying-enabled") == null;

    isBPMEnabled = Spicetify.LocalStorage.get("dj-bpm-enabled") == 1 || Spicetify.LocalStorage.get("dj-bpm-enabled") == null;
    isKeyEnabled = Spicetify.LocalStorage.get("dj-key-enabled") == 1 || Spicetify.LocalStorage.get("dj-key-enabled") == null;
    isPopularityEnabled = Spicetify.LocalStorage.get("dj-popularity-enabled") == 1 || Spicetify.LocalStorage.get("dj-popularity-enabled") == null;
    isEnergyEnabled = Spicetify.LocalStorage.get("dj-energy-enabled") == 1 || Spicetify.LocalStorage.get("dj-energy-enabled") == null;

    // Add menu item and menu click handler
    const enablePlaylist = new Spicetify.Menu.Item(
        "Enable in Playlists",
        isPlaylistEnabled,
        (item) => {
            isPlaylistEnabled = !isPlaylistEnabled;
            item.setState(isPlaylistEnabled);
            Spicetify.LocalStorage.set("dj-playlists-enabled", isPlaylistEnabled ? 1 : 0);
        }
    );

    const enableNowPlaying = new Spicetify.Menu.Item(
        "Enable in Now Playing",
        isNowPlayingEnabled,
        (item) => {
            isNowPlayingEnabled = !isNowPlayingEnabled;
            item.setState(isNowPlayingEnabled);
            Spicetify.LocalStorage.set("dj-nowplaying-enabled", isNowPlayingEnabled ? 1 : 0);
        }
    );

    const enableBPM = new Spicetify.Menu.Item(
        "Enable BPM",
        isBPMEnabled,
        (item) => {
            isBPMEnabled = !isBPMEnabled;
            item.setState(isBPMEnabled);
            Spicetify.LocalStorage.set("dj-bpm-enabled", isBPMEnabled ? 1 : 0);
        }
    );

    const enableKey = new Spicetify.Menu.Item(
        "Enable Key",
        isKeyEnabled,
        (item) => {
            isKeyEnabled = !isKeyEnabled;
            item.setState(isKeyEnabled);
            Spicetify.LocalStorage.set("dj-key-enabled", isKeyEnabled ? 1 : 0);
        }
    );

    const enablePopularity = new Spicetify.Menu.Item(
        "Enable Popularity",
        isPopularityEnabled,
        (item) => {
            isPopularityEnabled = !isPopularityEnabled;
            item.setState(isPopularityEnabled);
            Spicetify.LocalStorage.set("dj-popularity-enabled", isPopularityEnabled ? 1 : 0);
        }
    );

    const enableEnergy = new Spicetify.Menu.Item(
        "Enable Energy",
        isEnergyEnabled,
        (item) => {
            isEnergyEnabled = !isEnergyEnabled;
            item.setState(isEnergyEnabled);
            Spicetify.LocalStorage.set("dj-energy-enabled", isEnergyEnabled ? 1 : 0);
        }
    );

    const reload = new Spicetify.Menu.Item(
        //  a ascii symbol as icon for apply changes
        "\u21BB  Apply Changes",
        false,
        (item) => {
            window.location.reload();
        }
    );

    const menu = new Spicetify.Menu.SubMenu("DJ Info", [enablePlaylist, enableNowPlaying, enableBPM, enableKey, enablePopularity, enableEnergy, reload]);
    menu.register();

    updateTracklist = async () => {
        // console.log("updateTracklist ");
        const tracklists = document.getElementsByClassName("main-trackList-indexable")
        for (const tracklist_ of tracklists) {
            if (!tracklist_ || !isPlaylistEnabled) {
                // console.log("no tracklist");
                return
            }
            // console.log("tracklist");
            const tracklistHeader = tracklist_.querySelector(".main-trackList-trackListHeaderRow")
            if (tracklistHeader && !tracklistHeader.querySelector(".djinfoheader")) {   // No tracklist header on Artist page
                let lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd")
                let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"))

                lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString())
                let headerColumn = document.createElement("div")
                headerColumn.style.display = "flex"
                headerColumn.classList.add("main-trackList-rowSectionVariable")
                headerColumn.role = "columnheader"
                tracklistHeader.insertBefore(headerColumn, lastColumn)
                // console.log("error");
                switch (colIndexInt) {
                    case 4:
                        tracklistHeader.style["grid-template-columns"] = fiveColumnGridCss
                        break
                    case 5:
                        tracklistHeader.style["grid-template-columns"] = sixColumnGridCss
                        break
                    case 6:
                        tracklistHeader.style["grid-template-columns"] = sevenColumnGridCss
                        break
                    default:
                        break
                }

                var btn = document.createElement('button');
                btn.classList.add("main-trackList-column")
                btn.classList.add("main-trackList-sortable")
                btn.classList.add("djinfoheader")
                var title = document.createElement('span');
                title.classList.add("TypeElement-mesto-type")
                title.classList.add("standalone-ellipsis-one-line")
                title.innerHTML = "DJ Info"
                btn.appendChild(title)
                headerColumn.appendChild(btn)
            }


            const tracks = tracklist_.getElementsByClassName("main-trackList-trackListRow")

            for (const track of tracks) {
                const heart = track.getElementsByClassName("main-addButton-button")[0]
                const hasdjinfo = track.getElementsByClassName("djinfo").length > 0
                const trackUri = getTracklistTrackUri(track)
                const isTrack = trackUri.includes("track")

                let ratingColumn = track.querySelector(".djInfoList")
                if (!ratingColumn) {
                    // Add column for djInfos
                    let lastColumn = track.querySelector(".main-trackList-rowSectionEnd")
                    let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"))
                    lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString())
                    ratingColumn = document.createElement("div")
                    ratingColumn.setAttribute("aria-colindex", colIndexInt.toString())
                    // ratingColumn.role = "gridcell"
                    ratingColumn.style.display = "flex"
                    ratingColumn.classList.add("main-trackList-rowSectionVariable")
                    ratingColumn.classList.add("djInfoList")
                    track.insertBefore(ratingColumn, lastColumn)

                    switch (colIndexInt) {
                        case 4:
                            track.style["grid-template-columns"] = fiveColumnGridCss
                            break
                        case 5:
                            track.style["grid-template-columns"] = sixColumnGridCss
                            break
                        case 6:
                            track.style["grid-template-columns"] = sevenColumnGridCss
                            break
                        default:
                            break
                    }

                    if (!heart || !trackUri || hasdjinfo || !isTrack) continue
                    var text = document.createElement('p');
                    var uri = trackUri;
                    var uriFinal = uri.split(":")[2]
                    var res = await CosmosAsync.get('https://api.spotify.com/v1/audio-features/' + uriFinal);
                    var resTrack = await CosmosAsync.get('https://api.spotify.com/v1/tracks/' + uriFinal);
                    // console.log(res);
                    var keyBetter = "XX"
                    switch (res.mode) {
                        case 0: // minor
                            switch (res.key) {
                                case 0: keyBetter = "5A"; break;
                                case 1: keyBetter = "12A"; break;
                                case 2: keyBetter = "7A"; break;
                                case 3: keyBetter = "2A"; break;
                                case 4: keyBetter = "9A"; break;
                                case 5: keyBetter = "4A"; break;
                                case 6: keyBetter = "11A"; break;
                                case 7: keyBetter = "6A"; break;
                                case 8: keyBetter = "1A"; break;
                                case 9: keyBetter = "8A"; break;
                                case 10: keyBetter = "3A"; break;
                                case 11: keyBetter = "10A"; break;
                                default: break;
                            } break;
                        case 1: //major
                            switch (res.key) {
                                case 0: keyBetter = "8B"; break;
                                case 1: keyBetter = "3B"; break;
                                case 2: keyBetter = "10B"; break;
                                case 3: keyBetter = "5B"; break;
                                case 4: keyBetter = "12B"; break;
                                case 5: keyBetter = "7B"; break;
                                case 6: keyBetter = "2B"; break;
                                case 7: keyBetter = "9B"; break;
                                case 8: keyBetter = "4B"; break;
                                case 9: keyBetter = "11B"; break;
                                case 10: keyBetter = "6B"; break;
                                case 11: keyBetter = "1B"; break;
                                default: break;
                            } break;
                        default: break;
                    }

                    text.classList.add("djinfo-${k}")
                    display_text = ``;
                    if (isKeyEnabled) display_text += `${keyBetter} | `;
                    if (isBPMEnabled) display_text += `${Math.round(res.tempo)} ♫ | `;
                    if (isEnergyEnabled) display_text += `E ${Math.round(100 * res.energy)} | `;
                    if (isPopularityEnabled) display_text += `♥ ${resTrack.popularity}`;
                    joiner = " | "
                    if (display_text.endsWith(joiner)) display_text = display_text.substring(0, display_text.length - joiner.length);
                    text.innerHTML = display_text;
                    text.classList.add("djinfo")
                    text.style.fontSize = "13px"
                    ratingColumn.appendChild(text)
                }

                if (!heart || !trackUri || hasdjinfo || !isTrack) continue
            }
        }
    }

    updateNowPlayingWidget = async () => {
        if (!nowPlayingWidgetdjInfoData || !isNowPlayingEnabled) return

        const getTrackUri = () => {
            return Spicetify.Player.data.track.uri
        }
        const trackUri = getTrackUri()
        const isTrack = trackUri.includes("track")

        nowPlayingWidgetdjInfoData.style.display = isTrack ? "flex" : "none"

        var request = new XMLHttpRequest();
        const uri = Spicetify.Player.data.track.uri;
        const uriFinal = uri.split(":")[2]
        const res = await CosmosAsync.get('https://api.spotify.com/v1/audio-features/' + uriFinal);
        var resTrack = await CosmosAsync.get('https://api.spotify.com/v1/tracks/' + uriFinal);
        var keyBetter = "XX"
        switch (res.mode) {
            case 0: // minor
                switch (res.key) {
                    case 0: keyBetter = "5A"; break;
                    case 1: keyBetter = "12A"; break;
                    case 2: keyBetter = "7A"; break;
                    case 3: keyBetter = "2A"; break;
                    case 4: keyBetter = "9A"; break;
                    case 5: keyBetter = "4A"; break;
                    case 6: keyBetter = "11A"; break;
                    case 7: keyBetter = "6A"; break;
                    case 8: keyBetter = "1A"; break;
                    case 9: keyBetter = "8A"; break;
                    case 10: keyBetter = "3A"; break;
                    case 11: keyBetter = "10A"; break;
                    default: break;
                } break;
            case 1: //major
                switch (res.key) {
                    case 0: keyBetter = "8B"; break;
                    case 1: keyBetter = "3B"; break;
                    case 2: keyBetter = "10B"; break;
                    case 3: keyBetter = "5B"; break;
                    case 4: keyBetter = "12B"; break;
                    case 5: keyBetter = "7B"; break;
                    case 6: keyBetter = "2B"; break;
                    case 7: keyBetter = "9B"; break;
                    case 8: keyBetter = "4B"; break;
                    case 9: keyBetter = "11B"; break;
                    case 10: keyBetter = "6B"; break;
                    case 11: keyBetter = "1B"; break;
                    default: break;
                } break;
            default: break;
        }
        display_text = ``;
        if (isKeyEnabled) display_text += `${keyBetter}<br>`;
        if (isBPMEnabled) display_text += `${Math.round(res.tempo)} ♫<br>`;
        if (isEnergyEnabled) display_text += `E ${Math.round(100 * res.energy)}<br>`;
        if (isPopularityEnabled) display_text += `♥ ${resTrack.popularity}`;
        joiner = "<br>"
        if (display_text.endsWith(joiner)) display_text = display_text.substring(0, display_text.length - joiner.length);
        nowPlayingWidgetdjInfoData.innerHTML = display_text;
        nowPlayingWidgetdjInfoData.style.fontSize = "11px";
    }

    const tracklistObserver = new MutationObserver(() => {
        updateTracklist()
    })

    Spicetify.Player.addEventListener("songchange", () => {
        updateNowPlayingWidget()
    })

    const observerCallback = async () => {
        oldTracklist = tracklist
        tracklist = document.querySelector(".main-trackList-indexable")
        if (tracklist && !tracklist.isEqualNode(oldTracklist)) {
            if (oldTracklist) {
                tracklistObserver.disconnect()
            }
            ;[pageType, id] = getPageType()
            updateTracklist()
            tracklistObserver.observe(tracklist, {
                childList: true,
                subtree: true,
            })
        }

        oldNowPlayingWidget = nowPlayingWidget
        nowPlayingWidget = document.querySelector(".main-nowPlayingWidget-nowPlaying")
        if (nowPlayingWidget && !nowPlayingWidget.isEqualNode(oldNowPlayingWidget)) {
            nowPlayingWidgetdjInfoData = document.createElement('p');
            nowPlayingWidgetdjInfoData.style.marginLeft = "4px"
            nowPlayingWidgetdjInfoData.style.marginRight = "4px"
            nowPlayingWidgetdjInfoData.style.minWidth = "34px"
            nowPlayingWidgetdjInfoData.style.fontSize = "11px"
            nowPlayingWidgetdjInfoData.style.textAlign = "center"
            const trackInfo = await waitForElement(".main-nowPlayingWidget-nowPlaying .main-trackInfo-container")
            trackInfo.after(nowPlayingWidgetdjInfoData)
            updateNowPlayingWidget()
        }
    }
    const observer = new MutationObserver(observerCallback)
    await observerCallback()
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })
})()
