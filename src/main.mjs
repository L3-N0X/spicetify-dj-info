import protobuf from 'protobufjs/light';

// expose globally for API module
globalThis.protobuf = protobuf;

import { debounce } from './utils/dom.mjs';
import { initStyles } from './ui/styles.mjs';
import { CONFIG, loadConfig } from './ui/config.mjs';
import { registerSettingsMenu } from './ui/settingsModal.mjs';
import { initTrackDb } from './db/trackDb.mjs';
import { initProductState } from './api/metadata.mjs';
import { queueTrackInfo, setAddInfoToTrack } from './features/queue.mjs';
import {
  addInfoToTrack,
  updateTracklist,
  updateRecommendations,
  setQueueTrackInfo,
} from './features/tracklist.mjs';
import {
  updateNowPlayingWidget,
  initNowPlayingListener,
  setNowPlayingElement,
  getNowPlayingElement,
} from './features/nowPlaying.mjs';

(async function djInfoList() {
  while (!Spicetify.showNotification) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const { CosmosAsync, URI } = Spicetify;
  if (!(CosmosAsync && URI)) {
    setTimeout(djInfoList, 300);
    return;
  }

  loadConfig();
  initStyles();
  initTrackDb();
  await initProductState();
  registerSettingsMenu();

  setQueueTrackInfo(queueTrackInfo);
  setAddInfoToTrack(addInfoToTrack);
  initNowPlayingListener();

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
    { rootMargin: '200px' },
  );
  window.djInfoObserver = trackIntersectionObserver;

  const observedTracklists = new WeakSet();

  let oldNowPlayingWidget = null;
  let nowPlayingWidget = null;

  function observeTracklist(tracklist, isRecommendation = false) {
    const updater = () => {
      if (isRecommendation) {
        updateRecommendations(tracklist, trackIntersectionObserver);
      } else {
        updateTracklist(tracklist, trackIntersectionObserver);
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
    const tracklists = document.querySelectorAll('.main-trackList-indexable');
    tracklists.forEach((tracklist) => observeTracklist(tracklist, false));

    const recommendationsContainer = document.querySelector('[data-testid="recommended-track"]');
    if (recommendationsContainer) {
      observeTracklist(recommendationsContainer, true);
    }

    oldNowPlayingWidget = nowPlayingWidget;
    nowPlayingWidget = document.querySelector('.main-nowPlayingWidget-nowPlaying');

    if (nowPlayingWidget && !nowPlayingWidget.isEqualNode(oldNowPlayingWidget)) {
      if (!nowPlayingWidget.querySelector('.dj-info-now-playing')) {
        const nowPlayingWidgetdjInfoData = document.createElement('p');
        nowPlayingWidgetdjInfoData.classList.add('dj-info-now-playing');
        nowPlayingWidgetdjInfoData.style.marginLeft = '4px';
        nowPlayingWidgetdjInfoData.style.marginRight = '4px';
        nowPlayingWidgetdjInfoData.style.minWidth = '34px';
        nowPlayingWidgetdjInfoData.style.fontSize = '11px';
        nowPlayingWidgetdjInfoData.style.textAlign = 'center';

        const trackInfo = nowPlayingWidget.querySelector('.main-trackInfo-container');
        if (trackInfo) {
          if (CONFIG.isLeftPlayingEnabled) {
            trackInfo.before(nowPlayingWidgetdjInfoData);
          } else {
            trackInfo.after(nowPlayingWidgetdjInfoData);
          }
        }

        setNowPlayingElement(nowPlayingWidgetdjInfoData);
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
