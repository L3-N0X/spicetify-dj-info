import { CONFIG } from "../ui/config.mjs";

export function getTracklistTrackUri(tracklistElement) {
  let values = Object.values(tracklistElement);
  if (!values.length) {
    console.log("Error: Could not get tracklist element");
    return null;
  }
  return (
    values[0]?.pendingProps?.children[0]?.props?.children?.props?.uri ||
    values[0]?.pendingProps?.children[0]?.props?.children?.props?.children
      ?.props?.uri ||
    values[0]?.pendingProps?.children[0]?.props?.children?.props?.children
      ?.props?.children?.props?.uri ||
    values[0]?.pendingProps?.children[0]?.props?.children[0]?.props?.uri ||
    values[0]?.pendingProps?.children?.props?.value?.item?.uri ||
    values[0]?.pendingProps?.children?.props?.children?.props?.value?.item
      ?.uri ||
    values[0]?.pendingProps?.children?.props?.children?.props?.children?.props
      ?.value?.item?.uri
  );
}

export function getPageType() {
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

export function getKeyInNotation(key, mode) {
  const keyInCamelot =
    key < 0 || mode < 0
      ? "XX"
      : ((7 * key + [4, 7][mode]) % 12) + 1 + "AB"[mode];
  const keyInStandard =
    key < 0
      ? "XX"
      : "C Db D Eb E F F♯ G Ab A Bb B".split(" ")[key] +
        ["m", "", "?"].at(mode);

  if (CONFIG.isCamelotEnabled) {
    if (CONFIG.isKeyEnabled) {
      return `${keyInStandard}&nbsp;(${keyInCamelot})`;
    }
    return keyInCamelot;
  }
  return keyInStandard;
}
