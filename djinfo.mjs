// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: 2.3.1
// DESCRIPTION: BPM and Energy display for each song

/// <reference path="../globals.d.ts" />

const extendedMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        request: { type: "Request", id: 2, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        country: { type: "string", id: 1 },
        catalogue: { type: "string", id: 2 },
        task_id: { type: "bytes", id: 3 },
      },
    },
    Request: {
      fields: {
        entity_uri: { type: "string", id: 1 },
        query: { type: "Query", id: 2 },
      },
    },
    Query: {
      fields: {
        extension_kind: { type: "uint32", id: 1 },
      },
    },
  },
};

const audioFeaturesJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        extension_kind: { type: "uint32", id: 2 },
        response: { type: "Response", id: 3, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    Response: {
      fields: {
        info: { type: "ResponseInfo", id: 1 },
        track: { type: "string", id: 2 },
        attributes: { type: "AudioAttributesWrapper", id: 3, rule: "optional" },
      },
    },
    ResponseInfo: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    AudioAttributesWrapper: {
      fields: {
        typestr: { type: "string", id: 1 },
        attributes: { type: "AudioAttributes", id: 2 },
      },
    },
    AudioAttributes: {
      fields: {
        bpm: { type: "double", id: 1 },
        key: { type: "Key", id: 2 },
      },
    },
    Key: {
      fields: {
        key: { type: "string", id: 1 },
        majorMinor: { type: "uint32", id: 2 },
        camelot: { type: "CamelotKey", id: 3 },
      },
    },
    CamelotKey: {
      fields: {
        key: { type: "string", id: 1 },
        backgroundColor: { type: "string", id: 2 },
      },
    },
  },
};

const trackMetadataJsonDescriptor = {
  nested: {
    Message: {
      fields: {
        header: { type: "Header", id: 1 },
        extension_kind: { type: "uint32", id: 2 },
        response: { type: "Response", id: 3, rule: "repeated" },
      },
    },
    Header: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    Response: {
      fields: {
        info: { type: "ResponseInfo", id: 1 },
        track: { type: "string", id: 2 },
        metadata: { type: "TrackMetadataWrapper", id: 3, rule: "optional" },
      },
    },
    ResponseInfo: {
      fields: {
        status: { type: "uint32", id: 1 },
      },
    },
    TrackMetadataWrapper: {
      fields: {
        typestr: { type: "string", id: 1 },
        metadata: { type: "TrackMetadata", id: 2 },
      },
    },
    TrackMetadata: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
        album: { type: "AlbumMetadata", id: 3 },
        artist: { type: "Artist", id: 4, rule: "repeated" },
        track_num: { type: "sint32", id: 5 },
        disc_num: { type: "sint32", id: 6 },
        duration_ms: { type: "sint32", id: 7 },
        popularity: { type: "sint32", id: 8 },
      },
    },
    AlbumMetadata: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
        artist: { type: "Artist", id: 3, rule: "repeated" },
        release_date: { type: "Date", id: 6, rule: "optional" },
      },
    },
    Artist: {
      fields: {
        gid: { type: "bytes", id: 1 },
        name: { type: "string", id: 2 },
      },
    },
    Date: {
      fields: {
        year: { type: "sint32", id: 1 },
        month: { type: "sint32", id: 2, rule: "optional" },
        day: { type: "sint32", id: 3, rule: "optional" },
      },
    },
  },
};

