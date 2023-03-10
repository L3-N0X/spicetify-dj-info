// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: 1.0.0
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

    let isPlaylistEnabled;
    let isNowPlayingEnabled;

    const fiveColumnGridCss = "[index] 16px [first] 3fr [var1] 2fr [var2] 3fr [last] minmax(120px,1fr)"
    const sixColumnGridCss = "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 3fr [last] minmax(120px,1fr)"
    const sevenColumnGridCss = "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var3] 3fr [last] minmax(120px,1fr)"

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

    isPlaylistEnabled = Spicetify.LocalStorage.get("dj-playlists-enabled") === "true" || Spicetify.LocalStorage.get("dj-playlists-enabled") === null;
    isNowPlayingEnabled = Spicetify.LocalStorage.get("dj-nowplaying-enabled") === "true" || Spicetify.LocalStorage.get("dj-nowplaying-enabled") === null;

    // Add menu item and menu click handler
    const enablePlaylist = new Spicetify.Menu.Item(
        "Enable in Playlists",
        isPlaylistEnabled,
        (item) => {
            isPlaylistEnabled = !isPlaylistEnabled;
            item.setState(isPlaylistEnabled);
            Spicetify.LocalStorage.set("dj-playlists-enabled", isPlaylistEnabled ? "true" : "false");
            location.reload();
        }
    );

    const enableNowPlaying = new Spicetify.Menu.Item(
        "Enable in Now Playing",
        isNowPlayingEnabled,
        (item) => {
            isNowPlayingEnabled = !isNowPlayingEnabled;
            item.setState(isNowPlayingEnabled);
            Spicetify.LocalStorage.set("dj-nowplaying-enabled", isNowPlayingEnabled ? "true" : "false");
            location.reload();
        }
    );

    const menu = new Spicetify.Menu.SubMenu("DJ Info", [enablePlaylist, enableNowPlaying]);
    menu.register();

    updateTracklist = async () => {
        const tracklist_ = document.querySelector(".main-trackList-indexable")
        if (!tracklist_ || !isPlaylistEnabled) return
        const tracks = tracklist_.getElementsByClassName("main-trackList-trackListRow")

        const tracklistHeader = document.querySelector(".main-trackList-trackListHeaderRow")
        // No tracklist header on Artist page
        if (tracklistHeader) {
            let lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd")
            let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"))

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
        }
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

                text.innerHTML = `KEY: ${keyBetter} | ${Math.round(res.tempo)} BPM | E: ${Math.round(100 * res.energy)}%`;
                text.classList.add("djinfo-${k}")
                text.classList.add("djinfo")
                text.style.fontSize = "12px"
                ratingColumn.appendChild(text)
            }

            if (!heart || !trackUri || hasdjinfo || !isTrack) continue
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
        nowPlayingWidgetdjInfoData.innerHTML = `KEY ${keyBetter}<br>${Math.round(res.tempo)} BPM<br>E ${Math.round(100 * res.energy)}%`;
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
            nowPlayingWidgetdjInfoData.style.minWidth = "44px"
            nowPlayingWidgetdjInfoData.style.fontSize = "11px"
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
