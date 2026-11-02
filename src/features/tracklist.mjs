import { CONFIG } from '../ui/config.mjs';
import { trackDb } from '../db/trackDb.mjs';
import { getRowTrackUri, getKeyInNotation } from '../utils/track.mjs';
import { GridCoordinator } from '../utils/gridCoordinator.mjs';

const { isInsideSearchBarDropdown, getAllHeaderRows, getAllTrackRows, getRowInsertionPoint } =
  GridCoordinator;

const MIN_WIDTH = 550;
const DOCKED_STYLE =
  'display: inline-flex; align-items: center; justify-content: center; min-width: 110px; margin-right: 14px; flex-shrink: 0; z-index: 10;';
const DOCKED_HEADER_STYLE =
  'display: inline-flex; align-items: center; justify-content: center; min-width: 110px; margin-right: 14px; flex-shrink: 0;';

// Width of the DJ Info column in separate-column mode, set by the drag handle on its header.
const COL_DEFAULT = 118;
const COL_MAX = 320;
export const COL_MIN_LIMIT = 60; // lowest value the "minimum column width" setting accepts
export const COL_MAX_LIMIT = 300; // highest value the setting accepts
const COL_KEY = 'djinfo-col-width';
// ---- Where to nudge the drag handle (px) ----
// The handle copies the position, height and width of Spotify's own column separators, so these should
// normally stay 0. Positive X moves the handle to the right, positive Y moves it down.
// Without editing code, the same can be done from user.css, for example:
//   .djInfoResizeHandle { transform: translateY(-2px) !important; }
const HANDLE_OFFSET_X = 0;
const HANDLE_OFFSET_Y = 0;
// ---- Header label alignment ----
// 'left': the label starts at the left edge of its column, like Spotify's own headers (Date added, BPM...).
// 'center': the label is centred over the column.
const HEADER_LABEL_ALIGN = 'left';
// Smallest width the user allows (settings), never above what the setting itself can hold
const getColMin = () => {
  const v = parseInt(CONFIG && CONFIG.djInfoMinColWidth, 10);
  return Number.isFinite(v) ? Math.min(COL_MAX_LIMIT, Math.max(COL_MIN_LIMIT, v)) : COL_DEFAULT;
};
const clampColWidth = (px) => {
  const min = getColMin();
  return Math.min(Math.max(COL_MAX, min), Math.max(min, Math.round(px)));
};
function loadColWidth() {
  try {
    const v = parseFloat(window.localStorage.getItem(COL_KEY));
    return Number.isFinite(v) ? v : COL_DEFAULT;
  } catch {
    return COL_DEFAULT;
  }
}
// CONFIG is loaded after this module is evaluated, so read the stored width lazily
let colWidth = null;
const currentWidth = () => {
  if (colWidth === null) colWidth = loadColWidth();
  return clampColWidth(colWidth);
};

let queueTrackInfoFn = null;

// Tracks whose popularity/year we already tried to complete this session (prevents refetch loops)
const refetchTried = new Set();

export function setQueueTrackInfo(fn) {
  queueTrackInfoFn = fn;
}

const isTooNarrow = () => window.innerWidth < MIN_WIDTH;

// Re-render when the row shows another track (Spotify reuses row nodes while virtual-scrolling),
// when the data for the track changed, or when any setting changed.
const renderSig = (id, info) =>
  `${id}|${info.popularity}|${info.release_date}|${JSON.stringify(CONFIG)}`;

// Order of extension columns, left to right: [DJ Info] [Star Ratings] [DJ Prep] [native last cell].
// DJ Info always goes before the first Star Ratings / DJ Prep separate column so the DOM order stays
// stable no matter which extension renders last.
const getSeparateAnchor = (grid) =>
  grid.querySelector('.starRatingsSeparateCol, .djPrepSeparateCol');

/** Returns every DJ Info cell/header currently in the DOM except those in recommendations. */
function removeDjInfoCells(root = document) {
  root.querySelectorAll('.djInfoHeaderCol, .djInfoList').forEach((el) => {
    if (!el.closest('[data-testid="recommended-track"]')) el.remove();
  });
}

