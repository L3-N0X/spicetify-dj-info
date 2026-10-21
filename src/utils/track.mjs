import { CONFIG } from '../ui/config.mjs';

export function getTracklistTrackUri(tracklistElement) {
  // 1. Try specific known paths first (Fast & Reliable for standard rows)
  const values = Object.values(tracklistElement);
  const reactProps = values.find((v) => v?.pendingProps || v?.memoizedProps);
  const props = reactProps?.pendingProps || reactProps?.memoizedProps;

  if (props) {
    const specificUri =
      props.children?.[0]?.props?.children?.props?.uri ||
      props.children?.[0]?.props?.children?.props?.children?.props?.uri ||
      props.children?.[0]?.props?.children?.[0]?.props?.uri ||
      props.children?.props?.value?.item?.uri ||
      props.value?.item?.uri;

    if (typeof specificUri === 'string' && specificUri.includes('spotify:track:'))
      return specificUri;
  }

  // 2. Newer Spotify versions no longer pass the uri down to the row itself,
  // so look at the props of the closest parent components
  const fiberKey = Object.keys(tracklistElement).find((key) => key.startsWith('__reactFiber'));
  let fiber = fiberKey ? tracklistElement[fiberKey]?.return : null;
  for (let depth = 0; fiber && depth < 6; depth++, fiber = fiber.return) {
    const parentProps = fiber.memoizedProps;
    const parentUri =
      parentProps?.uri || parentProps?.item?.uri || parentProps?.children?.props?.uri;
    if (typeof parentUri === 'string' && parentUri.includes('spotify:track:')) return parentUri;
  }

  // 3. Recursive fallback (For recommendations and new structures)
  const findUri = (obj, depth = 0) => {
    if (!obj || depth > 15) return null;

    if (typeof obj.uri === 'string' && obj.uri.includes('spotify:track:')) return obj.uri;
    if (typeof obj.item?.uri === 'string' && obj.item.uri.includes('spotify:track:'))
      return obj.item.uri;

    // Check children
    const children = obj.children || obj.props?.children;
    if (children) {
      if (Array.isArray(children)) {
        for (const child of children) {
          const result = findUri(child.props || child, depth + 1);
          if (result) return result;
        }
      } else {
        const result = findUri(children, depth + 1);
        if (result) return result;
      }
    }

    if (obj.props && obj.props !== obj) {
      const result = findUri(obj.props, depth + 1);
      if (result) return result;
    }

    return null;
  };

  return findUri(props || tracklistElement);
}

export function getPageType() {
  const pathname = Spicetify.Platform.History.location.pathname;
  let matches = null;
  if (pathname === '/collection/tracks') {
    return ['LIKED_SONGS', null];
  }
  if ((matches = pathname.match(/playlist\/(.*)/))) {
    return ['PLAYLIST', matches[1]];
  }
  if ((matches = pathname.match(/album\/(.*)/))) {
    return ['ALBUM', matches[1]];
  }
  if ((matches = pathname.match(/artist\/([^/]*)$/))) {
    return ['ARTIST', matches[1]];
  }
  if ((matches = pathname.match(/artist\/([^/]*)\/saved/))) {
    return ['ARTIST_LIKED', matches[1]];
  }
  return ['OTHER', null];
}

export function getKeyInNotation(key, mode) {
  const keyInCamelot =
    key < 0 || mode < 0 ? 'XX' : ((7 * key + [4, 7][mode]) % 12) + 1 + 'AB'[mode];
  const keyInStandard =
    key < 0 ? 'XX' : 'C Db D Eb E F F♯ G Ab A Bb B'.split(' ')[key] + ['m', '', '?'].at(mode);

  if (CONFIG.isCamelotEnabled) {
    if (CONFIG.isKeyEnabled) {
      return `${keyInStandard}\u00a0(${keyInCamelot})`;
    }
    return keyInCamelot;
  }
  return keyInStandard;
}
