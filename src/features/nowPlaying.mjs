import { CONFIG } from "../ui/config.mjs";
import { getTrackInfo } from "../api/metadata.mjs";
import { getKeyInNotation } from "../utils/track.mjs";

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
    nowPlayingWidgetdjInfoData.style.display = "none";
    return;
  }

  const isTrack = trackUri.includes("track");
  nowPlayingWidgetdjInfoData.style.display = isTrack ? "flex" : "none";

  const uri = trackUri;
  if (uri.split(":")[1] === "local") {
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
    if (CONFIG.isEnergyEnabled) display_text.push(`E ${info.energy}`);
    if (CONFIG.isDanceEnabled) display_text.push(`D ${info.danceability}`);
    if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${info.popularity}`);
    if (CONFIG.isYearEnabled) display_text.push(`${info.release_date}`);

    nowPlayingWidgetdjInfoData.innerHTML = display_text.join("<br>");
    nowPlayingWidgetdjInfoData.classList.remove("djinfo-animate");
    void nowPlayingWidgetdjInfoData.offsetWidth; // reflow trick
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
}

export function initNowPlayingListener() {
  Spicetify.Player.addEventListener("songchange", () => {
    updateNowPlayingWidget();
  });
}