const OUR_HEADER_SELECTOR =
  '.djInfoHeaderCol, .starRatingsHeader, .djprep-header-wrapper, .spicetify-ext-separate-col, .spicetify-ext-lastcol-host';

// Distance between the left edge of one of Spotify's header cells and its label (usually 0).
function nativeLabelInset(header) {
  const row = header.parentElement;
  if (!row) return 0;
  for (const cell of Array.from(row.children)) {
    if (cell.getAttribute('role') !== 'columnheader' || cell.matches(OUR_HEADER_SELECTOR)) continue;
    const label = cell.querySelector('span');
    if (!label) continue;
    const d = label.getBoundingClientRect().left - cell.getBoundingClientRect().left;
    if (d >= 0 && d < 60) return Math.round(d);
  }
  return 0;
}

// Aligns the label of the header cell (call once the header is inside its grid row).
function alignHeaderLabel(header) {
  const left = HEADER_LABEL_ALIGN === 'left';
  const set = (prop, value) => {
    if (value === '') {
      if (header.style.getPropertyValue(prop) !== '') header.style.removeProperty(prop);
    } else if (header.style.getPropertyValue(prop) !== value) header.style.setProperty(prop, value);
  };
  set('justify-content', left ? 'flex-start' : 'center');
  set('padding-left', left ? nativeLabelInset(header) + 'px' : '');
}

function placeCell(cell, ip, isHeader) {
  const grid = ip.parentElement;
  if (CONFIG.isSeparateColumnEnabled) {
    const anchor = getSeparateAnchor(grid) || ip;
    cell.classList.add('djInfoSeparateCol');
    cell.setAttribute('role', isHeader ? 'columnheader' : 'gridcell');
    cell.style.cssText = '';
    setCellWidth(cell, currentWidth());
    if (cell.parentElement !== grid || cell.nextElementSibling !== anchor) {
      grid.insertBefore(cell, anchor);
    }
    if (isHeader) alignHeaderLabel(cell);
  } else {
    cell.classList.remove('djInfoSeparateCol');
    cell.removeAttribute('role');
    cell.style.cssText = isHeader ? DOCKED_HEADER_STYLE : DOCKED_STYLE;
    if (ip.firstElementChild !== cell) ip.insertBefore(cell, ip.firstChild);
  }
}

// Header label that copies Spotify's own column-header label (class + attributes) so our header
// matches the native ones. Falls back to a plain 12px grey label if none is found.
function makeHeaderLabel(header, text, extraClass) {
  const label = document.createElement('span');
  label.textContent = text;
  const native = header.querySelector("[role='columnheader'] span");
  if (native) {
    label.className = native.className;
    for (const attr of Array.from(native.attributes)) {
      if (attr.name !== 'class' && attr.name !== 'style') label.setAttribute(attr.name, attr.value);
    }
  } else {
    label.className = 'encore-text encore-text-body-small';
    label.style.cssText =
      'color: var(--spice-subtext, #b3b3b3); font-size: 12px; font-weight: 400;';
  }
  if (extraClass) label.classList.add(extraClass);
  return label;
}

function ensureHeaderCell(header) {
  const ip = getRowInsertionPoint(header, true);
  if (!ip) return;
  ip.classList.add('spicetify-ext-lastcol-host');

  let headerCol = header.querySelector('.djInfoHeaderCol');
  if (!headerCol) {
    headerCol = document.createElement('div');
    headerCol.className = 'djInfoHeaderCol';
    headerCol.appendChild(makeHeaderLabel(header, 'DJ Info', 'djinfoheader'));
  }
  if (CONFIG.isSeparateColumnEnabled) ensureResizeHandle(headerCol);
  else {
    onResizeEnd();
    headerCol.querySelector('.djInfoResizeHandle')?.remove();
  }
  placeCell(headerCol, ip, true);
}

function setCellWidth(el, px) {
  const w = px + 'px';
  if (el.style.width !== w) el.style.width = w;
  if (el.style.minWidth !== w) el.style.minWidth = w;
  // Tells the grid coordinator how narrow this column is allowed to get
  const min = String(getColMin());
  if (el.getAttribute('data-ext-col-min') !== min) el.setAttribute('data-ext-col-min', min);
}

