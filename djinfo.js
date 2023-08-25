// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: 1.1.0
// DESCRIPTION: BPM and Energy display for each song

/// <reference path='../globals.d.ts' />

(async function djInfoList() {
  // waiting while loading
  while (!Spicetify.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const { CosmosAsync, ContextMenu, URI } = Spicetify;
  if (!(CosmosAsync && URI)) {
    setTimeout(djInfoList, 300);
    return;
  }

  // Set deafult values to InfoDisplay
  let isPlaylistEnabled = true;
  let isNowPlayingEnabled = true;
  let isLeftPlayingEnabled = false;
  let isBPMEnabled = true;
  let isKeyEnabled = true;
  let isPopularityEnabled = true;
  let isEnergyEnabled = true;
  let isDanceEnabled = false;
  let isCamelotEnabled = true;
  let isYearEnabled = false;

  // Set default values to LocalStorage
  if (Spicetify.LocalStorage.get("dj-playlists-enabled") == null) {
    Spicetify.LocalStorage.set("dj-playlists-enabled", 1);
  }
  if (Spicetify.LocalStorage.get("dj-nowplaying-enabled") == null) {
    Spicetify.LocalStorage.set("dj-nowplaying-enabled", 1);
  }
  if (Spicetify.LocalStorage.get("dj-left-playing-enabled") == null) {
    Spicetify.LocalStorage.set("dj-left-playing-enabled", 0);
  }
  if (Spicetify.LocalStorage.get("dj-bpm-enabled") == null) {
    Spicetify.LocalStorage.set("dj-bpm-enabled", 1);
  }
  if (Spicetify.LocalStorage.get("dj-key-enabled") == null) {
    Spicetify.LocalStorage.set("dj-key-enabled", 1);
  }
  if (Spicetify.LocalStorage.get("dj-popularity-enabled") == null) {
    Spicetify.LocalStorage.set("dj-popularity-enabled", 1);
  }
  if (Spicetify.LocalStorage.get("dj-energy-enabled") == null) {
    Spicetify.LocalStorage.set("dj-energy-enabled", 1);
  }
  if (Spicetify.LocalStorage.get("dj-dance-enabled") == null) {
    Spicetify.LocalStorage.set("dj-dance-enabled", 0);
  }
  if (Spicetify.LocalStorage.get("dj-year-enabled") == null) {
    Spicetify.LocalStorage.set("dj-year-enabled", 0);
  }
  if (Spicetify.LocalStorage.get("dj-camelot-enabled") == null) {
    Spicetify.LocalStorage.set("dj-camelot-enabled", 1);
  }

  // initialize css grid changes
  const fiveColumnGridCss = "[index] 16px [first] 3fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr)";
  const sixColumnGridCss = "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr)";
  const sevenColumnGridCss =
    "[index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var4] 2fr [last] minmax(120px,1fr)";

  const waitForElement = (selector) => {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };

  // Get track uri from tracklist element
  function getTracklistTrackUri(tracklistElement) {
    let values = Object.values(tracklistElement);
    if (!values) {
      console.log("Error: Could not get tracklist element");
      return null;
    }
    return (
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children[0]?.props?.uri
    );
  }

  // Get page type
  function getPageType() {
    const pathname = Spicetify.Platform.History.location.pathname;
    let matches = null;
    if (pathname === "/collection/tracks") {
      return ["LIKED_SONGS", null];
    }
    if ((matches = pathname.match(/playlist\/(.*)/))) {
      return ["PLAYLIST", matches[1]];
    }
    if ((matches = pathname.match(/album\/(.*)/))) {
      return ["ALBUM", matches[1]];
    }
    if ((matches = pathname.match(/artist\/([^/]*)$/))) {
      return ["ARTIST", matches[1]];
    }
    if ((matches = pathname.match(/artist\/([^/]*)\/saved/))) {
      return ["ARTIST_LIKED", matches[1]];
    }
    return ["OTHER", null];
  }

  let oldTracklist = null;
  let tracklist = null;
  let oldNowPlayingWidget = null;
  let nowPlayingWidget = null;
  let updateNowPlayingWidget = null;
  let updateTracklist = null;
  let nowPlayingWidgetdjInfoData = null;

  // Get LocalStorage values
  isPlaylistEnabled =
    Spicetify.LocalStorage.get("dj-playlists-enabled") == 1 || Spicetify.LocalStorage.get("dj-playlists-enabled") == null;
  isNowPlayingEnabled =
    Spicetify.LocalStorage.get("dj-nowplaying-enabled") == 1 || Spicetify.LocalStorage.get("dj-nowplaying-enabled") == null;
  isLeftPlayingEnabled = Spicetify.LocalStorage.get("dj-left-playing-enabled") == 1 || Spicetify.LocalStorage.get("dj-left-playing-enabled") == null;
  isBPMEnabled = Spicetify.LocalStorage.get("dj-bpm-enabled") == 1 || Spicetify.LocalStorage.get("dj-bpm-enabled") == null;
  isKeyEnabled = Spicetify.LocalStorage.get("dj-key-enabled") == 1 || Spicetify.LocalStorage.get("dj-key-enabled") == null;
  isPopularityEnabled =
    Spicetify.LocalStorage.get("dj-popularity-enabled") == 1 || Spicetify.LocalStorage.get("dj-popularity-enabled") == null;
  isEnergyEnabled =
    Spicetify.LocalStorage.get("dj-energy-enabled") == 1 || Spicetify.LocalStorage.get("dj-energy-enabled") == null;
  isDanceEnabled = Spicetify.LocalStorage.get("dj-dance-enabled") == 1 || Spicetify.LocalStorage.get("dj-dance-enabled") == null;
  isCamelotEnabled =
    Spicetify.LocalStorage.get("dj-camelot-enabled") == 1 || Spicetify.LocalStorage.get("dj-camelot-enabled") == null;
  isYearEnabled = Spicetify.LocalStorage.get("dj-year-enabled") == 1 || Spicetify.LocalStorage.get("dj-year-enabled") == null;

  // Add menu item and menu click handler
  const enablePlaylist = new Spicetify.Menu.Item("Enable in Playlists", isPlaylistEnabled, (item) => {
    isPlaylistEnabled = !isPlaylistEnabled;
    item.setState(isPlaylistEnabled);
    Spicetify.LocalStorage.set("dj-playlists-enabled", isPlaylistEnabled ? 1 : 0);
  });

  const enableNowPlaying = new Spicetify.Menu.Item("Enable in Now Playing", isNowPlayingEnabled, (item) => {
    isNowPlayingEnabled = !isNowPlayingEnabled;
    item.setState(isNowPlayingEnabled);
    Spicetify.LocalStorage.set("dj-nowplaying-enabled", isNowPlayingEnabled ? 1 : 0);
  });

  const enableLeftPlaying = new Spicetify.Menu.Item("Enable Left Now Playing Position", isLeftPlayingEnabled, (item) => {
    isLeftPlayingEnabled = !isLeftPlayingEnabled;
    item.setState(isLeftPlayingEnabled);
    Spicetify.LocalStorage.set("dj-nowplaying-enabled", isLeftPlayingEnabled ? 1 : 0);
  });

  const enableBPM = new Spicetify.Menu.Item("Enable BPM", isBPMEnabled, (item) => {
    isBPMEnabled = !isBPMEnabled;
    item.setState(isBPMEnabled);
    Spicetify.LocalStorage.set("dj-bpm-enabled", isBPMEnabled ? 1 : 0);
  });

  const enableKey = new Spicetify.Menu.Item("Enable Key", isKeyEnabled, (item) => {
    isKeyEnabled = !isKeyEnabled;
    item.setState(isKeyEnabled);
    Spicetify.LocalStorage.set("dj-key-enabled", isKeyEnabled ? 1 : 0);
  });

  const enablePopularity = new Spicetify.Menu.Item("Enable Popularity", isPopularityEnabled, (item) => {
    isPopularityEnabled = !isPopularityEnabled;
    item.setState(isPopularityEnabled);
    Spicetify.LocalStorage.set("dj-popularity-enabled", isPopularityEnabled ? 1 : 0);
  });

  const enableEnergy = new Spicetify.Menu.Item("Enable Energy", isEnergyEnabled, (item) => {
    isEnergyEnabled = !isEnergyEnabled;
    item.setState(isEnergyEnabled);
    Spicetify.LocalStorage.set("dj-energy-enabled", isEnergyEnabled ? 1 : 0);
  });

  const enableDance = new Spicetify.Menu.Item("Enable Danceability", isDanceEnabled, (item) => {
    isDanceEnabled = !isDanceEnabled;
    item.setState(isDanceEnabled);
    Spicetify.LocalStorage.set("dj-dance-enabled", isDanceEnabled ? 1 : 0);
  });

  const enableYear = new Spicetify.Menu.Item("Enable Year", isYearEnabled, (item) => {
    isYearEnabled = !isYearEnabled;
    item.setState(isYearEnabled);
    Spicetify.LocalStorage.set("dj-year-enabled", isYearEnabled ? 1 : 0);
  });

  const enableCamelot = new Spicetify.Menu.Item("Use Camelot", isCamelotEnabled, (item) => {
    isCamelotEnabled = !isCamelotEnabled;
    item.setState(isCamelotEnabled);
    Spicetify.LocalStorage.set("dj-camelot-enabled", isCamelotEnabled ? 1 : 0);
  });

  const reload = new Spicetify.Menu.Item("⨠ Apply Changes", false, (item) => {
    window.location.reload();
  });
  // create Submenu
  const menu = new Spicetify.Menu.SubMenu("DJ Info", [
    enablePlaylist,
    enableNowPlaying,
    enableLeftPlaying,
    enableKey,
    enableCamelot,
    enableBPM,
    enableEnergy,
    enableDance,
    enablePopularity,
    enableYear,
    reload,
  ]);
  menu.register();

  // Get the Key in the right notation from /audiofeatures response
  getKeyNotations = (res) => {
    var keyInCamelot = "XX";
    var keyInKey = "XX";
    switch (res.mode) {
      case 0: // minor
        switch (res.key) {
          case 0:
            keyInCamelot = "5A";
            keyInKey = "Cm";
            break;
          case 1:
            keyInCamelot = "12A";
            keyInKey = "Dbm";
            break;
          case 2:
            keyInCamelot = "7A";
            keyInKey = "Dm";
            break;
          case 3:
            keyInCamelot = "2A";
            keyInKey = "Ebm";
            break;
          case 4:
            keyInCamelot = "9A";
            keyInKey = "Em";
            break;
          case 5:
            keyInCamelot = "4A";
            keyInKey = "Fm";
            break;
          case 6:
            keyInCamelot = "11A";
            keyInKey = "F♯m";
            break;
          case 7:
            keyInCamelot = "6A";
            keyInKey = "Gm";
            break;
          case 8:
            keyInCamelot = "1A";
            keyInKey = "Abm";
            break;
          case 9:
            keyInCamelot = "8A";
            keyInKey = "Am";
            break;
          case 10:
            keyInCamelot = "3A";
            keyInKey = "Bbm";
            break;
          case 11:
            keyInCamelot = "10A";
            keyInKey = "Bm";
            break;
          default:
            break;
        }
        break;
      case 1: //major
        switch (res.key) {
          case 0:
            keyInCamelot = "8B";
            keyInKey = "C";
            break;
          case 1:
            keyInCamelot = "3B";
            keyInKey = "Db";
            break;
          case 2:
            keyInCamelot = "10B";
            keyInKey = "D";
            break;
          case 3:
            keyInCamelot = "5B";
            keyInKey = "Eb";
            break;
          case 4:
            keyInCamelot = "12B";
            keyInKey = "E";
            break;
          case 5:
            keyInCamelot = "7B";
            keyInKey = "F";
            break;
          case 6:
            keyInCamelot = "2B";
            keyInKey = "F♯";
            break;
          case 7:
            keyInCamelot = "9B";
            keyInKey = "G";
            break;
          case 8:
            keyInCamelot = "4B";
            keyInKey = "Ab";
            break;
          case 9:
            keyInCamelot = "11B";
            keyInKey = "A";
            break;
          case 10:
            keyInCamelot = "6B";
            keyInKey = "Bb";
            break;
          case 11:
            keyInCamelot = "1B";
            keyInKey = "B";
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    if (isCamelotEnabled && isKeyEnabled) return `${keyInKey} (${keyInCamelot})`;
    if (isCamelotEnabled) return keyInCamelot;
    return keyInKey;
  };

  // update Tracklist and insert DJ Info
  updateTracklist = async () => {
    if (!isPlaylistEnabled) return;
    const tracklists = document.getElementsByClassName("main-trackList-indexable");
    for (const tracklist_ of tracklists) {
      if (!tracklist_) continue;
      // Adding DJ Info Column Header
      const tracklistHeader = tracklist_.querySelector(".main-trackList-trackListHeaderRow");
      if (tracklistHeader && !tracklistHeader.querySelector(".djinfoheader")) {
        // No tracklist header on Artist page
        let lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
        let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));

        lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
        let headerColumn = document.createElement("div");
        headerColumn.style.display = "flex";
        headerColumn.classList.add("main-trackList-rowSectionVariable");
        headerColumn.role = "columnheader";
        tracklistHeader.insertBefore(headerColumn, lastColumn);
        switch (colIndexInt) {
          case 4:
            tracklistHeader.style["grid-template-columns"] = fiveColumnGridCss;
            break;
          case 5:
            tracklistHeader.style["grid-template-columns"] = sixColumnGridCss;
            break;
          case 6:
            tracklistHeader.style["grid-template-columns"] = sevenColumnGridCss;
            break;
          default:
            break;
        }

        var btn = document.createElement("button");
        btn.classList.add("main-trackList-column");
        btn.classList.add("main-trackList-sortable");
        btn.classList.add("djinfoheader");
        var title = document.createElement("span");
        title.classList.add("TypeElement-mesto-type");
        title.classList.add("standalone-ellipsis-one-line");
        title.innerHTML = "DJ Info";
        btn.appendChild(title);
        headerColumn.appendChild(btn);
      }

      const tracks = tracklist_.getElementsByClassName("main-trackList-trackListRow");

      for (const track of tracks) {
        const hasdjinfo = track.getElementsByClassName("djinfo").length > 0;
        const trackUri = getTracklistTrackUri(track);
        const isTrack = trackUri.includes("track");

        let djInfoColumn = track.querySelector(".djInfoList");
        if (!djInfoColumn) {
          // Add column for djInfos
          let lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
          let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
          lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
          djInfoColumn = document.createElement("div");
          djInfoColumn.setAttribute("aria-colindex", colIndexInt.toString());
          // djInfoColumn.role = "gridcell"
          djInfoColumn.style.display = "flex";
          djInfoColumn.classList.add("main-trackList-rowSectionVariable");
          djInfoColumn.classList.add("djInfoList");
          track.insertBefore(djInfoColumn, lastColumn);

          switch (colIndexInt) {
            case 4:
              track.style["grid-template-columns"] = fiveColumnGridCss;
              break;
            case 5:
              track.style["grid-template-columns"] = sixColumnGridCss;
              break;
            case 6:
              track.style["grid-template-columns"] = sevenColumnGridCss;
              break;
            default:
              break;
          }

          if (!trackUri || hasdjinfo || !isTrack) continue;
          // create the element for the djInfo
          var text = document.createElement("p");
          var uri = trackUri;
          var uriFinal = uri.split(":")[2];
          var res = await CosmosAsync.get("https://api.spotify.com/v1/audio-features/" + uriFinal);
          var resTrack = await CosmosAsync.get("https://api.spotify.com/v1/tracks/" + uriFinal);

          var key = getKeyNotations(res);

          // generate Display Text
          text.classList.add("djinfo-${k}");
          display_text = [];
          if (isKeyEnabled || isCamelotEnabled) display_text.push(`${key}`);
          if (isBPMEnabled) display_text.push(`${Math.round(res.tempo)} ♫`);
          if (isEnergyEnabled) display_text.push(`E ${Math.round(100 * res.energy)}`);
          if (isDanceEnabled) display_text.push(`D ${Math.round(100 * res.danceability)}`);
          if (isPopularityEnabled) display_text.push(`♥ ${resTrack.popularity}`);
          if (isYearEnabled) display_text.push(`${resTrack.album.release_date.split("-")[0]}`);
          display_text = display_text.join(" | ");
          text.innerHTML = display_text;
          text.classList.add("djinfo");
          text.style.fontSize = "13px";
          djInfoColumn.appendChild(text);
        }

        if (!trackUri || hasdjinfo || !isTrack) continue;
      }
    }
  };
  // Add DJ Info to Now Playing
  updateNowPlayingWidget = async () => {
    if (!nowPlayingWidgetdjInfoData || !isNowPlayingEnabled) return;
    const getTrackUri = () => {
      return Spicetify.Player.data.track.uri;
    };
    // Get the current Track
    const trackUri = getTrackUri();
    const isTrack = trackUri.includes("track");

    nowPlayingWidgetdjInfoData.style.display = isTrack ? "flex" : "none";

    // get the Infos from requests, generating a Display Text
    var request = new XMLHttpRequest();
    const uri = Spicetify.Player.data.track.uri;
    const uriFinal = uri.split(":")[2];
    const res = await CosmosAsync.get("https://api.spotify.com/v1/audio-features/" + uriFinal);
    var resTrack = await CosmosAsync.get("https://api.spotify.com/v1/tracks/" + uriFinal);
    var key = getKeyNotations(res);
    display_text = [];
    if (isKeyEnabled || isCamelotEnabled) display_text.push(`${key}`);
    if (isBPMEnabled) display_text.push(`${Math.round(res.tempo)} ♫`);
    if (isEnergyEnabled) display_text.push(`E ${Math.round(100 * res.energy)}`);
    if (isDanceEnabled) display_text.push(`D ${Math.round(100 * res.danceability)}`);
    if (isPopularityEnabled) display_text.push(`♥ ${resTrack.popularity}`);
    if (isYearEnabled) display_text.push(`${resTrack.album.release_date.split("-")[0]}`);
    display_text = display_text.join("<br>");

    nowPlayingWidgetdjInfoData.innerHTML = display_text;
    nowPlayingWidgetdjInfoData.style.fontSize = "11px";
  };

  // Observe changes in the DOM and update the tracklist
  const tracklistObserver = new MutationObserver(() => {
    updateTracklist();
  });

  // Observe changes in the DOM and update the now playing widget
  Spicetify.Player.addEventListener("songchange", () => {
    updateNowPlayingWidget();
  });

  const observerCallback = async () => {
    oldTracklist = tracklist;
    tracklist = document.querySelector(".main-trackList-indexable");
    if (tracklist && !tracklist.isEqualNode(oldTracklist)) {
      if (oldTracklist) {
        tracklistObserver.disconnect();
      }
      [pageType, id] = getPageType();
      updateTracklist();
      tracklistObserver.observe(tracklist, {
        childList: true,
        subtree: true,
      });
    }

    oldNowPlayingWidget = nowPlayingWidget;
    nowPlayingWidget = document.querySelector(".main-nowPlayingWidget-nowPlaying");
    if (nowPlayingWidget && !nowPlayingWidget.isEqualNode(oldNowPlayingWidget)) {
      nowPlayingWidgetdjInfoData = document.createElement("p");
      nowPlayingWidgetdjInfoData.style.marginLeft = "4px";
      nowPlayingWidgetdjInfoData.style.marginRight = "4px";
      nowPlayingWidgetdjInfoData.style.minWidth = "34px";
      nowPlayingWidgetdjInfoData.style.fontSize = "11px";
      nowPlayingWidgetdjInfoData.style.textAlign = "center";
      const trackInfo = await waitForElement(".main-nowPlayingWidget-nowPlaying .main-trackInfo-container");
      if (isLeftPlayingEnabled) {
        nowPlayingWidget.insertBefore(nowPlayingWidgetdjInfoData, trackInfo);
      }
      if (!isLeftPlayingEnabled) {
        trackInfo.after(nowPlayingWidgetdjInfoData);
      }
      updateNowPlayingWidget();
    }
  };
  const observer = new MutationObserver(observerCallback);
  await observerCallback();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
