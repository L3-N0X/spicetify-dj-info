import { CONFIG } from '../ui/config.mjs';
import { getTrackInfo } from '../api/metadata.mjs';
import { getKeyInNotation } from '../utils/track.mjs';

let nowPlayingWidgetdjInfoData = null;

export function setNowPlayingElement(element) {
  nowPlayingWidgetdjInfoData = element;
}

export function getNowPlayingElement() {
  return nowPlayingWidgetdjInfoData;
}

export async function updateNowPlayingWidget() {
  if (!nowPlayingWidgetdjInfoData || !CONFIG.isNowPlayingEnabled) return;

  const getTrackUri = () => {
    if (!Spicetify.Player.data || !Spicetify.Player.data.item) return null;
    return Spicetify.Player.data.item.uri;
  };

  const trackUri = getTrackUri();
  if (!trackUri) {
    nowPlayingWidgetdjInfoData.style.display = 'none';
    return;
  }

  const isTrack = trackUri.includes('track');
  nowPlayingWidgetdjInfoData.style.display = isTrack ? 'flex' : 'none';

  const uri = trackUri;
  if (uri.split(':')[1] === 'local') {
    nowPlayingWidgetdjInfoData.innerHTML = '';
    return;
  }

  const id = uri.split(':')[2];
  const info = await getTrackInfo(id);

  if (info) {
    const display_text = [];
    if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled)
      display_text.push(`${getKeyInNotation(info.key, info.mode)}`);
    if (CONFIG.isBPMEnabled) display_text.push(`${Math.round(info.tempo)} ♫`);
    if (CONFIG.isEnergyEnabled && Number.isFinite(info.energy)) display_text.push(`E ${info.energy}`);
    if (CONFIG.isDanceEnabled && Number.isFinite(info.danceability))
      display_text.push(`D ${info.danceability}`);
    if (CONFIG.isAcousticnessEnabled && Number.isFinite(info.acousticness))
      display_text.push(`A ${info.acousticness}`);
    if (CONFIG.isInstrumentalnessEnabled && Number.isFinite(info.instrumentalness))
      display_text.push(`I ${info.instrumentalness}`);
    if (CONFIG.isLivenessEnabled && Number.isFinite(info.liveness))
      display_text.push(`L ${info.liveness}`);
    if (CONFIG.isLoudnessEnabled && Number.isFinite(info.loudness))
      display_text.push(`dB ${Math.round(info.loudness * 10) / 10}`);
    if (CONFIG.isSpeechinessEnabled && Number.isFinite(info.speechiness))
      display_text.push(`S ${info.speechiness}`);
    if (CONFIG.isValenceEnabled && Number.isFinite(info.valence))
      display_text.push(`V ${info.valence}`);
    if (CONFIG.isTimeSignatureEnabled && Number.isFinite(info.time_signature))
      display_text.push(`${info.time_signature}/4`);
    if (CONFIG.isPopularityEnabled && Number.isFinite(info.popularity))
      display_text.push(`♥ ${info.popularity}`);
    if (CONFIG.isYearEnabled && info.release_date) display_text.push(`${info.release_date}`);

    nowPlayingWidgetdjInfoData.innerHTML = display_text.join('<br>');
    nowPlayingWidgetdjInfoData.classList.remove('djinfo-animate');
    void nowPlayingWidgetdjInfoData.offsetWidth; // reflow trick
    nowPlayingWidgetdjInfoData.classList.add('djinfo-animate');
  } else {
    nowPlayingWidgetdjInfoData.innerHTML = '';
    getTrackInfo(id).then((info) => {
      if (info) {
        updateNowPlayingWidget();
      }
    });
  }

  nowPlayingWidgetdjInfoData.style.fontSize = '11px';
}

export function initNowPlayingListener() {
  Spicetify.Player.addEventListener('songchange', () => {
    updateNowPlayingWidget();
  });
}