// Called when the "minimum column width" setting changes: re-clamps and refits right away.
export function applyColumnLimits() {
  setColWidth(currentWidth(), true);
}

// Applies a new DJ Info width to every DJ Info cell and refits the grids.
function setColWidth(px, persist) {
  colWidth = clampColWidth(px);
  document.querySelectorAll('.djInfoSeparateCol').forEach((el) => setCellWidth(el, colWidth));
  document.querySelectorAll('.djInfoResizeHandle').forEach((h) => {
    h.setAttribute('aria-valuemin', String(getColMin()));
    h.setAttribute('aria-valuemax', String(Math.max(COL_MAX, getColMin())));
    h.setAttribute('aria-valuenow', String(colWidth));
  });
  GridCoordinator.scheduleFit(true);
  if (persist) {
    try {
      window.localStorage.setItem(COL_KEY, String(colWidth));
    } catch {}
  }
}

let drag = null;
function onResizeMove(e) {
  if (!drag || e.pointerId !== drag.id) return;
  // The handle can be re-rendered or removed mid-drag (no lostpointercapture is guaranteed then)
  if (!drag.handle.isConnected) {
    onResizeEnd();
    return;
  }
  if (e.clientX !== drag.startX) drag.moved = true;
  setColWidth(drag.startW + (e.clientX - drag.startX), false);
}
function onResizeEnd(e) {
  if (!drag || (e && e.pointerId !== drag.id)) return;
  const { moved } = drag;
  drag = null;
  document.body.classList.remove('djInfoResizing');
  window.removeEventListener('pointermove', onResizeMove);
  window.removeEventListener('pointerup', onResizeEnd);
  window.removeEventListener('pointercancel', onResizeEnd);
  window.removeEventListener('blur', onResizeEnd);
  if (moved) setColWidth(currentWidth(), true);
}

// One of Spotify's own column separators in the same header row (we copy its geometry).
function nativeSeparator(header) {
  const row = header.parentElement;
  if (!row) return null;
  const list = row.querySelectorAll('[role="separator"][aria-label="Resize columns"]');
  for (const s of Array.from(list)) {
    if (s.getBoundingClientRect().height > 0) return s;
  }
  return null;
}

function setStyle(el, prop, value) {
  if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
}

// Gives our handle the same vertical position, height, width and distance from the column edge as
// Spotify's own separators. Returns false while the header isn't laid out yet (or no native one exists).
function alignHandle(header, h) {
  const n = nativeSeparator(header);
  const cell = n && n.parentElement;
  const hr = header.getBoundingClientRect();
  if (!n || !cell || hr.height <= 0) return false;
  const nr = n.getBoundingClientRect();
  const cr = cell.getBoundingClientRect();
  setStyle(h, 'top', Math.round(nr.top - hr.top + HANDLE_OFFSET_Y) + 'px');
  setStyle(h, 'height', Math.round(nr.height) + 'px');
  setStyle(h, 'bottom', 'auto');
  setStyle(h, 'width', (Math.round(nr.width) || 8) + 'px');
  setStyle(h, 'right', Math.round(cr.right - nr.right - HANDLE_OFFSET_X) + 'px');
  return true;
}

function alignHandleSoon(header, h, tries) {
  if (tries <= 0) return;
  requestAnimationFrame(() => {
    if (h.isConnected && !alignHandle(header, h)) alignHandleSoon(header, h, tries - 1);
  });
}

