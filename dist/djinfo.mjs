// NAME: DJ Info
// AUTHOR: L3N0X (Updated for Spotify 1.3.3+)
// VERSION: 2.6.3 (cross-extension safe + Coordinator delegation — flicker fix)
// DESCRIPTION: BPM, Camelot Key, Popularity, Year, and Audio Features display for each song
// ===================================================

var DJInfo = (() => {
    const debounce = (fn, ms) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), ms);
        };
    };

    const STYLE_ID = "dj-info-styles";
    function initStyles() {
        let el = document.getElementById(STYLE_ID);
        if (!el) {
            el = document.createElement("style");
            el.id = STYLE_ID;
            document.head.appendChild(el);
        }
        el.innerHTML = `
            @keyframes djInfoFadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .djinfo-animate {
                animation: djInfoFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            }
            .spicetify-ext-lastcol-host {
                display: flex !important;
                align-items: center !important;
                justify-content: flex-end !important;
                overflow: visible !important;
                min-width: max-content !important;
                justify-self: end !important;
            }
            .djInfoSeparateCol {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 118px;
                padding: 0 6px;
                box-sizing: border-box;
                justify-self: center;
                flex-shrink: 0;
                z-index: 10;
            }
            .dj-info-classic-container {
                display: grid;
                align-items: center;
                justify-items: center;
                width: 100%;
            }
            .djInfoList {
                min-width: 0;
                overflow-x: auto;
                scrollbar-width: none;
            }
            .dj-info-now-playing {
                margin-inline: 4px;
                min-width: 34px;
                flex-shrink: 0;
                font-size: 11px;
                text-align: center;
                overflow-y: auto;
                height: 100%;
                padding: 8px 0;
                scrollbar-width: none;
            }
            .dj-info-now-playing-parent { height: 100%; }
            .dj-info-classic-item {
                display: block;
                font-size: 12px;
                white-space: nowrap;
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
            .djInfoSeparateCol .dj-info-grid { padding-left: 0; align-items: center; }
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
                white-space: nowrap;
            }
            .dj-info-row-info { white-space: nowrap; }
            .dj-info-separator { opacity: 0.6; font-size: 0.8em; padding: 0 1px; }
            .dj-info-tag {
                padding: 1px 6px;
                border-radius: 4px;
                color: #000;
                font-weight: 700;
                font-size: 11px;
                text-shadow: none;
            }
            :root {
                --camelot-1A: #00D3AA; --camelot-1B: #00CC33;
                --camelot-2A: #00E072; --camelot-2B: #78E600;
                --camelot-3A: #60E916; --camelot-3B: #BFD700;
                --camelot-4A: #C3EC00; --camelot-4B: #EBD100;
                --camelot-5A: #F0E100; --camelot-5B: #FFC000;
                --camelot-6A: #FFC900; --camelot-6B: #FF8D00;
                --camelot-7A: #FFA900; --camelot-7B: #EF5524;
                --camelot-8A: #FF7C00; --camelot-8B: #FF354C;
                --camelot-9A: #E24F21; --camelot-9B: #D81C65;
                --camelot-10A: #C83036; --camelot-10B: #A22888;
                --camelot-11A: #982257; --camelot-11B: #561F9B;
                --camelot-12A: #5A1C81; --camelot-12B: #0096C6;
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
    }

    const CONFIG_MODAL_CSS = `
        .setting-row::after { content: ""; display: table; clear: both; border-radius: 4px; }
        .setting-row .col { display: flex; padding: 10px 0; align-items: center; }
        .setting-row .col.description { float: left; padding-right: 15px; color: var(--spice-text); }
        .setting-row .col.action { float: right; text-align: right; }
        h1.main-type-alto { color: var(--spice-text); }
        button.switch { align-items: center; border: 0px; border-radius: 50%; background-color: rgba(var(--spice-rgb-shadow), .7); color: var(--spice-text); cursor: pointer; display: flex; margin-inline-start: 12px; padding: 8px; }
        button.switch.disabled, button.switch[disabled] { color: rgba(var(--spice-rgb-text), .3); }
        button.btn { font-weight: 700; font-size: medium; background-color: transparent; border-radius: 24px; transition-duration: 33ms; padding-inline: 15px; border: 1px solid #727272; color: var(--spice-text); min-block-size: 32px; cursor: pointer; }
        button.btn:hover { transform: scale(1.04); border-color: var(--spice-text); }
    `;

    const DEFAULT_CONFIG = {
        isPlaylistEnabled: true,
        isSeparateColumnEnabled: false,
        isNowPlayingEnabled: true,
        isLeftPlayingEnabled: false,
        isRecommendationsEnabled: true,
        isBPMEnabled: true,
        isKeyEnabled: false,
        isCamelotEnabled: true,
        isPopularityEnabled: true,
        isEnergyEnabled: false,
        isDanceEnabled: false,
        isAcousticnessEnabled: false,
        isInstrumentalnessEnabled: false,
        isLivenessEnabled: false,
        isLoudnessEnabled: false,
        isSpeechinessEnabled: false,
        isValenceEnabled: false,
        isTimeSignatureEnabled: false,
        isYearEnabled: true,
        isRichUiEnabled: true
    };

    let CONFIG;
    function loadConfig() {
        try {
            CONFIG = JSON.parse(Spicetify.LocalStorage.get("dj-info-config") || "error");
            Object.keys(DEFAULT_CONFIG).forEach(k => {
                if (CONFIG[k] === undefined) CONFIG[k] = DEFAULT_CONFIG[k];
            });
        } catch {
            CONFIG = { ...DEFAULT_CONFIG };
        }
    }
    function saveConfig() {
        Spicetify.LocalStorage.set("dj-info-config", JSON.stringify(CONFIG));
    }

    let onConfigChange = () => {};
    const getReact = () => Spicetify.React;
    const DisplayIcon = ({ icon, size }) =>
        getReact().createElement("svg", {
            width: size,
            height: size,
            viewBox: "0 0 16 16",
            fill: "currentColor",
            dangerouslySetInnerHTML: { __html: icon }
        });

    const ConfigItem = ({ name, field, disabled = false }) => {
        const React = getReact();
        const [val, setVal] = React.useState(CONFIG[field]);
        return React.createElement("div", { className: "setting-row" },
            React.createElement("label", { className: "col description" }, name),
            React.createElement("div", { className: "col action" },
                React.createElement("button", {
                    className: "switch" + (val ? "" : " disabled"),
                    disabled,
                    onClick: () => {
                        const next = !val;
                        CONFIG[field] = next;
                        setVal(next);
                        saveConfig();
                        onConfigChange(field);
                    }
                }, React.createElement(DisplayIcon, { icon: Spicetify.SVGIcons.check, size: 16 }))
            )
        );
    };

    const ReloadItem = ({ name, disabled = false }) => {
        const React = getReact();
        return React.createElement("div", { className: "setting-row" },
            React.createElement("label", { className: "col description" }, name),
            React.createElement("div", { className: "col action" },
                React.createElement("button", {
                    className: "btn",
                    disabled,
                    onClick: () => window.location.reload()
                }, "Reload")
            )
        );
    };

    const ButtonItem = ({ name, btnText, onClick, disabled = false }) => {
        const React = getReact();
        return React.createElement("div", { className: "setting-row" },
            React.createElement("label", { className: "col description" }, name),
            React.createElement("div", { className: "col action" },
                React.createElement("button", { className: "btn", disabled, onClick }, btnText)
            )
        );
    };

    class DjTrackInfo {
        static fromQueries(feat, meta) {
            return {
                key: feat.key,
                mode: feat.mode,
                tempo: Math.round(feat.tempo),
                energy: Math.round(100 * feat.energy),
                danceability: Math.round(100 * feat.danceability),
                acousticness: Math.round(100 * feat.acousticness),
                instrumentalness: Math.round(100 * feat.instrumentalness),
                liveness: Math.round(100 * feat.liveness),
                loudness: Math.round(10 * Number.parseFloat(feat.loudness)) / 10,
                speechiness: Math.round(100 * feat.speechiness),
                valence: Math.round(100 * feat.valence),
                time_signature: feat.time_signature,
                popularity: meta.popularity,
                release_date: (meta.release_date || "").split("-")[0]
            };
        }
    }

    const trackDb = {};
    const idb = {
        db: null,
        initPromise: null,
        init: () => {
            if (!idb.initPromise) {
                idb.initPromise = new Promise((resolve, reject) => {
                    const req = indexedDB.open("dj-info-idb", 1);
                    req.onupgradeneeded = e => {
                        const db = e.target.result;
                        if (!db.objectStoreNames.contains("tracks")) {
                            db.createObjectStore("tracks", { keyPath: "id" });
                        }
                    };
                    req.onsuccess = e => { idb.db = e.target.result; resolve(); };
                    req.onerror = e => { console.error("DJ Info: IndexedDB error", e); reject(e); };
                });
            }
            return idb.initPromise;
        },
        clear: async () => {
            if (!idb.db) await idb.init();
            return new Promise((resolve, reject) => {
                const req = idb.db.transaction(["tracks"], "readwrite").objectStore("tracks").clear();
                req.onsuccess = () => resolve();
                req.onerror = e => reject(e);
            });
        },
        get: async id => {
            if (!idb.db) await idb.init();
            return new Promise(resolve => {
                const req = idb.db.transaction(["tracks"], "readonly").objectStore("tracks").get(id);
                req.onsuccess = () => resolve(req.result?.val || null);
                req.onerror = () => resolve(null);
            });
        },
        getMany: async ids => {
            if (!idb.db) await idb.init();
            return new Promise(resolve => {
                if (ids.length === 0) return resolve([]);
                const store = idb.db.transaction(["tracks"], "readonly").objectStore("tracks");
                const out = [];
                let done = 0;
                ids.forEach(id => {
                    const req = store.get(id);
                    req.onsuccess = () => {
                        if (req.result?.val) out.push({ id, val: req.result.val });
                        if (++done === ids.length) resolve(out);
                    };
                    req.onerror = () => {
                        if (++done === ids.length) resolve(out);
                    };
                });
            });
        },
        setMany: async entries => {
            if (!idb.db) await idb.init();
            return new Promise(resolve => {
                const tx = idb.db.transaction(["tracks"], "readwrite");
                const store = tx.objectStore("tracks");
                entries.forEach(item => store.put({ id: item.id, val: item.val }));
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            });
        }
    };

    async function clearAllCache() {
        Object.keys(trackDb).forEach(k => delete trackDb[k]);
        await idb.clear();
    }

    const SETTINGS_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="currentcolor"></path></svg>';

    function openConfig() {
        const React = getReact();
        const styleEl = React.createElement("style", { dangerouslySetInnerHTML: { __html: CONFIG_MODAL_CSS } });
        const content = React.createElement("div", null,
            styleEl,
            React.createElement(ReloadItem, { name: "Reload Window to apply changes" }),
            React.createElement(ConfigItem, { name: "Enable Rich UI", field: "isRichUiEnabled" }),
            React.createElement(ConfigItem, { name: "Enable in Playlists", field: "isPlaylistEnabled" }),
            React.createElement(ConfigItem, { name: "Use Separate Grid Column for DJ Info (Opt-In)", field: "isSeparateColumnEnabled" }),
            React.createElement(ConfigItem, { name: "Enable in Now Playing", field: "isNowPlayingEnabled" }),
            React.createElement(ConfigItem, { name: "Display Info on Left Side in Now Playing", field: "isLeftPlayingEnabled" }),
            React.createElement(ConfigItem, { name: "Enable in Recommendations", field: "isRecommendationsEnabled" }),
            React.createElement(ConfigItem, { name: "Enable BPM", field: "isBPMEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Key (Standard Notation)", field: "isKeyEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Key (Camelot Notation)", field: "isCamelotEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Year", field: "isYearEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Popularity (♥)", field: "isPopularityEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Energy (E)", field: "isEnergyEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Danceability (D)", field: "isDanceEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Acousticness (A)", field: "isAcousticnessEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Instrumentalness (I)", field: "isInstrumentalnessEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Liveness (L)", field: "isLivenessEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Loudness (dB)", field: "isLoudnessEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Speechiness (S)", field: "isSpeechinessEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Valence (V)", field: "isValenceEnabled" }),
            React.createElement(ConfigItem, { name: "Enable Time Signature (?/4)", field: "isTimeSignatureEnabled" }),
            React.createElement(ButtonItem, {
                name: "Clear Cache",
                btnText: "Clear",
                onClick: async () => {
                    await clearAllCache();
                    Spicetify.showNotification("Cache cleared!");
                }
            })
        );
        Spicetify.PopupModal.display({ title: "DJ Info Settings", content });
    }

    function registerSettingsMenu() {
        new Spicetify.Menu.Item("DJ Info Settings", false, openConfig, SETTINGS_ICON).register();
    }

    // --- LIGHTWEIGHT NATIVE PROTOBUF CODEC FOR SPOTIFY EXTENDED METADATA ---
    function writeVarint(arr, val) {
        let v = val >>> 0;
        while (v > 0x7f) {
            arr.push((v & 0x7f) | 0x80);
            v >>>= 7;
        }
        arr.push(v);
    }

    function writeBytesField(arr, fieldNo, bytes) {
        writeVarint(arr, (fieldNo << 3) | 2);
        writeVarint(arr, bytes.length);
        for (let i = 0; i < bytes.length; i++) arr.push(bytes[i]);
    }

    function writeStringField(arr, fieldNo, str) {
        const bytes = new TextEncoder().encode(str);
        writeBytesField(arr, fieldNo, bytes);
    }

    function encodeExtendedMetadataRequest(countryStr, catalogueStr, taskIdBytes, uris, extKind) {
        const out = [];
        const header = [];
        if (countryStr) writeStringField(header, 1, countryStr);
        if (catalogueStr) writeStringField(header, 2, catalogueStr);
        if (taskIdBytes) writeBytesField(header, 3, taskIdBytes);
        writeBytesField(out, 1, header);

        for (const uri of uris) {
            const req = [];
            writeStringField(req, 1, uri);
            const query = [];
            writeVarint(query, (1 << 3) | 0);
            writeVarint(query, extKind);
            writeBytesField(req, 2, query);
            writeBytesField(out, 2, req);
        }
        return new Uint8Array(out);
    }

    function readVarint(buf, pos) {
        let result = 0, shift = 0, b;
        do {
            if (pos >= buf.length) return [0, pos];
            b = buf[pos++];
            result |= (b & 0x7f) << shift;
            shift += 7;
        } while (b & 0x80);
        return [result >>> 0, pos];
    }

    function decodeZigZag(n) {
        return (n >>> 1) ^ -(n & 1);
    }

    function skipField(buf, pos, wireType) {
        if (wireType === 0) return readVarint(buf, pos)[1];
        if (wireType === 1) return pos + 8;
        if (wireType === 2) {
            const [len, nextPos] = readVarint(buf, pos);
            return nextPos + len;
        }
        if (wireType === 5) return pos + 4;
        return buf.length;
    }

    function decodeDateMessage(buf, start, end) {
        let pos = start, year = 0, month = 1, day = 1;
        while (pos < end) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (wire === 0 && (fieldNo === 1 || fieldNo === 2 || fieldNo === 3)) {
                const [val, p2] = readVarint(buf, pos);
                pos = p2;
                const decoded = decodeZigZag(val);
                if (fieldNo === 1) year = decoded;
                else if (fieldNo === 2) month = decoded;
                else if (fieldNo === 3) day = decoded;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
        return { year, month, day };
    }

    function decodeAlbumMessage(buf, start, end) {
        let pos = start, date = null;
        while (pos < end) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (fieldNo === 6 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                date = decodeDateMessage(buf, p2, p2 + len);
                pos = p2 + len;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
        return date;
    }

    function decodeTrackMetadata(buf, start, end) {
        let pos = start, popularity = 0, releaseDate = null;
        while (pos < end) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (fieldNo === 3 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                releaseDate = decodeAlbumMessage(buf, p2, p2 + len);
                pos = p2 + len;
            } else if (fieldNo === 8 && wire === 0) {
                const [val, p2] = readVarint(buf, pos);
                popularity = decodeZigZag(val);
                pos = p2;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
        return { popularity, releaseDate };
    }

    function decodeTrackMetadataWrapper(buf, start, end) {
        let pos = start, meta = null;
        while (pos < end) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (fieldNo === 2 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                meta = decodeTrackMetadata(buf, p2, p2 + len);
                pos = p2 + len;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
        return meta;
    }

    function decodeResponseEntry(buf, start, end) {
        let pos = start, trackUri = "", meta = null;
        const decoder = new TextDecoder();
        while (pos < end) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (fieldNo === 2 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                trackUri = decoder.decode(buf.subarray(p2, p2 + len));
                pos = p2 + len;
            } else if (fieldNo === 3 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                meta = decodeTrackMetadataWrapper(buf, p2, p2 + len);
                pos = p2 + len;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
        if (!meta || !trackUri) return null;
        const r = meta.releaseDate;
        const dateStr = (r?.year || "") + "-" + String(r?.month || 1).padStart(2, "0") + "-" + String(r?.day || 1).padStart(2, "0");
        return { id: trackUri.split(":")[2], popularity: meta.popularity, release_date: dateStr };
    }

    function decodeExtensionArray(buf, start, end, results) {
        let pos = start;
        while (pos < end) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (fieldNo === 3 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                const entry = decodeResponseEntry(buf, p2, p2 + len);
                if (entry) results.push(entry);
                pos = p2 + len;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
    }

    function decodeExtendedMetadataResponse(buf) {
        let pos = 0;
        const results = [];
        while (pos < buf.length) {
            const [tag, p1] = readVarint(buf, pos);
            pos = p1;
            const fieldNo = tag >>> 3, wire = tag & 7;
            if (fieldNo === 2 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                decodeExtensionArray(buf, p2, p2 + len, results);
                pos = p2 + len;
            } else if (fieldNo === 3 && wire === 2) {
                const [len, p2] = readVarint(buf, pos);
                const entry = decodeResponseEntry(buf, p2, p2 + len);
                if (entry) results.push(entry);
                pos = p2 + len;
            } else {
                pos = skipField(buf, pos, wire);
            }
        }
        return results;
    }

    // --- SPOTIFY API & BATCH QUEUE ---
    let country = "US", catalogue = "premium";
    async function initProductState() {
        try {
            const vals = await Spicetify.Platform.ProductStateAPI.getValues();
            country = vals?.country ?? "US";
            catalogue = vals?.catalogue ?? "premium";
        } catch {}
    }

    function authHeaders() {
        return {
            Authorization: "Bearer " + Spicetify.Platform.AuthorizationAPI.getState().token.accessToken,
            "Spotify-App-Version": Spicetify.Platform.version,
            "App-Platform": Spicetify.Platform.PlatformData.app_platform,
            Accept: "application/json"
        };
    }

    async function authorizedGet(url) {
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) throw new Error("GET " + url + " failed with " + res.status);
        return res.json();
    }

    function normalizeFeatures(raw, fallbackId) {
        if (!raw || raw.error) return null;
        const obj = raw.audio_features?.[0] ?? raw;
        if (!obj || obj.error || obj.tempo == null) return null;
        return {
            id: fallbackId ?? obj.id,
            tempo: obj.tempo,
            key: obj.key,
            mode: obj.mode,
            danceability: obj.danceability,
            energy: obj.energy,
            acousticness: obj.acousticness,
            instrumentalness: obj.instrumentalness,
            liveness: obj.liveness,
            loudness: obj.loudness,
            speechiness: obj.speechiness,
            valence: obj.valence,
            time_signature: obj.time_signature
        };
    }

    async function getFeaturesForChunk(ids) {
        try {
            const data = await authorizedGet("https://spclient.wg.spotify.com/audio-attributes/v1/audio-features?ids=" + ids.join(","));
            if (Array.isArray(data?.audio_features)) {
                return data.audio_features.map((item, idx) => normalizeFeatures(item, ids[idx]));
            }
        } catch {}
        return Promise.all(ids.map(async id => {
            try {
                return normalizeFeatures(await authorizedGet("https://spclient.wg.spotify.com/audio-attributes/v1/audio-features/" + id + "?format=json"), id);
            } catch {
                return null;
            }
        }));
    }

    async function getFeatures(ids) {
        const out = [];
        for (let i = 0; i < ids.length; i += 100) {
            out.push(...await getFeaturesForChunk(ids.slice(i, i + 100)));
        }
        return out;
    }

    async function getTrackFeatures(ids) {
        const taskId = new Uint8Array(16);
        crypto.getRandomValues(taskId);
        const body = encodeExtendedMetadataRequest(country, catalogue, taskId, ids.map(id => "spotify:track:" + id), 10);
        const res = await fetch("https://spclient.wg.spotify.com/extended-metadata/v0/extended-metadata", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/protobuf",
                Authorization: "Bearer " + Spicetify.Platform.AuthorizationAPI.getState().token.accessToken,
                "Spotify-App-Version": Spicetify.Platform.version,
                "App-Platform": Spicetify.Platform.PlatformData.app_platform
            }
        });
        if (!res.ok) throw new Error("extended-metadata failed with " + res.status);
        const decoded = decodeExtendedMetadataResponse(new Uint8Array(await res.arrayBuffer()));
        if (decoded.length === 0) console.warn("DJ Info: extended-metadata returned no decodable entries");
        return decoded;
    }

    function isInfoComplete(info) {
        return info && info.v === 2 && info.acousticness !== undefined && info.acousticness !== null && !isNaN(info.acousticness);
    }

    async function getTrackInfoBatch(ids) {
        const missingLocal = ids.filter(id => !trackDb[id] || !isInfoComplete(trackDb[id]));
        if (missingLocal.length > 0) {
            (await idb.getMany(missingLocal)).forEach(entry => {
                if (isInfoComplete(entry.val) || !trackDb[entry.id]) trackDb[entry.id] = entry.val;
            });
        }
        const needFetch = ids.filter(id => !trackDb[id] || !isInfoComplete(trackDb[id]));
        if (needFetch.length > 0) {
            try {
                const settled = await Promise.allSettled([getFeatures(needFetch), getTrackFeatures(needFetch)]);
                const feats = settled[0].status === "fulfilled" ? settled[0].value : null;
                const metas = settled[1].status === "fulfilled" ? settled[1].value : null;
                if (feats) {
                    const toStore = [];
                    feats.forEach(f => {
                        if (f) {
                            const found = metas?.find(x => x?.id === f?.id);
                            const m = found || { popularity: 0, release_date: "" };
                            const merged = DjTrackInfo.fromQueries(f, m);
                            if (found) merged.v = 2;
                            trackDb[f.id] = merged;
                            toStore.push({ id: f.id, val: merged });
                        }
                    });
                    if (toStore.length > 0) await idb.setMany(toStore);
                }
            } catch (e) {
                console.error("DJ Info: Error fetching batch track info:", e);
            }
        }
        return ids.map(id => trackDb[id] || null);
    }

    const refetchTried = new Set();

    async function getTrackInfo(id) {
        if (isInfoComplete(trackDb[id])) return trackDb[id];
        const cached = await idb.get(id);
        if (isInfoComplete(cached)) return (trackDb[id] = cached);
        if (refetchTried.has(id)) return trackDb[id] || cached || null;
        refetchTried.add(id);
        const [fetched] = await getTrackInfoBatch([id]);
        return fetched || cached || null;
    }

    const trackInfoQueue = new Map();
    let trackInfoTimeout = null;

    async function processTrackInfoQueue() {
        if (trackInfoQueue.size === 0) return;
        const ids = Array.from(trackInfoQueue.keys());
        const snapshot = new Map(trackInfoQueue);
        trackInfoQueue.clear();
        for (let i = 0; i < ids.length; i += 100) {
            await getTrackInfoBatch(ids.slice(i, i + 100));
        }
        snapshot.forEach((rows, id) => {
            if (trackDb[id]) {
                rows.forEach(row => {
                    if (row && row.isConnected) {
                        addInfoToTrack(row, row.closest('[data-testid="recommended-track"]') !== null);
                    }
                });
            }
        });
        try { fitGrids(); } catch {}
    }

    function queueTrackInfo(id, row) {
        if (!trackInfoQueue.has(id)) trackInfoQueue.set(id, new Set());
        trackInfoQueue.get(id).add(row);
        clearTimeout(trackInfoTimeout);
        trackInfoTimeout = setTimeout(processTrackInfoQueue, 100);
    }

    // --- SPOTIFY 1.3.3+ ARIA & PLAYLIST ENGINE ---
    function isInsideSearchBarDropdown(el) {
        if (!el || !el.closest("main")) return true;
        return Boolean(
            el.closest('[role="listbox"], [role="dialog"], [role="menu"], [role="combobox"], [data-encore-id="popover"], [class*="search-searchResult"], header')
        );
    }

    function findTrackUriInObject(obj, depth = 0, seen = new WeakSet()) {
        if (!obj || typeof obj !== "object" || depth > 5 || seen.has(obj)) return null;
        seen.add(obj);
        if (typeof obj.uri === "string" && obj.uri.startsWith("spotify:track:")) return obj.uri;
        if (typeof obj.link === "string" && obj.link.startsWith("spotify:track:")) return obj.link;
        if (typeof obj.trackUri === "string" && obj.trackUri.startsWith("spotify:track:")) return obj.trackUri;
        if (Array.isArray(obj)) {
            if (obj.length > 3) return null;
            for (const item of obj) {
                const res = findTrackUriInObject(item, depth + 1, seen);
                if (res) return res;
            }
            return null;
        }
        const skip = new Set(["_owner", "_store", "stateNode", "return", "child", "sibling", "alternate", "ref", "deps"]);
        for (const k of Object.keys(obj)) {
            if (skip.has(k) || k.startsWith("__react")) continue;
            const val = obj[k];
            if (typeof val === "string" && val.startsWith("spotify:track:")) return val;
            if (val && typeof val === "object") {
                const res = findTrackUriInObject(val, depth + 1, seen);
                if (res) return res;
            }
        }
        return null;
    }

    function getTracklistTrackUri(row) {
        try {
            if (row.dataset?.djinfoUri) return row.dataset.djinfoUri;
            if (row.dataset?.djprepUri) return row.dataset.djprepUri;
            if (row.dataset?.starRatingsUri) return row.dataset.starRatingsUri;

            const attr = row.getAttribute("data-uri") || row.getAttribute("data-context-item-uri");
            if (attr && attr.startsWith("spotify:track:")) return attr;

            for (const a of row.querySelectorAll('a[href*="/track/"]')) {
                const m = a.getAttribute("href")?.match(/\/track\/([a-zA-Z0-9]{22})/);
                if (m) return "spotify:track:" + m[1];
            }

            for (const el of [row, ...row.querySelectorAll('a, button, [role="gridcell"]')]) {
                const keys = Object.keys(el);
                const pk = keys.find(k => k.startsWith("__reactProps"));
                if (pk && el[pk]) {
                    const f = findTrackUriInObject(el[pk]);
                    if (f) return f;
                }
                const fk = keys.find(k => k.startsWith("__reactFiber") || k.startsWith("__reactInternalInstance"));
                if (fk && el[fk]) {
                    let cur = el[fk];
                    for (let i = 0; i < 12 && cur; i++) {
                        const f = findTrackUriInObject(cur.memoizedProps || cur.pendingProps);
                        if (f) return f;
                        cur = cur.return;
                    }
                }
            }
        } catch {}
        return null;
    }

    function getKeyInNotation(key, mode) {
        const camelot = key < 0 || mode < 0 ? "XX" : ((7 * key + [4, 7][mode]) % 12 + 1) + "AB"[mode];
        const std = key < 0 ? "XX" : "C Db D Eb E F F♯ G Ab A Bb B".split(" ")[key] + ["m", "", "?"].at(mode);
        return CONFIG.isCamelotEnabled ? (CONFIG.isKeyEnabled ? std + " (" + camelot + ")" : camelot) : std;
    }

    // [PATCH] Cross-extension safe: exclude every extension's separate column from the
    // search for Spotify's native last cell.
    function getRowInsertionPoint(row, isHeader) {
        const legacy = row.querySelector(".main-trackList-rowSectionEnd");
        if (legacy) return legacy;
        const notSep = ":not(.spicetify-ext-separate-col):not(.djInfoSeparateCol):not(.starRatingsSeparateCol):not(.djPrepSeparateCol)";
        const sel = (isHeader ? '[role="columnheader"]' : '[role="gridcell"]') + notSep;
        const cells = row.querySelectorAll(sel);
        return cells.length > 0 ? cells[cells.length - 1] : row.lastElementChild;
    }

    // [FLICKER FIX Part A] Order-aware anchor for djinfo's separate column.
    // DJ Info must always be the FIRST extension column, so we insert *before* the first
    // star-ratings / dj-prep separate column (whichever comes first in the DOM). If neither
    // exists yet, we fall back to the native last cell. Without this, djinfo re-inserted
    // itself just before `ip` on every render, which (with star-ratings and/or DJ Prep also
    // in separate mode) shuffled the DOM order and produced a constant visual flicker.
    function getDjInfoSeparateAnchor(grid) {
        return grid.querySelector(".starRatingsSeparateCol, .djPrepSeparateCol");
    }

    function getAllHeaderRows() {
        const mainEl = document.querySelector("main");
        if (!mainEl) return [];
        const list = mainEl.querySelectorAll('.main-trackList-trackListHeaderRow, [data-testid="playlist-tracklist"] [role="row"], [data-testid="track-list"] [role="row"], [role="grid"] [role="row"], [role="table"] [role="row"]');
        return Array.from(list).filter(r => !isInsideSearchBarDropdown(r) && (r.classList.contains("main-trackList-trackListHeaderRow") || r.querySelector('[role="columnheader"]') !== null));
    }

    function getAllTrackRows() {
        const mainEl = document.querySelector("main");
        if (!mainEl) return [];
        const list = mainEl.querySelectorAll('[data-testid="tracklist-row"], .main-trackList-trackListRow, .main-trackList-trackListRowGrid, [data-testid="playlist-tracklist"] [role="row"], [data-testid="track-list"] [role="row"], [role="grid"] [role="row"]');
        return Array.from(list).filter(r =>
            !isInsideSearchBarDropdown(r) &&
            !r.classList.contains("main-trackList-trackListHeaderRow") &&
            r.querySelector('[role="columnheader"]') === null &&
            (r.dataset.testid === "tracklist-row" || r.classList.contains("main-trackList-trackListRow") || r.querySelector('[role="gridcell"]') !== null)
        );
    }

    // --- SELF-CHECK DIAGNOSTICS ---
    const warnedChecks = new Set();
    let selfCheckTimer = null;

    function warnOnce(key, msg, detail) {
        if (warnedChecks.has(key)) return;
        warnedChecks.add(key);
        if (detail !== undefined) console.warn("[DJ Info Self-Check] " + msg, detail);
        else console.warn("[DJ Info Self-Check] " + msg);
    }

    function scheduleSelfCheck() {
        if (selfCheckTimer) clearTimeout(selfCheckTimer);
        selfCheckTimer = setTimeout(() => {
            if (!CONFIG?.isPlaylistEnabled) return;
            const path = Spicetify.Platform?.History?.location?.pathname || "";
            if (!/\/(playlist|album|artist|collection|search)/.test(path)) return;
            const rows = getAllTrackRows();
            if (rows.length === 0) {
                warnOnce("no-rows:" + path.split("/")[1], `No tracklist rows found on "${path}". Spotify DOM structure may have changed.`);
                return;
            }
            const sample = rows[0];
            if (!getRowInsertionPoint(sample, false)) {
                warnOnce("no-ip", "Track rows found, but last cell insertion point is missing.", sample);
            }
            if (!getTracklistTrackUri(sample)) {
                warnOnce("no-uri", "Track rows found, but could not extract spotify:track URI from React props/DOM.", sample);
            }
        }, 2500);
    }

    // --- GRID FIT & OPT-IN SEPARATE COLUMN ---
    const specCache = new Map();
    const DJ_COL_WIDTH = 118;

    function splitTop(str, isSep) {
        const out = [];
        let depth = 0, cur = "";
        for (const ch of str) {
            if (ch === "(" || ch === "[") depth++;
            else if (ch === ")" || ch === "]") depth--;
            if (depth === 0 && isSep(ch)) {
                if (cur.trim()) out.push(cur.trim());
                cur = "";
            } else {
                cur += ch;
            }
        }
        if (cur.trim()) out.push(cur.trim());
        return out;
    }

    function specificity(sel) {
        const ids = (sel.match(/#[\w-]+/g) || []).length;
        const cls = (sel.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) || []).length;
        const rest = sel.replace(/#[\w-]+|\.[\w-]+|\[[^\]]*\]|::?[\w-]+(?:\([^)]*\))?/g, " ");
        const tags = (rest.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length;
        return ids * 10000 + cls * 100 + tags;
    }

    function findSheetSpec(grid) {
        let best = null, bestSp = -1;
        const walk = rules => {
            for (const r of rules) {
                if (r.type === 1) {
                    const v = r.style && r.style.getPropertyValue("grid-template-columns");
                    if (!v) continue;
                    for (const sel of splitTop(r.selectorText, ch => ch === ",")) {
                        let ok = false;
                        try { ok = grid.matches(sel); } catch {}
                        if (ok) {
                            const sp = specificity(sel);
                            if (sp >= bestSp) { best = v; bestSp = sp; }
                        }
                    }
                } else if (r.cssRules) {
                    if (r.media && !window.matchMedia(r.media.mediaText).matches) continue;
                    walk(r.cssRules);
                }
            }
        };
        for (const sheet of document.styleSheets) {
            try { walk(sheet.cssRules); } catch {}
        }
        return best;
    }

    function transformGridSpec(spec, need, separateColWidth = 0) {
        const toks = splitTop(spec, ch => /\s/.test(ch));
        let i = toks.length - 1;
        while (i >= 0 && toks[i].startsWith("[")) i--;
        if (i < 0) return null;

        let lastStart = i;
        while (lastStart > 0 && toks[lastStart - 1].startsWith("[")) lastStart--;

        const t = toks[i];
        let nextLast = t;
        if (need > 0) {
            if (t.startsWith("minmax(") && t.endsWith(")")) {
                const parts = splitTop(t.slice(7, -1), ch => ch === ",");
                if (parts.length !== 2) return null;
                nextLast = "minmax(max(" + parts[0] + "," + need + "px)," + parts[1] + ")";
            } else {
                nextLast = "minmax(" + need + "px," + t + ")";
            }
        }
        toks[i] = nextLast;

        if (separateColWidth > 0) {
            toks.splice(lastStart, 0, "[djinfo]", separateColWidth + "px");
        }
        return toks.join(" ");
    }

    const GRID_MIN_DONOR_PX = 120;
    let forceFit = false;

    function resolveSpec(spec, grid) {
        let guard = 0;
        while (spec && guard++ < 4) {
            const m = spec.trim().match(/^var\(\s*(--[\w-]+)\s*(?:,([\s\S]*))?\)$/);
            if (!m) break;
            const v = getComputedStyle(grid).getPropertyValue(m[1]).trim();
            spec = v || (m[2] ? m[2].trim() : null);
        }
        return spec;
    }

    function lastTrackPx(grid) {
        const t = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).filter(x => /^[\d.]+px$/.test(x));
        return t.length ? parseFloat(t[t.length - 1]) : 0;
    }

    function resetGridInline(grid) {
        const orig = grid.dataset.djOrigInline || "";
        if (orig) grid.style.setProperty("grid-template-columns", orig);
        else grid.style.removeProperty("grid-template-columns");
    }

    function pxFit(grid, need, separateColWidth = 0) {
        const tokens = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/);
        const px = [];
        tokens.forEach((t, i) => { if (/^[\d.]+px$/.test(t)) px.push(i); });
        if (px.length < 3) return false;
        const lastIdx = px[px.length - 1];
        const origLast = parseFloat(tokens[lastIdx]);
        const extraLast = Math.max(0, need - origLast);
        const totalDelta = extraLast + separateColWidth;
        if (totalDelta <= 0.5) return false;

        const donors = px.slice(1, -1).sort((a, b) => parseFloat(tokens[b]) - parseFloat(tokens[a]));
        let taken = 0;
        for (const i of donors) {
            const v = parseFloat(tokens[i]);
            const take = Math.min(totalDelta - taken, Math.max(0, v - GRID_MIN_DONOR_PX));
            if (take > 0) {
                tokens[i] = (v - take) + "px";
                taken += take;
            }
            if (totalDelta - taken <= 0.5) break;
        }
        if (taken <= 0) return false;

        if (separateColWidth > 0) {
            const lastAllowance = Math.max(0, taken - separateColWidth);
            tokens[lastIdx] = (origLast + lastAllowance) + "px";
            tokens.splice(lastIdx, 0, separateColWidth + "px");
        } else {
            tokens[lastIdx] = (origLast + taken) + "px";
        }
        grid.style.setProperty("grid-template-columns", tokens.join(" "), "important");
        return true;
    }

    function applyGridFit(grid, need, separateColWidth = 0) {
        const cur = grid.style.getPropertyValue("grid-template-columns");
        const ours = grid.dataset.djFitStyle;
        if (cur && cur !== ours) grid.dataset.djOrigInline = cur;
        const mode = grid.dataset.djMode || "";
        const sigNow = need + "|" + separateColWidth + "|" + (mode === "px" ? Math.round(grid.clientWidth) : "");
        if (!forceFit && grid.dataset.djFit === sigNow && cur === ours) return;

        resetGridInline(grid);

        let usedMode = "";
        let spec = grid.dataset.djOrigInline;
        if (!spec) {
            const key = grid.className;
            if (!specCache.has(key)) specCache.set(key, findSheetSpec(grid));
            spec = specCache.get(key);
        }
        spec = resolveSpec(spec, grid);
        const next = spec && !/^\s*var\(/.test(spec) ? transformGridSpec(spec, need, separateColWidth) : null;
        if (next) {
            grid.style.setProperty("grid-template-columns", next, "important");
            if (lastTrackPx(grid) >= need - 1) usedMode = "spec";
            else resetGridInline(grid);
        }
        if (!usedMode && pxFit(grid, need, separateColWidth)) usedMode = "px";

        grid.dataset.djMode = usedMode;
        grid.dataset.djFit = need + "|" + separateColWidth + "|" + (usedMode === "px" ? Math.round(grid.clientWidth) : "");
        grid.dataset.djFitStyle = grid.style.getPropertyValue("grid-template-columns");
    }

    function fitGrids() {
        // [FLICKER FIX Part B] Delegate grid-template-columns ownership to the shared
        // Coordinator when present. The Coordinator (installed by star-ratings.js / DJprep.js)
        // knows about ALL extension columns and writes a single consistent spec. Without this
        // delegation, DJ Info wrote its own (2-track) spec over the Coordinator's (4-track)
        // spec on every MutationObserver tick, causing a ~12 Hz visible jitter.
        const coord = window.SpicetifyGridCoordinator;
        if (coord && typeof coord.version === "number" && coord.version >= 2 && typeof coord.scheduleFit === "function") {
            try { coord.scheduleFit(); } catch (e) { console.error("DJ Info: coordinator fit failed", e); }
            return;
        }

        const groups = new Map();
        const sepWidth = CONFIG.isSeparateColumnEnabled ? DJ_COL_WIDTH : 0;

        const getGroup = row => {
            const key = row.closest('[role="grid"], [role="table"], [data-testid="playlist-tracklist"], [data-testid="track-list"]') || document.body;
            if (!groups.has(key)) {
                groups.set(key, { grids: [], headerIp: null, widestRowIp: null, maxScore: -1, sepEls: [] });
            }
            return groups.get(key);
        };

        getAllHeaderRows().forEach(r => {
            if (!r.querySelector(".djInfoList, .djInfoHeaderCol")) return;
            const ip = getRowInsertionPoint(r, true);
            const grid = ip && ip.parentElement;
            if (!grid || getComputedStyle(grid).display !== "grid") return;
            const g = getGroup(r);
            g.grids.push(grid);
            if (!g.headerIp) g.headerIp = ip;
            const hs = r.querySelector(".djInfoSeparateCol");
            if (hs) g.sepEls.push(hs);
        });

        getAllTrackRows().forEach(r => {
            if (!r.querySelector(".djInfoList, .djInfoHeaderCol")) return;
            const ip = getRowInsertionPoint(r, false);
            const grid = ip && ip.parentElement;
            if (!grid || getComputedStyle(grid).display !== "grid") return;
            const g = getGroup(r);
            g.grids.push(grid);
            if (g.sepEls.length < 9) {
                const rs = r.querySelector(".djInfoSeparateCol");
                if (rs) g.sepEls.push(rs);
            }
            const score = (ip.textContent || "").length + ip.childElementCount * 10;
            if (score > g.maxScore) {
                g.maxScore = score;
                g.widestRowIp = ip;
            }
        });

        groups.forEach(g => {
            let need = 0;
            if (g.headerIp) need = Math.max(need, Math.ceil(g.headerIp.getBoundingClientRect().width));
            if (g.widestRowIp) need = Math.max(need, Math.ceil(g.widestRowIp.getBoundingClientRect().width));
            let sep = sepWidth;
            if (sep > 0) {
                g.sepEls.forEach(el => { sep = Math.max(sep, Math.ceil(el.getBoundingClientRect().width)); });
            }
            g.grids.forEach(grid => applyGridFit(grid, need, sep));
        });
    }

    function debugGrids() {
        const out = [];
        const take = (row, isHeader) => {
            if (!row) return;
            const ip = getRowInsertionPoint(row, isHeader);
            const grid = ip && ip.parentElement;
            if (!grid) return;
            out.push({
                kind: isHeader ? "header" : "row",
                className: grid.className,
                inline: grid.style.getPropertyValue("grid-template-columns"),
                origInline: grid.dataset.djOrigInline || "",
                mode: grid.dataset.djMode || "",
                sheetSpec: findSheetSpec(grid),
                computed: getComputedStyle(grid).gridTemplateColumns,
                coordinatorActive: !!(window.SpicetifyGridCoordinator?.version >= 2)
            });
        };
        take(getAllHeaderRows()[0], true);
        take(getAllTrackRows()[0], false);
        console.log("DJ Info grid debug\n" + JSON.stringify(out, null, 2));
        return out;
    }
    window.djInfoDebugGrids = debugGrids;

    function renderSig(trackId, info) {
        return trackId + "|" + JSON.stringify(CONFIG) + "|" + (info && info.v === 2 ? 2 : 1);
    }

    function addInfoToTrack(row, isRec = false) {
        if (isInsideSearchBarDropdown(row)) return;
        const hasRenderedInfo = row.querySelector(".djinfo") !== null;
        const uri = getTracklistTrackUri(row);
        if (!uri || !uri.includes("track")) return;
        row.dataset.djinfoUri = uri;

        const ip = getRowInsertionPoint(row, false);
        if (!ip) return;

        ip.classList.add("spicetify-ext-lastcol-host");

        let infoBox = row.querySelector(".djInfoList");
        if (CONFIG.isSeparateColumnEnabled) {
            const grid = ip.parentElement;
            // [FLICKER FIX Part A] Insert *before* the first star-ratings / dj-prep
            // separate column, not before `ip`. Keeps DOM order stable at
            // [djinfo] [stars] [djprep] [ip] regardless of who runs last.
            const anchor = getDjInfoSeparateAnchor(grid) || ip;
            if (!infoBox) {
                infoBox = document.createElement("div");
                infoBox.className = "djInfoList djInfoSeparateCol";
                infoBox.setAttribute("role", "gridcell");
                grid.insertBefore(infoBox, anchor);
            } else {
                infoBox.classList.add("djInfoSeparateCol");
                infoBox.setAttribute("role", "gridcell");
                infoBox.style.cssText = "";
                if (infoBox.parentElement !== grid || infoBox.nextElementSibling !== anchor) {
                    grid.insertBefore(infoBox, anchor);
                }
            }
        } else {
            if (!infoBox) {
                infoBox = document.createElement("div");
                infoBox.className = "djInfoList";
                infoBox.style.cssText = "display: inline-flex; align-items: center; justify-content: center; min-width: 110px; margin-right: 14px; flex-shrink: 0; z-index: 10;";
                ip.insertBefore(infoBox, ip.firstChild);
            } else {
                infoBox.classList.remove("djInfoSeparateCol");
                infoBox.removeAttribute("role");
                infoBox.style.cssText = "display: inline-flex; align-items: center; justify-content: center; min-width: 110px; margin-right: 14px; flex-shrink: 0; z-index: 10;";
                if (ip.firstElementChild !== infoBox) {
                    ip.insertBefore(infoBox, ip.firstChild);
                }
            }
        }

        const trackId = uri.split(":")[2];
        const info = trackDb[trackId];
        if (info) {
            if (!isInfoComplete(info) && !refetchTried.has(trackId)) {
                refetchTried.add(trackId);
                queueTrackInfo(trackId, row);
            }
            if (hasRenderedInfo && row.dataset.djinfoVer === renderSig(trackId, info)) return;
            row.dataset.djinfoVer = renderSig(trackId, info);
            if (CONFIG.isRichUiEnabled && infoBox) {
                const wrap = document.createElement("div");
                wrap.className = "dj-info-grid djinfo djinfo-animate";
                const topRow = document.createElement("div");
                topRow.className = "dj-info-row-top";
                if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) {
                    const keyStr = getKeyInNotation(info.key, info.mode);
                    const tag = document.createElement("span");
                    tag.className = "dj-info-tag";
                    tag.innerText = keyStr;
                    if (CONFIG.isCamelotEnabled) {
                        const m = keyStr.match(/(\d+[AB])/);
                        if (m) tag.classList.add("camelot-key-" + m[1]);
                        else tag.style.backgroundColor = "#e0e0e0";
                    } else {
                        tag.style.backgroundColor = "#e0e0e0";
                    }
                    topRow.appendChild(tag);
                }
                if (CONFIG.isBPMEnabled) {
                    const bpmSpan = document.createElement("span");
                    bpmSpan.innerText = Math.round(info.tempo) + " bpm";
                    topRow.appendChild(bpmSpan);
                }
                const botRow = document.createElement("div");
                botRow.className = "dj-info-row-bottom";
                const items = [];
                if (CONFIG.isEnergyEnabled) items.push("E " + info.energy);
                if (CONFIG.isDanceEnabled) items.push("D " + info.danceability);
                if (CONFIG.isAcousticnessEnabled) items.push("A " + info.acousticness);
                if (CONFIG.isInstrumentalnessEnabled) items.push("I " + info.instrumentalness);
                if (CONFIG.isLivenessEnabled) items.push("L " + info.liveness);
                if (CONFIG.isLoudnessEnabled) items.push("dB " + Math.round(10 * info.loudness) / 10);
                if (CONFIG.isSpeechinessEnabled) items.push("S " + info.speechiness);
                if (CONFIG.isValenceEnabled) items.push("V " + info.valence);
                if (CONFIG.isTimeSignatureEnabled) items.push(info.time_signature + "/4");
                if (CONFIG.isPopularityEnabled) items.push("♥ " + info.popularity);
                if (CONFIG.isYearEnabled && info.release_date) items.push(String(info.release_date));
                items.forEach((txt, idx) => {
                    const sp = document.createElement("span");
                    sp.innerText = txt;
                    sp.className = "dj-info-row-info";
                    botRow.appendChild(sp);
                    if (idx < items.length - 1) {
                        const sep = document.createElement("span");
                        sep.className = "dj-info-separator";
                        sep.innerText = "/";
                        botRow.appendChild(sep);
                    }
                });
                wrap.appendChild(topRow);
                if (items.length > 0) wrap.appendChild(botRow);
                infoBox.innerHTML = "";
                infoBox.appendChild(wrap);
            } else if (infoBox) {
                const keyStr = getKeyInNotation(info.key, info.mode);
                const wrap = document.createElement("div");
                wrap.className = "dj-info-classic-container djinfo djinfo-animate";
                const items = [];
                if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) items.push("𝄞 " + keyStr);
                if (CONFIG.isBPMEnabled) items.push(Math.round(info.tempo) + " ♫");
                if (CONFIG.isEnergyEnabled) items.push("E " + info.energy);
                if (CONFIG.isDanceEnabled) items.push("D " + info.danceability);
                if (CONFIG.isAcousticnessEnabled) items.push("A " + info.acousticness);
                if (CONFIG.isInstrumentalnessEnabled) items.push("I " + info.instrumentalness);
                if (CONFIG.isLivenessEnabled) items.push("L " + info.liveness);
                if (CONFIG.isLoudnessEnabled) items.push("dB " + Math.round(10 * info.loudness) / 10);
                if (CONFIG.isSpeechinessEnabled) items.push("S " + info.speechiness);
                if (CONFIG.isValenceEnabled) items.push("V " + info.valence);
                if (CONFIG.isTimeSignatureEnabled) items.push("Sig " + info.time_signature + "/4");
                if (CONFIG.isPopularityEnabled) items.push("♥ " + info.popularity);
                if (CONFIG.isYearEnabled && info.release_date) items.push(String(info.release_date));
                wrap.style["grid-template-columns"] = items.length === 4 ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))";
                items.forEach(txt => {
                    const sp = document.createElement("span");
                    sp.className = "dj-info-classic-item";
                    sp.innerText = txt;
                    wrap.appendChild(sp);
                });
                infoBox.innerHTML = "";
                infoBox.appendChild(wrap);
            }
        } else {
            if (hasRenderedInfo) {
                row.querySelector(".djinfo")?.remove();
            }
            queueTrackInfo(trackId, row);
        }
    }

    function updateAllTracklists(intersectionObs) {
        if (!CONFIG.isPlaylistEnabled) return;

        document.querySelectorAll(".djInfoHeaderCol, .djInfoList").forEach(el => {
            if (isInsideSearchBarDropdown(el)) el.remove();
        });

        getAllHeaderRows().forEach(header => {
            const ip = getRowInsertionPoint(header, true);
            if (!ip) return;
            ip.classList.add("spicetify-ext-lastcol-host");

            let hCol = header.querySelector(".djInfoHeaderCol");
            if (CONFIG.isSeparateColumnEnabled) {
                const grid = ip.parentElement;
                // [FLICKER FIX Part A] Same order-aware anchor for the header
                const anchor = getDjInfoSeparateAnchor(grid) || ip;
                if (!hCol) {
                    hCol = document.createElement("div");
                    hCol.className = "djInfoHeaderCol djInfoSeparateCol";
                    hCol.setAttribute("role", "columnheader");
                    hCol.innerHTML = '<span class="encore-text encore-text-body-small djinfoheader" style="color:var(--spice-subtext, #b3b3b3); font-size: 12px; font-weight: 400;">DJ Info</span>';
                    grid.insertBefore(hCol, anchor);
                } else {
                    hCol.classList.add("djInfoSeparateCol");
                    hCol.setAttribute("role", "columnheader");
                    hCol.style.cssText = "";
                    if (hCol.parentElement !== grid || hCol.nextElementSibling !== anchor) {
                        grid.insertBefore(hCol, anchor);
                    }
                }
            } else {
                if (!hCol) {
                    hCol = document.createElement("div");
                    hCol.className = "djInfoHeaderCol";
                    hCol.style.cssText = "display: inline-flex; align-items: center; justify-content: center; min-width: 110px; margin-right: 14px; flex-shrink: 0;";
                    hCol.innerHTML = '<span class="encore-text encore-text-body-small djinfoheader" style="color:var(--spice-subtext, #b3b3b3); font-size: 12px; font-weight: 400;">DJ Info</span>';
                    ip.insertBefore(hCol, ip.firstChild);
                } else {
                    hCol.classList.remove("djInfoSeparateCol");
                    hCol.removeAttribute("role");
                    hCol.style.cssText = "display: inline-flex; align-items: center; justify-content: center; min-width: 110px; margin-right: 14px; flex-shrink: 0;";
                    if (ip.firstElementChild !== hCol) {
                        ip.insertBefore(hCol, ip.firstChild);
                    }
                }
            }
        });

        getAllTrackRows().forEach(row => {
            const isRec = row.closest('[data-testid="recommended-track"]') !== null;
            if (isRec && !CONFIG.isRecommendationsEnabled) return;
            const hasInfo = row.querySelector(".djinfo") !== null;
            const rowId = row.dataset.djinfoUri ? row.dataset.djinfoUri.split(":")[2] : null;
            const stale = hasInfo && rowId && trackDb[rowId] && row.dataset.djinfoVer !== renderSig(rowId, trackDb[rowId]);
            if (!row.classList.contains("dj-observed") || !hasInfo || stale) {
                row.classList.add("dj-observed");
                addInfoToTrack(row, isRec);
                if (intersectionObs) intersectionObs.observe(row);
            }
        });

        scheduleSelfCheck();
    }

    // --- NOW PLAYING BAR WIDGET ---
    let nowPlayingWidgetEl = null;

    function findNowPlayingWidget() {
        const list = [
            ...document.querySelectorAll('[data-testid="now-playing-widget-v2"]'),
            ...document.querySelectorAll('[data-testid="now-playing-widget"]'),
            ...document.querySelectorAll(".main-nowPlayingWidget-nowPlaying")
        ];
        return list.find(el => el.getClientRects().length > 0) || list[0] || null;
    }

    function findTrackInfo(widget) {
        if (!widget) return null;
        const legacy = widget.querySelector(".main-trackInfo-container");
        if (legacy) return legacy;
        let cover = widget.querySelector('[data-testid="cover-art-container"], [data-testid="cover-art-button"], [data-testid="CoverSlotCollapsed__container"]');
        while (cover && cover.parentElement && cover.parentElement !== widget) {
            cover = cover.parentElement;
        }
        return cover?.nextElementSibling || widget.children[1] || null;
    }

    async function updateNowPlayingWidget() {
        if (!nowPlayingWidgetEl || !CONFIG.isNowPlayingEnabled) return;
        const uri = Spicetify.Player?.data?.item?.uri || Spicetify.Player?.data?.track?.uri || null;
        if (!uri) {
            nowPlayingWidgetEl.style.display = "none";
            return;
        }
        const isTrack = uri.includes("track");
        nowPlayingWidgetEl.style.display = isTrack ? "flex" : "none";
        if (uri.split(":")[1] === "local") {
            nowPlayingWidgetEl.innerHTML = "";
            return;
        }
        const trackId = uri.split(":")[2];
        const info = await getTrackInfo(trackId);
        if (info) {
            const list = [];
            if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) list.push(getKeyInNotation(info.key, info.mode));
            if (CONFIG.isBPMEnabled) list.push(Math.round(info.tempo) + " ♫");
            if (CONFIG.isEnergyEnabled) list.push("E " + info.energy);
            if (CONFIG.isDanceEnabled) list.push("D " + info.danceability);
            if (CONFIG.isAcousticnessEnabled) list.push("A " + info.acousticness);
            if (CONFIG.isInstrumentalnessEnabled) list.push("I " + info.instrumentalness);
            if (CONFIG.isLivenessEnabled) list.push("L " + info.liveness);
            if (CONFIG.isLoudnessEnabled) list.push("dB " + Math.round(10 * info.loudness) / 10);
            if (CONFIG.isSpeechinessEnabled) list.push("S " + info.speechiness);
            if (CONFIG.isValenceEnabled) list.push("V " + info.valence);
            if (CONFIG.isTimeSignatureEnabled) list.push(info.time_signature + "/4");
            if (CONFIG.isPopularityEnabled) list.push("♥ " + info.popularity);
            if (CONFIG.isYearEnabled && info.release_date) list.push(String(info.release_date));
            nowPlayingWidgetEl.innerHTML = list.join("<br>");
            nowPlayingWidgetEl.classList.remove("djinfo-animate");
            void nowPlayingWidgetEl.offsetWidth;
            nowPlayingWidgetEl.classList.add("djinfo-animate");
        } else {
            nowPlayingWidgetEl.innerHTML = "";
            getTrackInfo(trackId).then(res => { if (res) updateNowPlayingWidget(); });
        }
        nowPlayingWidgetEl.style.fontSize = "11px";
    }

    (async function initDjInfo() {
        while (!Spicetify?.showNotification || !Spicetify?.CosmosAsync || !Spicetify?.URI) {
            await new Promise(r => setTimeout(r, 300));
        }

        loadConfig();
        initStyles();
        await idb.init();
        await initProductState();
        registerSettingsMenu();
        Spicetify.Player.addEventListener("songchange", () => updateNowPlayingWidget());

        if (window.djInfoObserver) window.djInfoObserver.disconnect();
        const intersectionObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const isRec = target.closest('[data-testid="recommended-track"]') !== null;
                    addInfoToTrack(target, isRec);
                    intersectionObs.unobserve(target);
                }
            });
        }, { rootMargin: "200px" });
        window.djInfoObserver = intersectionObs;

        let prevWidget = null;
        let currWidget = null;
        let observedMain = null;

        const resizeObs = new ResizeObserver(() => { specCache.clear(); try { fitGrids(); } catch {} });
        if (window.djInfoResizeObserver) window.djInfoResizeObserver.disconnect();
        window.djInfoResizeObserver = resizeObs;

        if (window.djInfoStyleObserver) window.djInfoStyleObserver.disconnect();
        let styleRaf = 0;
        let observedStyleRoots = new WeakSet();
        const styleObs = new MutationObserver(records => {
            if (styleRaf) return;
            let relevant = false;
            for (const r of records) {
                const t = r.target;
                if (!t || !t.style) continue;
                if (t.dataset && t.dataset.djFit !== undefined) {
                    if (t.style.getPropertyValue("grid-template-columns") !== t.dataset.djFitStyle) {
                        relevant = true;
                        break;
                    }
                } else if (t.style.cssText.indexOf("--") !== -1) {
                    relevant = true;
                    break;
                }
            }
            if (!relevant) return;
            styleRaf = requestAnimationFrame(() => {
                styleRaf = 0;
                forceFit = true;
                try { fitGrids(); } catch {}
                forceFit = false;
            });
        });
        window.djInfoStyleObserver = styleObs;

        function bindTracklistStyleObserver() {
            const mainEl = document.querySelector("main");
            if (!mainEl) return;
            const roots = mainEl.querySelectorAll('[data-testid="playlist-tracklist"], [data-testid="track-list"], .main-trackList-indexable, [role="grid"], [role="table"]');
            roots.forEach(root => {
                if (!observedStyleRoots.has(root)) {
                    styleObs.observe(root, { attributes: true, attributeFilter: ["style"], subtree: true });
                    observedStyleRoots.add(root);
                }
            });
        }

        function runUpdate() {
            updateAllTracklists(intersectionObs);
            bindTracklistStyleObserver();
            try { fitGrids(); } catch (e) { console.error("DJ Info: grid fit failed", e); }
            const mainEl = document.querySelector("main");
            if (mainEl && mainEl !== observedMain) {
                resizeObs.disconnect();
                resizeObs.observe(mainEl);
                observedMain = mainEl;
            }
            prevWidget = currWidget;
            currWidget = findNowPlayingWidget();
            if (currWidget && (!currWidget.isEqualNode(prevWidget) || !currWidget.querySelector(".dj-info-now-playing"))) {
                const pEl = document.createElement("p");
                pEl.classList.add("dj-info-now-playing");
                const infoEl = findTrackInfo(currWidget);
                if (infoEl) {
                    if (CONFIG.isLeftPlayingEnabled) infoEl.before(pEl);
                    else infoEl.after(pEl);
                } else {
                    currWidget.append(pEl);
                }
                currWidget.classList.add("dj-info-now-playing-parent");
                currWidget.parentElement?.classList.add("dj-info-now-playing-parent");
                currWidget.parentElement?.parentElement?.classList.add("dj-info-now-playing-parent");
                nowPlayingWidgetEl = pEl;
                updateNowPlayingWidget();
            }
        }

        onConfigChange = debounce((changedField) => {
            if (changedField === "isSeparateColumnEnabled") {
                forceFit = true;
                runUpdate();
                forceFit = false;
            } else {
                runUpdate();
            }
            updateNowPlayingWidget();
        }, 80);

        const debouncedUpdate = debounce(runUpdate, 80);
        if (window.djInfoMutationObserver) window.djInfoMutationObserver.disconnect();
        const mutObs = new MutationObserver(debouncedUpdate);
        runUpdate();
        mutObs.observe(document.body, { childList: true, subtree: true });
        window.djInfoMutationObserver = mutObs;
    })();
})();
// === END OF DJ INFO ===