import { CONFIG } from '../ui/config.mjs';
import { trackDb } from '../db/trackDb.mjs';
import { getTracklistTrackUri, getKeyInNotation } from '../utils/track.mjs';
import {
  fourColumnGridCss,
  fiveColumnGridCss,
  sixColumnGridCss,
  sevenColumnGridCss,
  richFourColumnGridCss,
  richFiveColumnGridCss,
  richSixColumnGridCss,
  richSevenColumnGridCss,
  recommendationGridCss,
} from '../constants/grid.mjs';

let queueTrackInfoFn = null;

export function setQueueTrackInfo(fn) {
  queueTrackInfoFn = fn;
}

const getVisibleColumnCount = (row) => {
  let count = 0;
  const children = Array.from(row.children);
  for (const child of children) {
    if (child.classList.contains('djInfoList')) continue;

    if (
      child.classList.contains('main-trackList-rowSectionVariable') ||
      child.classList.contains('main-trackList-rowSectionEnd') ||
      child.classList.contains('main-trackList-rowSectionStart') ||
      child.classList.contains('main-trackList-rowSectionIndex')
    ) {
      const style = window.getComputedStyle(child);
      if (style.display !== 'none') {
        count++;
      }
    }
  }
  return count;
};

const updateTrackGrid = (track, isRecommendation) => {
  const MIN_WIDTH = 550;
  const width = window.innerWidth;

  let djInfoColumn = track.querySelector('.djInfoList');

  if (width < MIN_WIDTH && !isRecommendation) {
    if (djInfoColumn) {
      djInfoColumn.style.display = 'none';
    }
    track.style['grid-template-columns'] = '';
    return;
  }

  if (djInfoColumn) {
    djInfoColumn.style.display = 'flex';
  }

  const visibleCount = getVisibleColumnCount(track);

  if (isRecommendation) {
    if (djInfoColumn) {
      djInfoColumn.style.justifyContent = 'center';
      djInfoColumn.style.width = '100%';
    }
    track.style['grid-template-columns'] = recommendationGridCss;
  } else {
    if (CONFIG.isRichUiEnabled) {
      switch (visibleCount) {
        case 3:
          track.style['grid-template-columns'] = richFourColumnGridCss;
          break;
        case 4:
          track.style['grid-template-columns'] = richFiveColumnGridCss;
          break;
        case 5:
          track.style['grid-template-columns'] = richSixColumnGridCss;
          break;
        case 6:
          track.style['grid-template-columns'] = richSevenColumnGridCss;
          break;
        default:
          break;
      }
    } else {
      switch (visibleCount) {
        case 3:
          track.style['grid-template-columns'] = fourColumnGridCss;
          break;
        case 4:
          track.style['grid-template-columns'] = fiveColumnGridCss;
          break;
        case 5:
          track.style['grid-template-columns'] = sixColumnGridCss;
          break;
        case 6:
          track.style['grid-template-columns'] = sevenColumnGridCss;
          break;
        default:
          break;
      }
    }
  }
};