// Drag handle on the right edge of the DJ Info header. It reuses Spotify's separator class so it
// looks like the native one, but it has its own drag logic (Spotify's handler is bound to its columns).
function ensureResizeHandle(headerCol) {
  const existing = headerCol.querySelector('.djInfoResizeHandle');
  if (existing) {
    alignHandle(headerCol, existing);
    return;
  }
  const h = document.createElement('div');
  h.className = 'djInfoResizeHandle VJ6bK4WKtyILTdvBAkHv';
  h.setAttribute('role', 'separator');
  h.setAttribute('aria-orientation', 'horizontal');
  h.setAttribute('aria-label', 'Resize DJ Info column');
  h.setAttribute('aria-valuemin', String(getColMin()));
  h.setAttribute('aria-valuemax', String(Math.max(COL_MAX, getColMin())));
  h.setAttribute('aria-valuenow', String(currentWidth()));
  h.draggable = false;
  h.tabIndex = 0;
  h.style.cssText =
    'position: absolute; top: 0; right: 0; bottom: 0; width: 8px; cursor: col-resize; z-index: 12;';
  h.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onResizeEnd(); // never stack a second drag on a stuck one
    drag = { id: e.pointerId, startX: e.clientX, startW: currentWidth(), moved: false, handle: h };
    // Capture keeps pointermove/pointerup coming even when the mouse leaves the window
    try {
      h.setPointerCapture(e.pointerId);
    } catch {}
    document.body.classList.add('djInfoResizing');
    window.addEventListener('pointermove', onResizeMove);
    window.addEventListener('pointerup', onResizeEnd);
    window.addEventListener('pointercancel', onResizeEnd);
    window.addEventListener('blur', onResizeEnd);
  });
  // If the handle is removed or loses capture mid-drag, finish cleanly instead of sticking
  h.addEventListener('lostpointercapture', onResizeEnd);
  // Keyboard: arrows nudge the width (Shift = larger step), Home resets
  h.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 24 : 8;
    if (e.key === 'ArrowRight') setColWidth(currentWidth() + step, true);
    else if (e.key === 'ArrowLeft') setColWidth(currentWidth() - step, true);
    else if (e.key === 'Home') setColWidth(COL_DEFAULT, true);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });
  // Double-click resets the column to its default width
  h.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    setColWidth(COL_DEFAULT, true);
  });
  headerCol.appendChild(h);
  if (!alignHandle(headerCol, h)) alignHandleSoon(headerCol, h, 8);
}

function ensureRowCell(track) {
  const ip = getRowInsertionPoint(track, false);
  if (!ip) return null;
  ip.classList.add('spicetify-ext-lastcol-host');

  let djInfoColumn = track.querySelector('.djInfoList');
  if (!djInfoColumn) {
    djInfoColumn = document.createElement('div');
    djInfoColumn.className = 'djInfoList';
  }
  placeCell(djInfoColumn, ip, false);
  return djInfoColumn;
}

