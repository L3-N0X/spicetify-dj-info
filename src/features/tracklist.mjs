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
  richEightColumnGridCss,
  eightColumnGridCss,
} from '../constants/grid.mjs';

let queueTrackInfoFn = null;

export function setQueueTrackInfo(fn) {
  queueTrackInfoFn = fn;
}

const getVisibleColumnCount = (row) => {
  let count = 0;
  const children = Array.from(row.children);
  for (const child of children) {
    if (child.classList.contains('djInfoList') || child.classList.contains('djinfoheader'))
      continue;

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

const getDjInfoInsertionAnchor = (row) => {
  const children = Array.from(row.children);
  const lastNativeVariableColumn = children.reverse().find((child) => {
    return (
      child.classList.contains('main-trackList-rowSectionVariable') &&
      Array.from(child.classList).every((className) => className.startsWith('main-'))
    );
  });

  return (
    (lastNativeVariableColumn && lastNativeVariableColumn.nextElementSibling) ||
    row.querySelector('.main-trackList-rowSectionEnd')
  );
};

const updateTrackGrid = (track, isRecommendation) => {
  const MIN_WIDTH = 550;
  const width = window.innerWidth;

  let djInfoColumn =
    track.querySelector('.djInfoList') || track.querySelector('.djinfoheader')?.parentElement;

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
        case 7:
          track.style['grid-template-columns'] = richEightColumnGridCss;
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
        case 7:
          track.style['grid-template-columns'] = eightColumnGridCss;
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

  if (!trackUri) return;

  const isTrack = trackUri.includes('track');
  if (!isTrack) return;

  // Re-check if it's a recommendation just in case
  if (!isRecommendation) {
    isRecommendation = track.closest('[data-testid="recommended-track"]') !== null;
  }

  let djInfoColumn = track.querySelector('.djInfoList');
  if (!djInfoColumn) {
    let insertionAnchor = getDjInfoInsertionAnchor(track);
    if (insertionAnchor) {
      let colIndexInt = getVisibleColumnCount(track);
      insertionAnchor.setAttribute('aria-colindex', (colIndexInt + 1).toString());

      djInfoColumn = document.createElement('div');
      djInfoColumn.setAttribute('aria-colindex', colIndexInt.toString());
      djInfoColumn.style.display = 'flex';
      djInfoColumn.classList.add('main-trackList-rowSectionVariable');
      djInfoColumn.classList.add('djInfoList');
      track.insertBefore(djInfoColumn, insertionAnchor);
    }
  }

  if (djInfoColumn) {
    updateTrackGrid(track, isRecommendation);
  }

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
}

export function updateTracklist(tracklist, trackIntersectionObserver) {
  if (!CONFIG.isPlaylistEnabled) return;
  if (!tracklist) return;

  const tracklistHeader = tracklist.querySelector('.main-trackList-trackListHeaderRow');
  if (tracklistHeader && !tracklistHeader.querySelector('.djinfoheader')) {
    let insertionAnchor = getDjInfoInsertionAnchor(tracklistHeader);
    let visibleCols = getVisibleColumnCount(tracklistHeader);

    if (!insertionAnchor) return;
    insertionAnchor.setAttribute('aria-colindex', (visibleCols + 1).toString());

    let headerColumn = document.createElement('div');
    headerColumn.style.display = 'flex';
    headerColumn.classList.add('main-trackList-rowSectionVariable');
    headerColumn.role = 'columnheader';
    tracklistHeader.insertBefore(headerColumn, insertionAnchor);

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
        case 7:
          tracklistHeader.style['grid-template-columns'] = richEightColumnGridCss;
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
        case 7:
          tracklistHeader.style['grid-template-columns'] = eightColumnGridCss;
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

  const tracks = recommendations.querySelectorAll('.main-trackList-trackListRow');
  for (const track of tracks) {
    const hasdjinfo = track.querySelector('.djinfo') !== null;
    if (!track.classList.contains('dj-observed') || !hasdjinfo) {
      track.classList.add('dj-observed');
      trackIntersectionObserver.observe(track);
    }
  }
}
