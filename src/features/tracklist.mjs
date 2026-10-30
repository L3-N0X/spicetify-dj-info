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

let queueTrackInfoFn = null;

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

function placeCell(cell, ip, isHeader) {
  const grid = ip.parentElement;
  if (CONFIG.isSeparateColumnEnabled) {
    const anchor = getSeparateAnchor(grid) || ip;
    cell.classList.add('djInfoSeparateCol');
    cell.setAttribute('role', isHeader ? 'columnheader' : 'gridcell');
    cell.style.cssText = '';
    if (cell.parentElement !== grid || cell.nextElementSibling !== anchor) {
      grid.insertBefore(cell, anchor);
    }
  } else {
    cell.classList.remove('djInfoSeparateCol');
    cell.removeAttribute('role');
    cell.style.cssText = isHeader ? DOCKED_HEADER_STYLE : DOCKED_STYLE;
    if (ip.firstElementChild !== cell) ip.insertBefore(cell, ip.firstChild);
  }
}

function ensureHeaderCell(header) {
  const ip = getRowInsertionPoint(header, true);
  if (!ip) return;
  ip.classList.add('spicetify-ext-lastcol-host');

  let headerCol = header.querySelector('.djInfoHeaderCol');
  if (!headerCol) {
    headerCol = document.createElement('div');
    headerCol.className = 'djInfoHeaderCol';
    const label = document.createElement('span');
    label.className = 'djinfoheader';
    label.textContent = 'DJ Info';
    // Reuse Spotify's own header label styling when available
    const existing = header.querySelector("[role='columnheader'] span");
    if (existing) {
      label.className = `${existing.className} djinfoheader`;
    } else {
      label.style.cssText =
        'color: var(--spice-subtext, #b3b3b3); font-size: 12px; font-weight: 400;';
    }
    headerCol.appendChild(label);
  }
  placeCell(headerCol, ip, true);
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
      if (CONFIG.isPopularityEnabled) bottomStats.push(`♥ ${parsedInfo.popularity}`);
      if (CONFIG.isYearEnabled) bottomStats.push(`${parsedInfo.release_date}`);

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

      if (CONFIG.isPopularityEnabled) {
        dataPoints.push('♥ ' + parsedInfo.popularity);
      }

      if (CONFIG.isYearEnabled) {
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