export function addInfoToTrack(track, isRecommendation = false) {
  if (isInsideSearchBarDropdown(track)) return;
  const hasdjinfo = track.querySelector('.djinfo') !== null;
  const trackUri = getRowTrackUri(track);

  if (!trackUri) return;

  const isTrack = trackUri.includes('track');
  if (!isTrack) return;

  // Re-check if it's a recommendation just in case
  if (!isRecommendation) {
    isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
  }

  if (!isRecommendation && isTooNarrow()) return;

  track.dataset.djinfoUri = trackUri;
  const djInfoColumn = ensureRowCell(track);

  const uri = trackUri;
  const id = uri.split(':')[2];
  const info = trackDb[id];

  if (info) {
    if (info.v !== 2 && !refetchTried.has(id)) {
      refetchTried.add(id);
      if (queueTrackInfoFn) queueTrackInfoFn(id, track);
    }
    const sig = renderSig(id, info);
    if (hasdjinfo && track.dataset.djinfoVer === sig) {
      GridCoordinator.scheduleFit();
      return;
    }
    track.dataset.djinfoVer = sig;

    // Rich UI Implementation
    if (CONFIG.isRichUiEnabled && djInfoColumn) {
      const parsedInfo = info;
      const container = document.createElement('div');
      container.className = 'dj-info-grid djinfo djinfo-animate';

      const topRow = document.createElement('div');
      topRow.className = 'dj-info-row-top';

      if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) {
        const keyContent = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
        const keyTag = document.createElement('span');
        keyTag.className = 'dj-info-tag';
        keyTag.innerText = keyContent;
        if (CONFIG.isCamelotEnabled) {
          const match = keyContent.match(/(\d+[AB])/);
          if (match) {
            keyTag.classList.add(`camelot-key-${match[1]}`);
          } else {
            keyTag.style.backgroundColor = '#e0e0e0';
          }
        } else {
          keyTag.style.backgroundColor = '#e0e0e0';
        }
        topRow.appendChild(keyTag);
      }

      if (CONFIG.isBPMEnabled) {
        const bpmSpan = document.createElement('span');
        bpmSpan.innerText = `${Math.round(parsedInfo.tempo)}\u00a0bpm`;
        topRow.appendChild(bpmSpan);
      }

      const bottomRow = document.createElement('div');
      bottomRow.className = 'dj-info-row-bottom';

      let bottomStats = [];
      if (CONFIG.isEnergyEnabled) bottomStats.push(`E ${parsedInfo.energy}`);
      if (CONFIG.isDanceEnabled) bottomStats.push(`D ${parsedInfo.danceability}`);
      if (CONFIG.isAcousticnessEnabled) bottomStats.push(`A ${parsedInfo.acousticness}`);
      if (CONFIG.isInstrumentalnessEnabled) bottomStats.push(`I ${parsedInfo.instrumentalness}`);
      if (CONFIG.isLivenessEnabled) bottomStats.push(`L ${parsedInfo.liveness}`);
      if (CONFIG.isLoudnessEnabled)
        bottomStats.push(`dB ${Math.round(parsedInfo.loudness * 10) / 10}`);
      if (CONFIG.isSpeechinessEnabled) bottomStats.push(`S ${parsedInfo.speechiness}`);
      if (CONFIG.isValenceEnabled) bottomStats.push(`V ${parsedInfo.valence}`);
      if (CONFIG.isTimeSignatureEnabled) bottomStats.push(`${parsedInfo.time_signature}/4`);
      if (CONFIG.isPopularityEnabled && parsedInfo.popularity != null)
        bottomStats.push(`♥ ${parsedInfo.popularity}`);
      if (CONFIG.isYearEnabled && parsedInfo.release_date)
        bottomStats.push(`${parsedInfo.release_date}`);

      if (bottomStats.length > 0) {
        bottomStats.forEach((stat, i) => {
          const span = document.createElement('span');
          span.innerText = stat;
          span.className = 'dj-info-row-info';
          bottomRow.appendChild(span);
          if (i < bottomStats.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'dj-info-separator';
            sep.innerText = '/';
            bottomRow.appendChild(sep);
          }
        });
      }

      container.appendChild(topRow);
      if (bottomStats.length > 0) {
        container.appendChild(bottomRow);
      }

      djInfoColumn.innerHTML = '';
      djInfoColumn.appendChild(container);
    }
    // Classic UI Implementation
    else if (djInfoColumn) {
      const parsedInfo = info;
      const keyInNotation = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
      const container = document.createElement('div');
      container.className = 'dj-info-classic-container djinfo djinfo-animate';

      const dataPoints = [];

      if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) {
        dataPoints.push('𝄞 ' + keyInNotation);
      }

      if (CONFIG.isBPMEnabled) {
        dataPoints.push(Math.round(parsedInfo.tempo) + ' ♫');
      }

      if (CONFIG.isEnergyEnabled) {
        dataPoints.push('E ' + parsedInfo.energy);
      }

      if (CONFIG.isDanceEnabled) {
        dataPoints.push('D ' + parsedInfo.danceability);
      }

      if (CONFIG.isAcousticnessEnabled) {
        dataPoints.push('A ' + parsedInfo.acousticness);
      }

      if (CONFIG.isInstrumentalnessEnabled) {
        dataPoints.push('I ' + parsedInfo.instrumentalness);
      }

      if (CONFIG.isLivenessEnabled) {
        dataPoints.push('L ' + parsedInfo.liveness);
      }

      if (CONFIG.isLoudnessEnabled) {
        dataPoints.push('dB ' + Math.round(parsedInfo.loudness * 10) / 10);
      }

      if (CONFIG.isSpeechinessEnabled) {
        dataPoints.push('S ' + parsedInfo.speechiness);
      }

      if (CONFIG.isValenceEnabled) {
        dataPoints.push('V ' + parsedInfo.valence);
      }

      if (CONFIG.isTimeSignatureEnabled) {
        dataPoints.push('Sig ' + parsedInfo.time_signature + '/4');
      }

      if (CONFIG.isPopularityEnabled && parsedInfo.popularity != null) {
        dataPoints.push('♥ ' + parsedInfo.popularity);
      }

      if (CONFIG.isYearEnabled && parsedInfo.release_date) {
        dataPoints.push(parsedInfo.release_date);
      }

      const grid =
        dataPoints.length == 4 ? 'repeat(2, minmax(0, 1fr))' : `repeat(3, minmax(0, 1fr))`;
      container.style['grid-template-columns'] = grid;

      dataPoints.forEach((text, index) => {
        const span = document.createElement('span');
        span.className = 'dj-info-classic-item';
        span.innerText = text;
        container.appendChild(span);
      });

      djInfoColumn.innerHTML = '';
      djInfoColumn.appendChild(container);
    }
  } else {
    if (hasdjinfo) {
      const djinfoElement = track.querySelector('.djinfo');
      if (djinfoElement) djinfoElement.remove();
    }
    if (queueTrackInfoFn) {
      queueTrackInfoFn(id, track);
    }
  }

  GridCoordinator.scheduleFit();
}