export function addInfoToTrack(track, isRecommendation = false) {
  const hasdjinfo = track.querySelector('.djinfo') !== null;
  const trackUri = getTracklistTrackUri(track);

  if (!trackUri) {
    return;
  }

  const isTrack = trackUri.includes('track');

  let djInfoColumn = track.querySelector('.djInfoList');
  if (!djInfoColumn) {
    let lastColumn = track.querySelector('.main-trackList-rowSectionEnd');
    if (lastColumn) {
      let colIndexInt = getVisibleColumnCount(track);
      lastColumn.setAttribute('aria-colindex', (colIndexInt + 1).toString());

      djInfoColumn = document.createElement('div');
      djInfoColumn.setAttribute('aria-colindex', colIndexInt.toString());
      djInfoColumn.style.display = 'flex';
      djInfoColumn.classList.add('main-trackList-rowSectionVariable');
      djInfoColumn.classList.add('djInfoList');
      track.insertBefore(djInfoColumn, lastColumn);
    }
  }

  // Safety check, if updateTrackGrid depends on djInfoColumn existing
  if (djInfoColumn) {
    updateTrackGrid(track, isRecommendation);
  }

  if (!trackUri || !isTrack) return;

  const uri = trackUri;
  const id = uri.split(':')[2];
  const info = trackDb[id];

  if (info) {
    if (hasdjinfo) return;

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
        bpmSpan.innerText = `${parsedInfo.tempo}\u00a0bpm`;
        topRow.appendChild(bpmSpan);
      }

      const bottomRow = document.createElement('div');
      bottomRow.className = 'dj-info-row-bottom';

      let bottomStats = [];
      if (CONFIG.isEnergyEnabled) bottomStats.push(`E: ${parsedInfo.energy}`);
      if (CONFIG.isDanceEnabled) bottomStats.push(`D: ${parsedInfo.danceability}`);
      if (CONFIG.isPopularityEnabled) bottomStats.push(`♥ ${parsedInfo.popularity}`);
      if (CONFIG.isYearEnabled) bottomStats.push(`${parsedInfo.release_date}`);

      if (bottomStats.length > 0) {
        bottomStats.forEach((stat, i) => {
          const span = document.createElement('span');
          span.innerText = stat;
          bottomRow.appendChild(span);
          if (i < bottomStats.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'dj-info-separator';
            sep.innerText = '-';
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
    // Classic UI Implementation (Improved)
    else if (djInfoColumn) {
      const parsedInfo = info;
      const keyInNotation = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
      const container = document.createElement('div');
      container.className = 'dj-info-classic-container djinfo djinfo-animate';

      const dataPoints = [];
      const weights = [];

      if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) {
        dataPoints.push('𝄞 ' + keyInNotation);
        const weight = CONFIG.isKeyEnabled && CONFIG.isCamelotEnabled ? 1.9 : 0.9;
        weights.push(weight);
      }

      if (CONFIG.isBPMEnabled) {
        dataPoints.push(Math.round(parsedInfo.tempo) + ' ♫');
        weights.push(1);
      }

      if (CONFIG.isEnergyEnabled) {
        dataPoints.push('E ' + parsedInfo.energy);
        weights.push(0.8);
      }

      if (CONFIG.isDanceEnabled) {
        dataPoints.push('D ' + parsedInfo.danceability);
        weights.push(0.8);
      }

      if (CONFIG.isPopularityEnabled) {
        dataPoints.push('♥ ' + parsedInfo.popularity);
        weights.push(0.75);
      }

      if (CONFIG.isYearEnabled) {
        dataPoints.push(parsedInfo.release_date);
        weights.push(0.9);
      }

      // Build Dynamic Grid Template
      const gridParts = [];
      weights.forEach((w, i) => {
        gridParts.push(`minmax(0, ${w}fr)`);
        if (i < weights.length - 1) {
          gridParts.push('max-content');
        }
      });

      container.style['grid-template-columns'] = gridParts.join(' ');

      dataPoints.forEach((text, index) => {
        const span = document.createElement('span');
        span.className = 'dj-info-classic-item';
        span.innerText = text;
        container.appendChild(span);

        if (index < dataPoints.length - 1) {
          const sep = document.createElement('span');
          sep.className = 'dj-info-classic-separator';
          sep.innerText = '|';
          container.appendChild(sep);
        }
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
}

export function updateTracklist(tracklist, trackIntersectionObserver) {
  if (!CONFIG.isPlaylistEnabled) return;
  if (!tracklist) return;

  const tracklistHeader = tracklist.querySelector('.main-trackList-trackListHeaderRow');
  if (tracklistHeader && !tracklistHeader.querySelector('.djinfoheader')) {
    let lastColumn = tracklistHeader.querySelector('.main-trackList-rowSectionEnd');
    let visibleCols = getVisibleColumnCount(tracklistHeader);

    // This logic handles checking if a DJ column already exists hidden
    // but here we just create it if missing for simplicity, matching olddjinfo
    lastColumn.setAttribute('aria-colindex', (visibleCols + 1).toString());

    let headerColumn = document.createElement('div');
    headerColumn.style.display = 'flex';
    headerColumn.classList.add('main-trackList-rowSectionVariable');
    headerColumn.role = 'columnheader';
    tracklistHeader.insertBefore(headerColumn, lastColumn);

    if (CONFIG.isRichUiEnabled) {
      switch (visibleCols) {
        case 3:
          tracklistHeader.style['grid-template-columns'] = richFourColumnGridCss;
          break;
        case 4:
          tracklistHeader.style['grid-template-columns'] = richFiveColumnGridCss;
          break;
        case 5:
          tracklistHeader.style['grid-template-columns'] = richSixColumnGridCss;
          break;
        case 6:
          tracklistHeader.style['grid-template-columns'] = richSevenColumnGridCss;
          break;
        default:
          break;
      }
    } else {
      switch (visibleCols) {
        case 3:
          tracklistHeader.style['grid-template-columns'] = fourColumnGridCss;
          break;
        case 4:
          tracklistHeader.style['grid-template-columns'] = fiveColumnGridCss;
          break;
        case 5:
          tracklistHeader.style['grid-template-columns'] = sixColumnGridCss;
          break;
        case 6:
          tracklistHeader.style['grid-template-columns'] = sevenColumnGridCss;
          break;
        default:
          break;
      }
    }

    const btn = document.createElement('button');
    btn.classList.add('main-trackList-column');
    btn.classList.add('main-trackList-sortable');
    btn.classList.add('djinfoheader');

    const title = document.createElement('span');
    title.classList.add('TypeElement-mesto-type');
    title.classList.add('standalone-ellipsis-one-line');
    title.innerHTML = 'DJ Info';
    btn.appendChild(title);
    headerColumn.appendChild(btn);
  }

  const tracks = tracklist.getElementsByClassName('main-trackList-trackListRow');
  for (const track of tracks) {
    const hasdjinfo = track.querySelector('.djinfo') !== null;
    if (!track.classList.contains('dj-observed') || !hasdjinfo) {
      track.classList.add('dj-observed');
      trackIntersectionObserver.observe(track);
    }
  }
}

export function updateRecommendations(recommendations, trackIntersectionObserver) {
  if (!CONFIG.isRecommendationsEnabled) return;
  if (!recommendations) return;

  const tracklist = recommendations.querySelector('.main-trackList-trackList');
  if (tracklist) {
    const tracks = tracklist.getElementsByClassName('main-trackList-trackListRow');
    for (const track of tracks) {
      const hasdjinfo = track.querySelector('.djinfo') !== null;
      if (!track.classList.contains('dj-observed') || !hasdjinfo) {
        track.classList.add('dj-observed');
        trackIntersectionObserver.observe(track);
      }
    }
  }
}