const extendedMetadataRequest = protobuf.Root.fromJSON(extendedMetadataJsonDescriptor).lookup(
  "Message"
);
const audioFeaturesResponse = protobuf.Root.fromJSON(audioFeaturesJsonDescriptor).lookup("Message");
const trackMetadataResponse = protobuf.Root.fromJSON(trackMetadataJsonDescriptor).lookup("Message");

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

  const STYLE_ID = "dj-info-styles";
  let globalStyle = document.getElementById(STYLE_ID);
  if (!globalStyle) {
    globalStyle = document.createElement("style");
    globalStyle.id = STYLE_ID;
    document.head.appendChild(globalStyle);
  }
  globalStyle.innerHTML = `
    @keyframes djInfoFadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .djinfo-animate {
      animation: djInfoFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
    .dj-info-classic-container {
      display: grid;
      align-items: center;
      width: 100%;
    }
    .djInfoList {
      min-width: 0;
    }
    .dj-info-classic-item {
      display: block;
      font-size: 13px;
      white-space: nowrap;
      padding: 0 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .dj-info-classic-separator {
      opacity: 0.4;
      font-size: 8px;
      margin: 0 2px;
      display: inline-block;
    }
    .dj-info-grid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      line-height: normal;
      padding-left: 8px;
    }
    .dj-info-row-top {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
      font-weight: 500;
      font-size: 13px;
    }
    .dj-info-row-bottom {
      display: flex;
      align-items: center;
      gap: 0px;
      font-size: 11px;
      opacity: 0.8;
    }
    .dj-info-separator {
      opacity: 0.6;
      font-size: 0.8em;
      padding: 0 4px;
    }
    .dj-info-tag {
      padding: 1px 6px;
      border-radius: 4px;
      color: #000;
      font-weight: 700;
      font-size: 11px;
      text-shadow: none;
    }
    
    :root {
      --camelot-1A: #00D3AA;
      --camelot-1B: #00CC33;
      --camelot-2A: #00E072;
      --camelot-2B: #78E600;
      --camelot-3A: #60E916;
      --camelot-3B: #BFD700;
      --camelot-4A: #C3EC00;
      --camelot-4B: #EBD100;
      --camelot-5A: #F0E100;
      --camelot-5B: #FFC000;
      --camelot-6A: #FFC900;
      --camelot-6B: #FF8D00;
      --camelot-7A: #FFA900;
      --camelot-7B: #EF5524;
      --camelot-8A: #FF7C00;
      --camelot-8B: #FF354C;
      --camelot-9A: #E24F21;
      --camelot-9B: #D81C65;
      --camelot-10A: #C83036;
      --camelot-10B: #A22888;
      --camelot-11A: #982257;
      --camelot-11B: #561F9B;
      --camelot-12A: #5A1C81;
      --camelot-12B: #0096C6;
    }

    .camelot-key-1A { background-color: var(--camelot-1A); }
    .camelot-key-1B { background-color: var(--camelot-1B); }
    .camelot-key-2A { background-color: var(--camelot-2A); }
    .camelot-key-2B { background-color: var(--camelot-2B); }
    .camelot-key-3A { background-color: var(--camelot-3A); }
    .camelot-key-3B { background-color: var(--camelot-3B); }
    .camelot-key-4A { background-color: var(--camelot-4A); }
    .camelot-key-4B { background-color: var(--camelot-4B); }
    .camelot-key-5A { background-color: var(--camelot-5A); }
    .camelot-key-5B { background-color: var(--camelot-5B); }
    .camelot-key-6A { background-color: var(--camelot-6A); }
    .camelot-key-6B { background-color: var(--camelot-6B); }
    .camelot-key-7A { background-color: var(--camelot-7A); }
    .camelot-key-7B { background-color: var(--camelot-7B); }
    .camelot-key-8A { background-color: var(--camelot-8A); }
    .camelot-key-8B { background-color: var(--camelot-8B); }
    .camelot-key-9A { background-color: var(--camelot-9A); }
    .camelot-key-9B { background-color: var(--camelot-9B); }
    .camelot-key-10A { background-color: var(--camelot-10A); }
    .camelot-key-10B { background-color: var(--camelot-10B); }
    .camelot-key-11A { background-color: var(--camelot-11A); }
    .camelot-key-11B { background-color: var(--camelot-11B); }
    .camelot-key-12A { background-color: var(--camelot-12A); }
    .camelot-key-12B { background-color: var(--camelot-12B); }
  `;

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
      isEnergyEnabled: false,
      isDanceEnabled: false,
      isYearEnabled: true,
      isRichUiEnabled: true,
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

  const recommendationGridCss = "[index] 16px [first] 4fr [var1] 2fr [var2] 1fr [last] 1fr";

  // initialize css grid changes
  const fourColumnGridCss =
    "[index] 16px [first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr)";
  const fiveColumnGridCss =
    "[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)";
  const sixColumnGridCss =
    "[index] 16px [first] 6fr [var1] 4fr [var2] max-content [var3] 4fr [last] minmax(120px,1fr)";
  const sevenColumnGridCss =
    "[index] 16px [first] 6fr [var1] 3fr [var2] 2fr [var3] max-content [var4] 4fr [last] minmax(120px,1fr)";

  // Compact grid definitions for Rich UI
  const richFourColumnGridCss =
    "[index] 16px [first] 4fr [var1] 2fr [var2] 2fr [last] minmax(120px,1fr)";
  const richFiveColumnGridCss =
    "[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)";
  const richSixColumnGridCss =
    "[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [var3] 3fr [last] minmax(120px,1fr)";
  const richSevenColumnGridCss =
    "[index] 16px [first] 6fr [var1] 3fr [var2] 2fr [var3] max-content [var4] 2fr [last] minmax(120px,1fr)";

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

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  if (window.djInfoObserver) {
    window.djInfoObserver.disconnect();
  }
  const trackIntersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const track = entry.target;
          const isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
          addInfoToTrack(track, isRecommendation);
          trackIntersectionObserver.unobserve(track);
        }
      });
    },
    { rootMargin: "200px" }
  );
  window.djInfoObserver = trackIntersectionObserver;

  // Get track uri from tracklist element
  function getTracklistTrackUri(tracklistElement) {
    let values = Object.values(tracklistElement);
    if (!values.length) {
      console.log("Error: Could not get tracklist element");
      return null;
    }
    return (
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children?.props?.children?.props?.children?.props
        ?.uri ||
      values[0]?.pendingProps?.children[0]?.props?.children[0]?.props?.uri ||
      values[0]?.pendingProps?.children?.props?.value?.item?.uri ||
      values[0]?.pendingProps?.children?.props?.children?.props?.value?.item?.uri ||
      values[0]?.pendingProps?.children?.props?.children?.props?.children?.props?.value?.item?.uri
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

  let oldNowPlayingWidget = null;
  let nowPlayingWidget = null;
  let updateNowPlayingWidget = null;
  let nowPlayingWidgetdjInfoData = null;

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
        name: "Enable Year",
        field: "isYearEnabled",
      }),
      react.createElement(ConfigItem, {
        name: "Enable Rich UI",
        field: "isRichUiEnabled",
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
    `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="currentcolor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z" fill="currentcolor"></path> </g></svg>`
  ).register();

  // Get the Key in the right notation from /audiofeatures response
  const getKeyInNotation = (key, mode) => {
    const keyInCamelot =
      key < 0 || mode < 0 ? "XX" : ((7 * key + [4, 7][mode]) % 12) + 1 + "AB"[mode];
    const keyInStandard =
      key < 0 ? "XX" : "C Db D Eb E F F♯ G Ab A Bb B".split(" ")[key] + ["m", "", "?"].at(mode);
    if (CONFIG.isCamelotEnabled) {
      if (CONFIG.isKeyEnabled) {
        return `${keyInStandard}\u00a0(${keyInCamelot})`; // if both are enabled return both
      }
      return keyInCamelot; // else if only camelot is enabled return camelot
    }
    return keyInStandard; // else return key in standard notation
  };

  const djTrackInfo = class {
    // Class for DJ Info object structure
    static fromQueries(res, resTrack) {
      return {
        key: res.key,
        mode: res.mode,
        tempo: Math.round(res.tempo),
        energy: Math.round(100 * res.energy),
        danceability: Math.round(100 * res.danceability),
        popularity: resTrack.popularity,
        release_date: resTrack.release_date.split("-")[0],
      };
    }
  };

  const trackInfoQueue = new Map();
  let trackInfoTimeout = null;
  const trackDb = {}; // In-memory cache

  const idb = {
    db: null,
    initPromise: null,
    init: () => {
      if (idb.initPromise) return idb.initPromise;
      idb.initPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open("dj-info-idb", 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("tracks")) {
            db.createObjectStore("tracks", { keyPath: "id" });
          }
        };
        request.onsuccess = (event) => {
          idb.db = event.target.result;
          resolve();
        };
        request.onerror = (event) => {
          console.error("DJ Info: IndexedDB error", event);
          reject(event);
        };
      });
      return idb.initPromise;
    },
    get: async (id) => {
      if (!idb.db) await idb.init();
      return new Promise((resolve) => {
        const transaction = idb.db.transaction(["tracks"], "readonly");
        const store = transaction.objectStore("tracks");
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result?.val || null);
        request.onerror = () => resolve(null);
      });
    },
    getMany: async (ids) => {
      // Helper to get multiple items
      if (!idb.db) await idb.init();
      return new Promise((resolve) => {
        const transaction = idb.db.transaction(["tracks"], "readonly");
        const store = transaction.objectStore("tracks");
        const results = [];
        let completed = 0;

        if (ids.length === 0) return resolve([]);

        ids.forEach((id) => {
          const request = store.get(id);
          request.onsuccess = () => {
            if (request.result?.val) results.push({ id, val: request.result.val });
            completed++;
            if (completed === ids.length) resolve(results);
          };
          request.onerror = () => {
            completed++;
            if (completed === ids.length) resolve(results);
          };
        });
      });
    },
    setMany: async (items) => {
      // items: [{id, val}]
      if (!idb.db) await idb.init();
      return new Promise((resolve) => {
        const transaction = idb.db.transaction(["tracks"], "readwrite");
        const store = transaction.objectStore("tracks");
        items.forEach((item) => store.put({ id: item.id, val: item.val }));
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => resolve();
      });
    },
  };

  // Migration from LocalStorage to IndexedDB
  async function migrateLocalStorage() {
    const LS_KEY = "dj-info-tracks";
    const rawData = Spicetify.LocalStorage.get(LS_KEY);
    if (!rawData) return;

    console.log("DJ Info: Migrating LocalStorage to IndexedDB...");
    try {
      const oldDb = JSON.parse(rawData);
      const itemsToStore = [];

      // Helper to parse old CSV format
      const fromOldFormat = (obj) => {
        if (typeof obj === "string") {
          const [key, mode, tempo, energy, danceability, popularity, release_date] = obj
            .split(",")
            .map((x) => (x === "" ? null : +x));
          return { key, mode, tempo, energy, danceability, popularity, release_date };
        }
        return obj;
      };

      Object.keys(oldDb).forEach((id) => {
        const val = fromOldFormat(oldDb[id]);
        if (val) itemsToStore.push({ id, val });
      });

      if (itemsToStore.length > 0) {
        await idb.setMany(itemsToStore);
        console.log(`DJ Info: Migrated ${itemsToStore.length} tracks.`);
      }

      Spicetify.LocalStorage.remove(LS_KEY);
      console.log("DJ Info: LocalStorage cleaned.");
    } catch (e) {
      console.error("DJ Info: Migration failed", e);
    }
  }

  // Initialize DB and Run Migration
  idb.init().then(migrateLocalStorage);

  function cleanupOldStorage() {
    const keysToRemove = [];
    for (let i = 0; i < Spicetify.LocalStorage.length; i++) {
      const key = Spicetify.LocalStorage.key(i);
      if (key.startsWith("djinfo-") && key !== "dj-info-config") {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => Spicetify.LocalStorage.remove(key));
    if (keysToRemove.length > 0) {
      console.log("DJ Info: Cleaned up old/legacy keys.");
    }
  }

  cleanupOldStorage();

  const productStateValues = await Spicetify.Platform.ProductStateAPI.getValues();
  const country = productStateValues["country"] ?? "US";
  const catalogue = productStateValues["catalogue"] ?? "premium";

  const getExtendedMetadata = async (entity_uris, extension_kind) => {
    const task_id = new Uint8Array(16);
    crypto.getRandomValues(task_id);
    const payload = extendedMetadataRequest
      .encode({
        header: { country, catalogue, task_id },
        request: entity_uris.map((entity_uri) => ({ entity_uri, query: { extension_kind } })),
      })
      .finish();

    const resp = await fetch(
      "https://spclient.wg.spotify.com/extended-metadata/v0/extended-metadata",
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/protobuf",
          Authorization: `Bearer ${
            Spicetify.Platform.AuthorizationAPI.getState().token.accessToken
          }`,
          "Spotify-App-Version": Spicetify.Platform.version,
          "App-Platform": Spicetify.Platform.PlatformData.app_platform,
        },
        timeout: 1000 * 15,
      }
    );

    return new Uint8Array(await resp.arrayBuffer());
  };

  const getFeatures = async (ids) => {
    const buf = await getExtendedMetadata(
      ids.map((id) => `spotify:track:${id}`),
      222
    );
    const msg = audioFeaturesResponse.decode(buf);

    return msg.response.map((resp) => {
      if (!resp.attributes) return null;
      const attributes = resp.attributes.attributes;
      return {
        id: resp.track.split(":")[2],
        tempo: attributes.bpm,
        key: "C C# D D# E F F# G G# A A# B".split(" ").indexOf(attributes.key.key),
        mode: attributes.key.majorMinor - 1,
      };
    });
  };

  const getTrackFeatures = async (ids) => {
    const buf = await getExtendedMetadata(
      ids.map((id) => `spotify:track:${id}`),
      10
    );
    const msg = trackMetadataResponse.decode(buf);

    return msg.response.map((resp) => {
      if (!resp.metadata) return null;
      const metadata = resp.metadata.metadata;
      const date = metadata.album.release_date;
      const date_iso = `${date?.year}-${(date?.month + "").padStart(2, "0")}-${(
        date?.day + ""
      ).padStart(2, "0")}`;
      return {
        id: resp.track.split(":")[2],
        popularity: metadata.popularity,
        release_date: date_iso,
      };
    });
  };

  const getTrackInfo = async (id) => {
    // Check in-memory cache first
    if (trackDb[id]) {
      return trackDb[id];
    }

    // Check IndexedDB
    const fromIdb = await idb.get(id);
    if (fromIdb) {
      trackDb[id] = fromIdb;
      return fromIdb;
    }

    const [info] = await getTrackInfoBatch([id]);
    return info;
  };

  const getTrackInfoBatch = async (ids) => {
    // 1. Identify what's missing from Memory
    const missingFromMem = ids.filter((id) => !trackDb[id]);

    // 2. Try to fetch missing from IDB
    let idsToFetch = missingFromMem;
    if (missingFromMem.length > 0) {
      const fromIdb = await idb.getMany(missingFromMem);
      fromIdb.forEach((item) => {
        trackDb[item.id] = item.val;
      });
      // Recalculate what is TRULY missing (not in Mem AND not in IDB)
      idsToFetch = missingFromMem.filter((id) => !trackDb[id]);
    }

    if (idsToFetch.length > 0) {
      try {
        const results = await Promise.allSettled([
          getFeatures(idsToFetch),
          getTrackFeatures(idsToFetch),
        ]);

        const featuresRes = results[0].status === "fulfilled" ? results[0].value : null;
        const metadataRes = results[1].status === "fulfilled" ? results[1].value : null;

        if (featuresRes) {
          const newItems = [];

          featuresRes.forEach((track) => {
            if (track) {
              const trackDetails = metadataRes?.find((t) => t?.id === track?.id);
              if (trackDetails) {
                const info = djTrackInfo.fromQueries(track, trackDetails);
                trackDb[track.id] = info;
                newItems.push({ id: track.id, val: info });
              }
            }
          });

          // Save new items to IDB
          if (newItems.length > 0) {
            idb.setMany(newItems);
          }
        }
      } catch (error) {
        console.error("DJ Info: Error fetching batch track info:", error);
      }
    }
    return ids.map((id) => {
      if (trackDb[id]) return trackDb[id];
      return null;
    });
  };

  const processTrackInfoQueue = async () => {
    if (trackInfoQueue.size === 0) return;

    const ids = Array.from(trackInfoQueue.keys());
    const queueSnapshot = new Map(trackInfoQueue);
    trackInfoQueue.clear();

    const CHUNK_SIZE = 100;
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunk = ids.slice(i, i + CHUNK_SIZE);
      await getTrackInfoBatch(chunk);
    }

    queueSnapshot.forEach((elements, id) => {
      const info = trackDb[id];
      if (info) {
        elements.forEach((track) => {
          if (track && track.isConnected) {
            const isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
            addInfoToTrack(track, isRecommendation);
          }
        });
      }
    });
  };

  const queueTrackInfo = (id, element) => {
    if (!trackInfoQueue.has(id)) {
      trackInfoQueue.set(id, new Set());
    }
    trackInfoQueue.get(id).add(element);

    clearTimeout(trackInfoTimeout);
    trackInfoTimeout = setTimeout(processTrackInfoQueue, 100);
  };

  const getVisibleColumnCount = (row) => {
    let count = 0;
    const children = Array.from(row.children);
    for (const child of children) {
      if (child.classList.contains("djInfoList")) continue;

      // Check for standard Spotify column classes
      if (
        child.classList.contains("main-trackList-rowSectionVariable") ||
        child.classList.contains("main-trackList-rowSectionEnd") ||
        child.classList.contains("main-trackList-rowSectionStart") ||
        child.classList.contains("main-trackList-rowSectionIndex")
      ) {
        const style = window.getComputedStyle(child);
        if (style.display !== "none") {
          count++;
        }
      }
    }
    return count;
  };

  const updateTrackGrid = (track, isRecommendation) => {
    const MIN_WIDTH = 550;
    const width = window.innerWidth;

    let djInfoColumn = track.querySelector(".djInfoList");

    if (width < MIN_WIDTH && !isRecommendation) {
      if (djInfoColumn) {
        djInfoColumn.style.display = "none";
      }
      track.style["grid-template-columns"] = "";
      return;
    }

    if (djInfoColumn) {
      djInfoColumn.style.display = "flex";
    }

    const visibleCount = getVisibleColumnCount(track);

    if (isRecommendation) {
      if (djInfoColumn) {
        djInfoColumn.style.justifyContent = "center";
        djInfoColumn.style.width = "100%";
      }
      track.style["grid-template-columns"] = recommendationGridCss;
    } else {
      if (CONFIG.isRichUiEnabled) {
        switch (visibleCount) {
          case 3:
            track.style["grid-template-columns"] = richFourColumnGridCss;
            break;
          case 4:
            track.style["grid-template-columns"] = richFiveColumnGridCss;
            break;
          case 5:
            track.style["grid-template-columns"] = richSixColumnGridCss;
            break;
          case 6:
            track.style["grid-template-columns"] = richSevenColumnGridCss;
            break;
          default:
            // Fallback or do nothing if unusual count
            break;
        }
      } else {
        switch (visibleCount) {
          case 3:
            track.style["grid-template-columns"] = fourColumnGridCss;
            break;
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
      }
    }
  };

  const addInfoToTrack = (track, isRecommendation = false) => {
    const hasdjinfo = track.querySelector(".djinfo") !== null;
    const trackUri = getTracklistTrackUri(track);
    if (!trackUri) {
      return;
    }
    const isTrack = trackUri.includes("track");

    let djInfoColumn = track.querySelector(".djInfoList");

    // Always update grid first to handle resize/visibility changes
    if (!djInfoColumn) {
      // Add column for djInfos
      let lastColumn = track.querySelector(".main-trackList-rowSectionEnd");

      // Safety check
      if (!lastColumn) return;

      // We rely on our new counter now
      let colIndexInt = getVisibleColumnCount(track);

      // If we are here, djInfoColumn does NOT exist. So it's safe to create.
      lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());

      djInfoColumn = document.createElement("div");
      djInfoColumn.setAttribute("aria-colindex", colIndexInt.toString());
      djInfoColumn.style.display = "flex";
      djInfoColumn.classList.add("main-trackList-rowSectionVariable");
      djInfoColumn.classList.add("djInfoList");
      track.insertBefore(djInfoColumn, lastColumn);
    }

    updateTrackGrid(track, isRecommendation);

    if (!trackUri || !isTrack) return;

    const uri = trackUri;
    const id = uri.split(":")[2];
    const info = trackDb[id];

    if (info) {
      if (hasdjinfo) return;

      if (CONFIG.isRichUiEnabled) {
        const parsedInfo = info;
        const container = document.createElement("div");
        container.className = "dj-info-grid djinfo djinfo-animate";

        const topRow = document.createElement("div");
        topRow.className = "dj-info-row-top";

        if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) {
          const keyContent = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
          const keyTag = document.createElement("span");
          keyTag.className = "dj-info-tag";
          keyTag.innerText = keyContent;
          if (CONFIG.isCamelotEnabled) {
            const match = keyContent.match(/(\d+[AB])/);
            if (match) {
              keyTag.classList.add(`camelot-key-${match[1]}`);
            } else {
              keyTag.style.backgroundColor = "#e0e0e0";
            }
          } else {
            keyTag.style.backgroundColor = "#e0e0e0";
          }
          topRow.appendChild(keyTag);
        }

        if (CONFIG.isBPMEnabled) {
          const bpmSpan = document.createElement("span");
          bpmSpan.innerText = `${parsedInfo.tempo}\u00a0bpm`;
          topRow.appendChild(bpmSpan);
        }

        const bottomRow = document.createElement("div");
        bottomRow.className = "dj-info-row-bottom";

        let bottomStats = [];
        if (CONFIG.isEnergyEnabled) bottomStats.push(`E: ${Math.round(parsedInfo.energy * 100)}`);
        if (CONFIG.isDanceEnabled)
          bottomStats.push(`D: ${Math.round(parsedInfo.danceability * 100)}`);
        if (CONFIG.isPopularityEnabled) bottomStats.push(`♥ ${parsedInfo.popularity}`);
        if (CONFIG.isYearEnabled) bottomStats.push(`${parsedInfo.release_date}`);

        if (bottomStats.length > 0) {
          bottomStats.forEach((stat, i) => {
            const span = document.createElement("span");
            span.innerText = stat;
            bottomRow.appendChild(span);
            if (i < bottomStats.length - 1) {
              const sep = document.createElement("span");
              sep.className = "dj-info-separator";
              sep.innerText = "-";
              bottomRow.appendChild(sep);
            }
          });
        }

        container.appendChild(topRow);
        if (bottomStats.length > 0) {
          container.appendChild(bottomRow);
        }

        djInfoColumn.innerHTML = "";
        djInfoColumn.appendChild(container);
      } else {
        const parsedInfo = info;
        const keyInNotation = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
        // Create the main container
        const container = document.createElement("div");
        container.className = "dj-info-classic-container djinfo djinfo-animate";

        // Define the data points we want to show
        const dataPoints = [];
        const weights = [];

        if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) {
          dataPoints.push("𝄞 " + keyInNotation);
          const weight = CONFIG.isKeyEnabled && CONFIG.isCamelotEnabled ? 1.9 : 0.8;
          weights.push(weight);
        }

        if (CONFIG.isBPMEnabled) {
          dataPoints.push(Math.round(parsedInfo.tempo) + " ♫");
          weights.push(1);
        }

        if (CONFIG.isEnergyEnabled) {
          dataPoints.push("E " + Math.round(parsedInfo.energy * 100));
          weights.push(0.8);
        }

        if (CONFIG.isDanceEnabled) {
          dataPoints.push("D " + Math.round(parsedInfo.danceability * 100));
          weights.push(0.8);
        }

        if (CONFIG.isPopularityEnabled) {
          dataPoints.push("♥ " + parsedInfo.popularity);
          weights.push(0.75);
        }

        if (CONFIG.isYearEnabled) {
          dataPoints.push(parsedInfo.release_date);
          weights.push(0.9);
        }

        // Build Dynamic Grid Template
        // e.g. minmax(0, 0.7fr) max-content minmax(0, 1fr) ...
        const gridParts = [];
        weights.forEach((w, i) => {
          gridParts.push(`minmax(0, ${w}fr)`);
          // Add separator column if not last item
          if (i < weights.length - 1) {
            gridParts.push("max-content");
          }
        });

        container.style["grid-template-columns"] = gridParts.join(" ");

        // Build the DOM elements
        dataPoints.forEach((text, index) => {
          // 1. Create the Data Item
          const span = document.createElement("span");
          span.className = "dj-info-classic-item";
          span.innerText = text;
          container.appendChild(span);

          // 2. Create the Separator (if not the last item)
          if (index < dataPoints.length - 1) {
            const sep = document.createElement("span");
            sep.className = "dj-info-classic-separator";

            // HERE IS WHERE YOU CONTROL THE SEPARATOR CHARACTER
            sep.innerText = "|"; // Change this to "•", "/", or ""

            container.appendChild(sep);
          }
        });

        djInfoColumn.innerHTML = ""; // Clear previous content
        djInfoColumn.appendChild(container);
      }
    } else {
      if (hasdjinfo) {
        const djinfoElement = track.querySelector(".djinfo");
        if (djinfoElement) djinfoElement.remove();
      }
      queueTrackInfo(id, track);
    }
  };

  // Resize Handler
  const reRenderAll = () => {
    // Re-apply grid to all observed tracks
    const tracklists = document.querySelectorAll(".main-trackList-indexable");
    tracklists.forEach((tracklist) => {
      const tracks = tracklist.getElementsByClassName("main-trackList-trackListRow");
      for (const track of tracks) {
        addInfoToTrack(track, false);
      }
    });
    // Recommendations
    const recommendations = document.querySelector('[data-testid="recommended-track"]');
    if (recommendations) {
      const tracks = recommendations.getElementsByClassName("main-trackList-trackListRow");
      for (const track of tracks) {
        addInfoToTrack(track, true);
      }
    }
  };

  window.addEventListener("resize", debounce(reRenderAll, 200));

  // update Tracklist and insert DJ Info
  const updateTracklist = (tracklist) => {
    if (!CONFIG.isPlaylistEnabled) return;
    if (!tracklist) return;

    // Adding DJ Info Column Header
    const tracklistHeader = tracklist.querySelector(".main-trackList-trackListHeaderRow");
    if (tracklistHeader && !tracklistHeader.querySelector(".djinfoheader")) {
      let lastColumn = tracklistHeader.querySelector(".main-trackList-rowSectionEnd");
      let visibleCols = getVisibleColumnCount(tracklistHeader);

      let colIndexInt = visibleCols;

      let semanticIndex = colIndexInt;
      if (lastColumn.getAttribute("aria-colindex")) {
        semanticIndex = parseInt(lastColumn.getAttribute("aria-colindex"));
      }

      lastColumn.setAttribute("aria-colindex", (visibleCols + 1).toString());
      let headerColumn = document.createElement("div");
      headerColumn.style.display = "flex";
      headerColumn.classList.add("main-trackList-rowSectionVariable");
      headerColumn.role = "columnheader";
      tracklistHeader.insertBefore(headerColumn, lastColumn);

      const updateHeaderGrid = () => {
        let djInfoH = tracklistHeader.querySelector(".djinfoheader")?.parentElement;
        if (djInfoH) djInfoH.style.display = "flex";
        let currentVisible = getVisibleColumnCount(tracklistHeader);
      };

      if (CONFIG.isRichUiEnabled) {
        switch (visibleCols) {
          case 3:
            tracklistHeader.style["grid-template-columns"] = richFourColumnGridCss;
            break;
          case 4:
            tracklistHeader.style["grid-template-columns"] = richFiveColumnGridCss;
            break;
          case 5:
            tracklistHeader.style["grid-template-columns"] = richSixColumnGridCss;
            break;
          case 6:
            tracklistHeader.style["grid-template-columns"] = richSevenColumnGridCss;
            break;
          default:
            break;
        }
      } else {
        switch (visibleCols) {
          case 3:
            tracklistHeader.style["grid-template-columns"] = fourColumnGridCss;
            break;
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
      }

      const btn = document.createElement("button");
      btn.classList.add("main-trackList-column");
      btn.classList.add("main-trackList-sortable");
      btn.classList.add("djinfoheader");
      const title = document.createElement("span");
      title.classList.add("TypeElement-mesto-type");
      title.classList.add("standalone-ellipsis-one-line");
      title.innerHTML = "DJ Info";
      btn.appendChild(title);
      headerColumn.appendChild(btn);
    }

    const tracks = tracklist.getElementsByClassName("main-trackList-trackListRow");
    for (const track of tracks) {
      const hasdjinfo = track.querySelector(".djinfo") !== null;
      if (!track.classList.contains("dj-observed") || !hasdjinfo) {
        track.classList.add("dj-observed");
        trackIntersectionObserver.observe(track);
      }
    }
  };

  const updateRecommendations = (recommendations) => {
    if (!CONFIG.isRecommendationsEnabled) return;
    if (!recommendations) return;

    const tracklist = recommendations.querySelector(".main-trackList-trackList");
    if (tracklist) {
      const tracks = tracklist.getElementsByClassName("main-trackList-trackListRow");
      for (const track of tracks) {
        const hasdjinfo = track.querySelector(".djinfo") !== null;
        if (!track.classList.contains("dj-observed") || !hasdjinfo) {
          track.classList.add("dj-observed");
          trackIntersectionObserver.observe(track);
        }
      }
    }
  };

  // Add DJ Info to Now Playing
  updateNowPlayingWidget = async () => {
    if (!nowPlayingWidgetdjInfoData || !CONFIG.isNowPlayingEnabled) return;
    const getTrackUri = () => {
      if (!Spicetify.Player.data || !Spicetify.Player.data.item) return null;
      return Spicetify.Player.data.item.uri;
    };
    // Get the current Track
    const trackUri = getTrackUri();
    if (!trackUri) {
      nowPlayingWidgetdjInfoData.style.display = "none";
      return;
    }
    const isTrack = trackUri.includes("track");

    nowPlayingWidgetdjInfoData.style.display = isTrack ? "flex" : "none";

    // get the Infos from requests, generating a Display Text
    const uri = trackUri;
    if (uri.split(":")[1] === "local") {
      // don't request data for local files
      nowPlayingWidgetdjInfoData.innerHTML = "";
      return;
    }
    const id = uri.split(":")[2];
    const info = await getTrackInfo(id);
    if (info) {
      const display_text = [];
      if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled)
        display_text.push(`${getKeyInNotation(info.key, info.mode)}`);
      if (CONFIG.isBPMEnabled) display_text.push(`${info.tempo} ♫`);
      if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${info.popularity}`);
      if (CONFIG.isYearEnabled) display_text.push(`${info.release_date}`);
      nowPlayingWidgetdjInfoData.innerHTML = display_text.join("<br>");

      nowPlayingWidgetdjInfoData.classList.remove("djinfo-animate");
      void nowPlayingWidgetdjInfoData.offsetWidth; // Trigger reflow
      nowPlayingWidgetdjInfoData.classList.add("djinfo-animate");
    } else {
      nowPlayingWidgetdjInfoData.innerHTML = "";
      getTrackInfo(id).then((info) => {
        if (info) {
          updateNowPlayingWidget();
        }
      });
    }
    nowPlayingWidgetdjInfoData.style.fontSize = "11px";
  };

  Spicetify.Player.addEventListener("songchange", () => {
    updateNowPlayingWidget();
  });

  const observedTracklists = new WeakSet();

  function observeTracklist(tracklist, isRecommendation = false) {
    const updater = () => {
      if (isRecommendation) {
        updateRecommendations(tracklist);
      } else {
        updateTracklist(tracklist);
      }
    };

    if (observedTracklists.has(tracklist)) {
      updater();
      return;
    }

    const observer = new MutationObserver(updater);
    observer.observe(tracklist, { childList: true, subtree: true });
    observedTracklists.add(tracklist);
    updater();
  }

  function main() {
    // For regular playlists
    const tracklists = document.querySelectorAll(".main-trackList-indexable");
    tracklists.forEach((tracklist) => observeTracklist(tracklist, false));

    // For recommendations
    const recommendationsContainer = document.querySelector('[data-testid="recommended-track"]');
    if (recommendationsContainer) {
      observeTracklist(recommendationsContainer, true);
    }

    // For Now Playing bar
    oldNowPlayingWidget = nowPlayingWidget;
    nowPlayingWidget = document.querySelector(".main-nowPlayingWidget-nowPlaying");
    if (nowPlayingWidget && !nowPlayingWidget.isEqualNode(oldNowPlayingWidget)) {
      if (!nowPlayingWidget.querySelector(".dj-info-now-playing")) {
        nowPlayingWidgetdjInfoData = document.createElement("p");
        nowPlayingWidgetdjInfoData.classList.add("dj-info-now-playing");
        nowPlayingWidgetdjInfoData.style.marginLeft = "4px";
        nowPlayingWidgetdjInfoData.style.marginRight = "4px";
        nowPlayingWidgetdjInfoData.style.minWidth = "34px";
        nowPlayingWidgetdjInfoData.style.fontSize = "11px";
        nowPlayingWidgetdjInfoData.style.textAlign = "center";
        const trackInfo = nowPlayingWidget.querySelector(".main-trackInfo-container");
        if (trackInfo) {
          if (CONFIG.isLeftPlayingEnabled) {
            trackInfo.before(nowPlayingWidgetdjInfoData);
          } else {
            trackInfo.after(nowPlayingWidgetdjInfoData);
          }
        }
        updateNowPlayingWidget();
      }
    }
  }

  const debouncedMain = debounce(main, 10);
  if (window.djInfoMutationObserver) {
    window.djInfoMutationObserver.disconnect();
  }
  const observer = new MutationObserver(debouncedMain);
  main();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  window.djInfoMutationObserver = observer;
})();