/**
 * Tracklist roots: the legacy `.main-trackList-indexable` plus role/data-testid fallbacks for
 * newer Spotify clients. Nested roots and search dropdowns are ignored.
 */
export function findTracklistRoots() {
  const found = Array.from(
    document.querySelectorAll(
      'main .main-trackList-indexable, main [data-testid="playlist-tracklist"], main [data-testid="track-list"], main [role="grid"]',
    ),
  ).filter((el) => !isInsideSearchBarDropdown(el));
  return found.filter((el) => !found.some((other) => other !== el && other.contains(el)));
}

export function updateTracklist(tracklist, trackIntersectionObserver) {
  if (!CONFIG.isPlaylistEnabled) return;
  if (!tracklist) return;

  document.querySelectorAll('.djInfoHeaderCol, .djInfoList').forEach((el) => {
    if (isInsideSearchBarDropdown(el)) el.remove();
  });

  if (isTooNarrow()) {
    removeDjInfoCells();
    GridCoordinator.scheduleFit(true);
    return;
  }

  getAllHeaderRows()
    .filter((header) => tracklist.contains(header))
    .forEach(ensureHeaderCell);

  for (const track of getAllTrackRows()) {
    if (!tracklist.contains(track)) continue;
    const isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
    if (isRecommendation && !CONFIG.isRecommendationsEnabled) continue;

    const hasdjinfo = track.querySelector('.djinfo') !== null;
    // Spotify reuses row nodes while virtual-scrolling: detect a row that now shows another track
    const currentUri = hasdjinfo ? getRowTrackUri(track) : null;
    const rowId = track.dataset.djinfoUri ? track.dataset.djinfoUri.split(':')[2] : null;
    const stale =
      hasdjinfo &&
      ((currentUri && currentUri !== track.dataset.djinfoUri) ||
        (rowId && trackDb[rowId] && track.dataset.djinfoVer !== renderSig(rowId, trackDb[rowId])));
    if (!track.classList.contains('dj-observed') || !hasdjinfo || stale) {
      track.classList.add('dj-observed');
      trackIntersectionObserver.observe(track);
    }
  }

  GridCoordinator.scheduleFit();
}

export function updateRecommendations(recommendations, trackIntersectionObserver) {
  if (!CONFIG.isRecommendationsEnabled) return;
  if (!recommendations) return;

  const tracks = recommendations.querySelectorAll('.main-trackList-trackListRow');
  for (const track of tracks) {
    const hasdjinfo = track.querySelector('.djinfo') !== null;
    if (!track.classList.contains('dj-observed') || !hasdjinfo) {
      track.classList.add('dj-observed');
      trackIntersectionObserver.observe(track);
    }
  }
}
