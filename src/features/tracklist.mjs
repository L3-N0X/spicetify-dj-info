import { CONFIG } from "../ui/config.mjs";
import { trackDb } from "../db/trackDb.mjs";
import { getTracklistTrackUri, getKeyInNotation } from "../utils/track.mjs";
import {
  fourColumnGridCss,
  fiveColumnGridCss,
  sixColumnGridCss,
  sevenColumnGridCss,
  recommendationGridCss,
} from "../constants/grid.mjs";

let queueTrackInfoFn = null;

export function setQueueTrackInfo(fn) {
  queueTrackInfoFn = fn;
}

export function addInfoToTrack(track, isRecommendation = false) {
  const hasdjinfo = track.querySelector(".djinfo") !== null;
  const trackUri = getTracklistTrackUri(track);
  
  if (!trackUri) {
    console.error("Could not find track URI for track:", track, " this might be caused by a recent Spotify update, please report it on the GitHub page.");
    return;
  }
  
  const isTrack = trackUri.includes("track");

  let djInfoColumn = track.querySelector(".djInfoList");
  if (!djInfoColumn) {
    let lastColumn = track.querySelector(".main-trackList-rowSectionEnd");
    let colIndexInt = parseInt(lastColumn.getAttribute("aria-colindex"));
    lastColumn.setAttribute("aria-colindex", (colIndexInt + 1).toString());
    
    djInfoColumn = document.createElement("div");
    djInfoColumn.setAttribute("aria-colindex", colIndexInt.toString());
    djInfoColumn.style.display = "flex";
    djInfoColumn.classList.add("main-trackList-rowSectionVariable");
    djInfoColumn.classList.add("djInfoList");
    track.insertBefore(djInfoColumn, lastColumn);

    if (isRecommendation) {
      djInfoColumn.style.justifyContent = "center";
      djInfoColumn.style.width = "100%";
      track.style["grid-template-columns"] = recommendationGridCss;
    } else {
      switch (colIndexInt) {
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
          console.log("not 3-6 columns in Tracklist");
          break;
      }
    }
  }

  if (!trackUri || !isTrack) return;

  const uri = trackUri;
  const id = uri.split(":")[2];
  const info = trackDb[id];

  if (info) {
    if (hasdjinfo) return;
    
    const parsedInfo = info;
    const keyInNotation = getKeyInNotation(parsedInfo.key, parsedInfo.mode);
    let display_text = [];
    
    if (CONFIG.isKeyEnabled || CONFIG.isCamelotEnabled) display_text.push(`${keyInNotation}`);
    if (CONFIG.isBPMEnabled) display_text.push(`${parsedInfo.tempo} ♫`);
    if (CONFIG.isEnergyEnabled) display_text.push(`E ${parsedInfo.energy}`);
    if (CONFIG.isDanceEnabled) display_text.push(`D ${parsedInfo.danceability}`);
    if (CONFIG.isPopularityEnabled) display_text.push(`♥ ${parsedInfo.popularity}`);
    if (CONFIG.isYearEnabled) display_text.push(`${parsedInfo.release_date}`);
    display_text = display_text.join(" | ");

    const text = document.createElement("p");
    text.innerHTML = display_text;
    text.classList.add("djinfo");
    text.classList.add("djinfo-animate");
    text.style.fontSize = "12px";
    djInfoColumn.innerHTML = "";
    djInfoColumn.appendChild(text);
  } else {
    if (hasdjinfo) {
      const djinfoElement = track.querySelector(".djinfo");
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

  const tracklistHeader = tracklist.querySelector(".main-trackList-trackListHeaderRow");
  if (tracklistHeader && !tracklistHeader.querySelector(".djinfoheader")) {
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
        tracklistHeader.style["grid-template-columns"] = fiveColumnGridCss;
        break;
      case 5:
        tracklistHeader.style["grid-template-columns"] = sixColumnGridCss;
        break;
      case 6:
        tracklistHeader.style["grid-template-columns"] = sevenColumnGridCss;
        break;
      default:
        console.error("Unsupported number of columns, cannot add DJ Info header");
        break;
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
}

export function updateRecommendations(recommendations, trackIntersectionObserver) {
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
}