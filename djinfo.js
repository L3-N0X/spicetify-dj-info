// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: 2.1.1
// DESCRIPTION: BPM and Energy display for each song

/// <reference path='../globals.d.ts' />

(async function djInfoList() {
  // waiting while loading
  while (!Spicetify.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const { CosmosAsync, ContextMenu, URI, React: react, ReactDOM: reactDOM } = Spicetify;
  const { useState, useEffect } = react;
  if (!(CosmosAsync && URI)) {
    setTimeout(djInfoList, 300);
    return;
  }

  let CONFIG;
  try {
    CONFIG = JSON.parse(Spicetify.LocalStorage.get("dj-info-config") || "error");
  } catch {
    CONFIG = {
      isPlaylistEnabled: true,
      isNowPlayingEnabled: true,
      isLeftPlayingEnabled: false,
      isRecommendationsEnabled: true,
      isBPMEnabled: true,
      isKeyEnabled: false,
      isCamelotEnabled: true,
      isPopularityEnabled: true,
      isEnergyEnabled: true,
      isDanceEnabled: false,
      isYearEnabled: false,
    };
  }

  const DisplayIcon = ({ icon, size }) => {
    return react.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 16 16",
      fill: "currentColor",
      dangerouslySetInnerHTML: {
        __html: icon,
      },
    });
  };

  // initialize css grid changes
  const fourColumnGridCss =
    "grid-template-columns: [first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr) !important";
  const fiveColumnGridCss =
    "grid-template-columns: [index] 16px [first] 3fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr) !important";
  const sixColumnGridCss =
    "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] 2fr [last] minmax(120px,1fr) !important";
  const sevenColumnGridCss =
    "grid-template-columns: [index] 16px [first] 5fr [var1] 3fr [var2] 2fr [var3] minmax(120px,1fr) [var4] 2fr [last] minmax(120px,1fr) !important";

  const recommendationColumnGridCss =
    "grid-template-columns: [first] 3fr [var1] 1fr [var2] 0px [var3] 1fr [last] minmax(120px,1fr) !important";

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
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.children?.props
        ?.uri ||
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

  let tracklistArr = null;
  let oldTracklistArr = null;
  let oldNowPlayingWidget = null;
  let nowPlayingWidget = null;
  let updateNowPlayingWidget = null;
  let updateTracklist = null;
  let nowPlayingWidgetdjInfoData = null;
  let recommendations = null;
  let toprecommendation = null;
  let oldRecommendations = null;

  function saveConfig() {
    Spicetify.LocalStorage.set("dj-info-config", JSON.stringify(CONFIG));
  }

  const ConfigItem = ({ name, field, func, disabled = false }) => {
    const [value, setValue] = useState(CONFIG[field]);
    return react.createElement(
      "div",
      { className: "setting-row" },
      react.createElement("label", { className: "col description" }, name),
      react.createElement(
        "div",
        { className: "col action" },
        react.createElement(
          "button",
          {
            className: "switch" + (value ? "" : " disabled"),
            disabled,
            onClick: () => {
              const state = !value;
              CONFIG[field] = state;
              setValue(state);
              saveConfig();
            },
          },
          react.createElement(DisplayIcon, {
            icon: Spicetify.SVGIcons.check,
            size: 16,
          })
        )
      )
    );
  };

  const reloadItem = ({ name, disabled = false }) => {
    return react.createElement(
      "div",
      { className: "setting-row" },
      react.createElement("label", { className: "col description" }, name),
      react.createElement(
        "div",
        { className: "col action" },
        react.createElement(
          "button",
          {
            className: "btn",
            disabled,
            onClick: () => {
              window.location.reload();
            },
          },
          "Reload"
        )
      )
    );
  };

  function openConfig() {
    const style = react.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `
.setting-row::after {
    content: "";
    display: table;
    clear: both;
    border-radius: 4px;
}
.setting-row .col {
    display: flex;
    padding: 10px 0;
    align-items: center;
}
.setting-row .col.description {
    float: left;
    padding-right: 15px;
    color: var(--spice-text);
}
.setting-row .col.action {
    float: right;
    text-align: right;
}
h1.main-type-alto {
  color: var(--spice-text);
}
button.switch {
    align-items: center;
    border: 0px;
    border-radius: 50%;
    background-color: rgba(var(--spice-rgb-shadow), .7);
    color: var(--spice-text);
    cursor: pointer;
    display: flex;
    margin-inline-start: 12px;
    padding: 8px;
}
button.switch.disabled,
button.switch[disabled] {
    color: rgba(var(--spice-rgb-text), .3);
}
button.btn {
    font-weight: 700;
    font-size: medium;
    background-color: transparent;
    border-radius: 24px;
    transition-duration: 33ms;
    transition-property: background-color, border-color, color, box-shadow, filter, transform;
    padding-inline: 15px;
    border: 1px solid #727272;
    color: var(--spice-text);
    min-block-size: 32px;
    cursor: pointer;
}
button.btn:hover {
    transform: scale(1.04);
    border-color: var(--spice-text);
}
`,
      },
    });
    let configContainer = react.createElement(
      "div",
      null,
      style,
      react.createElement(ConfigItem, {
        name: "Enable in Playlists",
        field: "isPlaylistEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable in Now Playing",
        field: "isNowPlayingEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Display Info on Left Side in Now Playing",
        field: "isLeftPlayingEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable in Recommendations",
        field: "isRecommendationsEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable BPM",
        field: "isBPMEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Key (Standard Notation)",
        field: "isKeyEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Key (Camelot Notation)",
        field: "isCamelotEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Popularity",
        field: "isPopularityEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Energy",
        field: "isEnergyEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Danceability",
        field: "isDanceEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Year",
        field: "isYearEnabled",
      }),
      react.createElement(reloadItem, {
        name: "Reload Window to apply changes",
      })
    );
    Spicetify.PopupModal.display({
      title: "DJ Info Settings",
      content: configContainer,
    });
  }
  new Spicetify.Menu.Item(
    "DJ Info Settings",
    false,
    openConfig,
    `<svg viewBox="0 0 24 24" width="16" heigth="16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="currentcolor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z" fill="currentcolor"></path> </g></svg>`
  ).register();

  // Get the Key in the right notation from /audiofeatures response
  getKeyInNotation = (key, mode) => {
    var keyInCamelot = "XX";
    var keyInStandard = "XX";
    switch (mode) {
      case 0: // minor
        switch (key) {
          case 0:
            keyInCamelot = "5A";
            keyInStandard = "Cm";
            break;
          case 1:
            keyInCamelot = "12A";
            keyInStandard = "Dbm";
            break;
          case 2:
            keyInCamelot = "7A";
            keyInStandard = "Dm";
            break;
          case 3:
            keyInCamelot = "2A";
            keyInStandard = "Ebm";
            break;
          case 4:
            keyInCamelot = "9A";
            keyInStandard = "Em";
            break;
          case 5:
            keyInCamelot = "4A";
            keyInStandard = "Fm";
            break;
          case 6:
            keyInCamelot = "11A";
            keyInStandard = "F♯m";
            break;
          case 7:
            keyInCamelot = "6A";
            keyInStandard = "Gm";
            break;
          case 8:
            keyInCamelot = "1A";
            keyInStandard = "Abm";
            break;
          case 9:
            keyInCamelot = "8A";
            keyInStandard = "Am";
            break;
          case 10:
            keyInCamelot = "3A";
            keyInStandard = "Bbm";
            break;
          case 11:
            keyInCamelot = "10A";
            keyInStandard = "Bm";
            break;
          default:
            break;
        }
        break;
      case 1: //major
        switch (key) {
          case 0:
            keyInCamelot = "8B";
            keyInStandard = "C";
            break;
          case 1:
            keyInCamelot = "3B";
            keyInStandard = "Db";
            break;
          case 2:
            keyInCamelot = "10B";
            keyInStandard = "D";
            break;
          case 3:
            keyInCamelot = "5B";
            keyInStandard = "Eb";
            break;
          case 4:
            keyInCamelot = "12B";
            keyInStandard = "E";
            break;
          case 5:
            keyInCamelot = "7B";
            keyInStandard = "F";
            break;
          case 6:
            keyInCamelot = "2B";
            keyInStandard = "F♯";
            break;
          case 7:
            keyInCamelot = "9B";
            keyInStandard = "G";
            break;
          case 8:
            keyInCamelot = "4B";
            keyInStandard = "Ab";
            break;
          case 9:
            keyInCamelot = "11B";
            keyInStandard = "A";
            break;
          case 10:
            keyInCamelot = "6B";
            keyInStandard = "Bb";
            break;
          case 11:
            keyInCamelot = "1B";
            keyInStandard = "B";
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    if (CONFIG.isCamelotEnabled && CONFIG.isKeyEnabled)
      return `${keyInStandard}&nbsp;(${keyInCamelot})`; // if both are enabled return both
    if (CONFIG.isCamelotEnabled) return keyInCamelot; // else if only camelot is enabled return camelot
    return keyInStandard; // else return key in standard notation
  };

  var djTrackInfo = class {
    // Class for DJ Info in local storage
    constructor(res, resTrack) {
      this.key = res.key;
      this.mode = res.mode;
      this.tempo = Math.round(res.tempo);
      this.energy = Math.round(100 * res.energy);
      this.danceability = Math.round(100 * res.danceability);
      this.popularity = resTrack.popularity;
      this.release_date = resTrack.album.release_date.split("-")[0];
    }
  };

  getTrackInfo = async (id) => {
    // get Track Info from local storage or request
    const djTrackInfoFromLocal = localStorage.getItem("djinfo-" + id);
    if (djTrackInfoFromLocal != null) {
      return JSON.parse(djTrackInfoFromLocal);
    }
    var res = await CosmosAsync.get("https://api.spotify.com/v1/audio-features/" + id);
    var resTrack = await CosmosAsync.get("https://api.spotify.com/v1/tracks/" + id);
    var info = new djTrackInfo(res, resTrack);
    localStorage.setItem("djinfo-" + id, JSON.stringify(info));
    return info;
  };

  // update Tracklist and insert DJ Info
  updateTracklist = async () => {
    if (!CONFIG.isPlaylistEnabled) return;
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
            tracklistHeader.setAttribute("style", fiveColumnGridCss);
            break;
          case 5:
            tracklistHeader.setAttribute("style", sixColumnGridCss);
            break;
          case 6:
            tracklistHeader.setAttribute("style", sevenColumnGridCss);
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
            case 3:
              track.setAttribute("style", fourColumnGridCss);
              break;
            case 4:
              track.setAttribute("style", fiveColumnGridCss);
              break;
            case 5:
              track.setAttribute("style", sixColumnGridCss);
              break;
            case 6:
              track.setAttribute("style", sevenColumnGridCss);
              break;
            default:
              break;
          }

          if (!trackUri || hasdjinfo || !isTrack) continue;
          // create the element for the djInfo
          var text = document.createElement("p");
          var uri = trackUri;
          var id = uri.split(":")[2]; // get Track id
          var info = await getTrackInfo(id); // get Infos for Track from local or request
          var keyInNotation = getKeyInNotation(info.key, info.mode);
          // generate Display Text
          display_text = [];
          if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) display_text.push(`${keyInNotation}`);
          if (CONFIG.isBPMEnabled) display_text.push(`${info.tempo} ♫`);
          if (CONFIG.isEnergyEnabled) display_text.push(`E ${info.energy}`);
          if (CONFIG.isDanceEnabled) display_text.push(`D ${info.danceability}`);
          if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${info.popularity}`);
          if (CONFIG.isYearEnabled) display_text.push(`${info.release_date}`);
          display_text = display_text.join(" | ");
          text.innerHTML = display_text;
          text.classList.add("djinfo");
          text.style.fontSize = "12px";
          djInfoColumn.appendChild(text);
        }
      }
    }
  };

  updateRecommendations = async () => {
    if (!CONFIG.isRecommendationsEnabled) return;
    if (!recommendations) {
      console.log("no recommendations found");
      return;
    }
    const tracklists = recommendations.getElementsByClassName("main-trackList-trackList");
    for (const tracklist_ of tracklists) {
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
          let unusedColumn = track.querySelector(`[aria-colindex="${colIndexInt - 1}"]`);
          if (unusedColumn) {
            track.removeChild(unusedColumn);
            colIndexInt--;
          }
          lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
          djInfoColumn = document.createElement("div");
          djInfoColumn.setAttribute("aria-colindex", colIndexInt.toString());
          // djInfoColumn.role = "gridcell"
          djInfoColumn.style.display = "flex";
          djInfoColumn.style.justifyContent = "center";
          djInfoColumn.style.width = "100%";
          djInfoColumn.classList.add("main-trackList-rowSectionVariable");
          djInfoColumn.classList.add("djInfoList");
          track.insertBefore(djInfoColumn, lastColumn);

          switch (colIndexInt) {
            case 4:
              track.setAttribute("style", recommendationColumnGridCss);
              break;
          }

          if (!trackUri || hasdjinfo || !isTrack) continue;
          // create the element for the djInfo
          var text = document.createElement("p");
          var uri = trackUri;

          var id = uri.split(":")[2]; // get Track id
          var info = await getTrackInfo(id); // get Infos for Track from local or request
          var keyInNotation = getKeyInNotation(info.key, info.mode);
          // generate Display Text
          display_text = [];
          if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) display_text.push(`${keyInNotation}`);
          if (CONFIG.isBPMEnabled) display_text.push(`${info.tempo} ♫`);
          if (CONFIG.isEnergyEnabled) display_text.push(`E ${info.energy}`);
          if (CONFIG.isDanceEnabled) display_text.push(`D ${info.danceability}`);
          if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${info.popularity}`);
          if (CONFIG.isYearEnabled) display_text.push(`${info.release_date}`);
          display_text = display_text.join(" | ");
          text.innerHTML = display_text;
          text.classList.add("djinfo");
          text.style.fontSize = "12px";
          djInfoColumn.appendChild(text);
        }
      }
    }
  };

  // Add DJ Info to Now Playing
  updateNowPlayingWidget = async () => {
    if (!nowPlayingWidgetdjInfoData || !CONFIG.isNowPlayingEnabled) return;
    const getTrackUri = () => {
      return Spicetify.Player.data.item.uri;
    };
    // Get the current Track
    const trackUri = getTrackUri();
    const isTrack = trackUri.includes("track");

    nowPlayingWidgetdjInfoData.style.display = isTrack ? "flex" : "none";

    // get the Infos from requests, generating a Display Text
    const uri = Spicetify.Player.data.item.uri;
    const id = uri.split(":")[2];
    var info = await getTrackInfo(id);
    display_text = [];
    if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled)
      display_text.push(`${getKeyInNotation(info.key, info.mode)}`);
    if (CONFIG.isBPMEnabled) display_text.push(`${info.tempo} ♫`);
    if (CONFIG.isEnergyEnabled) display_text.push(`E ${info.energy}`);
    if (CONFIG.isDanceEnabled) display_text.push(`D ${info.danceability}`);
    if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${info.popularity}`);
    if (CONFIG.isYearEnabled) display_text.push(`${info.release_date}`);
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
    oldTracklistArr = tracklistArr;
    tracklistArr = document.getElementsByClassName("main-trackList-indexable");
    var i = 0;
    for (tracklist of tracklistArr) {
      i++;
      if (tracklist && !tracklist.isEqualNode(oldTracklistArr[i])) {
        if (oldTracklistArr[i]) {
          tracklistObserver.disconnect();
        }
        [pageType, id] = getPageType();
        updateTracklist();
        tracklistObserver.observe(tracklist, {
          childList: true,
          subtree: true,
        });
      }
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
      const trackInfo = await waitForElement(
        ".main-nowPlayingWidget-nowPlaying .main-trackInfo-container"
      );
      if (CONFIG.isLeftPlayingEnabled) {
        nowPlayingWidget.insertBefore(nowPlayingWidgetdjInfoData, trackInfo);
      } else {
        trackInfo.after(nowPlayingWidgetdjInfoData);
      }
      updateNowPlayingWidget();
    }

    oldRecommendation = toprecommendation;
    recommendations = document.getElementsByClassName("playlist-playlist-recommendedTrackList")[0];
    if (recommendations) {
      toprecommendation = recommendations.getElementsByClassName("main-trackList-trackListRow")[0];
      if (toprecommendation && !toprecommendation.isEqualNode(oldRecommendation)) {
        console.log("recommendations found");
        updateRecommendations();
      }
    }
  };
  const observer = new MutationObserver(observerCallback);
  await observerCallback();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
