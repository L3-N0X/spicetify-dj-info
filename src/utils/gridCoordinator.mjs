/**
 * Shared tracklist grid coordinator (window.SpicetifyGridCoordinator, version 2).
 *
 * Spotify lays out each tracklist row as a CSS grid whose `grid-template-columns` is driven by
 * Spotify's own column-resize CSS variables. Appending a custom cell therefore either overlaps the
 * native "last column" (plays / duration / heart) or needs fixed column presets that break native
 * drag-resize. The coordinator widens the native last track just enough for the injected content
 * and, in "separate column" mode, inserts named tracks for each extension column. It then verifies
 * the result against the computed layout, and otherwise borrows px from the widest middle columns.
 *
 * It is exposed on `window` so that other Spicetify extensions embedding the same coordinator
 * (Star Ratings, DJ Prep) share one implementation instead of overwriting each other's grid spec.
 * The first coordinator with version >= 2 wins; keep embedded copies in sync.
 */

export const GridCoordinator = (() => {
  if (window.SpicetifyGridCoordinator && window.SpicetifyGridCoordinator.version >= 2) {
    return window.SpicetifyGridCoordinator;
  }
  if (window.SpicetifyGridCoordinator?.cleanup) {
    try {
      window.SpicetifyGridCoordinator.cleanup();
    } catch {}
  }

  const SHARED_STYLE_ID = 'spicetify-grid-coordinator-styles';
  let st = document.getElementById(SHARED_STYLE_ID);
  if (!st) {
    st = document.createElement('style');
    st.id = SHARED_STYLE_ID;
    document.head.appendChild(st);
  }
  st.textContent = `
        .spicetify-ext-lastcol-host {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            overflow: visible !important;
            min-width: max-content !important;
            justify-self: end !important;
        }
        .spicetify-ext-separate-col {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
            box-sizing: border-box;
            justify-self: center;
            flex-shrink: 0;
            z-index: 10;
        }
        .djInfoSeparateCol { min-width: 118px; }
        .starRatingsSeparateCol { min-width: 96px; }
        .djPrepSeparateCol { min-width: 224px; }
    `;

  const specCache = new Map();
  const GRID_MIN_DONOR_PX = 120;
  let forceFit = false;
  let rafId = 0;

  const EXTRA_COL_DEFS = [
    { key: 'djinfo', selector: '.djInfoSeparateCol', defaultWidth: 118 },
    { key: 'stars', selector: '.starRatingsSeparateCol', defaultWidth: 96 },
    { key: 'djprep', selector: '.djPrepSeparateCol', defaultWidth: 224 },
  ];

  function isInsideSearchBarDropdown(el) {
    if (!el || !el.closest('main')) return true;
    return Boolean(
      el.closest(
        '[role="listbox"], [role="dialog"], [role="menu"], [role="combobox"], [data-encore-id="popover"], [class*="search-searchResult"], header',
      ),
    );
  }
  function getRowInsertionPoint(row, isHeader) {
    const legacy = row.querySelector('.main-trackList-rowSectionEnd');
    if (legacy) return legacy;
    const notSep =
      ':not(.spicetify-ext-separate-col):not(.djInfoSeparateCol):not(.starRatingsSeparateCol):not(.djPrepSeparateCol)';
    const sel = (isHeader ? '[role="columnheader"]' : '[role="gridcell"]') + notSep;
    const cells = row.querySelectorAll(sel);
    return cells.length > 0 ? cells[cells.length - 1] : row.lastElementChild;
  }
  function getAllHeaderRows() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return [];
    const list = mainEl.querySelectorAll(
      '.main-trackList-trackListHeaderRow, [data-testid="playlist-tracklist"] [role="row"], [data-testid="track-list"] [role="row"], [role="grid"] [role="row"], [role="table"] [role="row"]',
    );
    return Array.from(list).filter(
      (r) =>
        !isInsideSearchBarDropdown(r) &&
        (r.classList.contains('main-trackList-trackListHeaderRow') ||
          r.querySelector('[role="columnheader"]') !== null),
    );
  }
  function getAllTrackRows() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return [];
    const list = mainEl.querySelectorAll(
      '[data-testid="tracklist-row"], .main-trackList-trackListRow, .main-trackList-trackListRowGrid, [data-testid="playlist-tracklist"] [role="row"], [data-testid="track-list"] [role="row"], [role="grid"] [role="row"]',
    );
    return Array.from(list).filter(
      (r) =>
        !isInsideSearchBarDropdown(r) &&
        !r.classList.contains('main-trackList-trackListHeaderRow') &&
        r.querySelector('[role="columnheader"]') === null &&
        (r.dataset.testid === 'tracklist-row' ||
          r.classList.contains('main-trackList-trackListRow') ||
          r.querySelector('[role="gridcell"]') !== null),
    );
  }
  function splitTop(str, isSep) {
    const out = [];
    let depth = 0,
      cur = '';
    for (const ch of str) {
      if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      if (depth === 0 && isSep(ch)) {
        if (cur.trim()) out.push(cur.trim());
        cur = '';
      } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function specificity(sel) {
    const ids = (sel.match(/#[\w-]+/g) || []).length;
    const cls = (sel.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(?:\([^)]*\))?/g) || []).length;
    const rest = sel.replace(/#[\w-]+|\.[\w-]+|\[[^\]]*\]|::?[\w-]+(?:\([^)]*\))?/g, ' ');
    const tags = (rest.match(/(^|[\s>+~])[a-z][\w-]*/gi) || []).length;
    return ids * 10000 + cls * 100 + tags;
  }
  function findSheetSpec(grid) {
    let best = null,
      bestSp = -1;
    const walk = (rules) => {
      for (const r of rules) {
        if (r.type === 1) {
          const v = r.style && r.style.getPropertyValue('grid-template-columns');
          if (!v) continue;
          for (const sel of splitTop(r.selectorText, (ch) => ch === ',')) {
            let ok = false;
            try {
              ok = grid.matches(sel);
            } catch {}
            if (ok) {
              const sp = specificity(sel);
              if (sp >= bestSp) {
                best = v;
                bestSp = sp;
              }
            }
          }
        } else if (r.cssRules) {
          if (r.media && !window.matchMedia(r.media.mediaText).matches) continue;
          walk(r.cssRules);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch {}
    }
    return best;
  }
  function resolveSpec(spec, grid) {
    let guard = 0;
    while (spec && guard++ < 4) {
      const m = spec.trim().match(/^var\(\s*(--[\w-]+)\s*(?:,([\s\S]*))?\)$/);
      if (!m) break;
      const v = getComputedStyle(grid).getPropertyValue(m[1]).trim();
      spec = v || (m[2] ? m[2].trim() : null);
    }
    return spec;
  }
  function transformGridSpec(spec, need, extraCols) {
    const toks = splitTop(spec, (ch) => /\s/.test(ch));
    let i = toks.length - 1;
    while (i >= 0 && toks[i].startsWith('[')) i--;
    if (i < 0) return null;
    let lastStart = i;
    while (lastStart > 0 && toks[lastStart - 1].startsWith('[')) lastStart--;
    const t = toks[i];
    let nextLast = t;
    if (need > 0) {
      if (t.startsWith('minmax(') && t.endsWith(')')) {
        const parts = splitTop(t.slice(7, -1), (ch) => ch === ',');
        if (parts.length !== 2) return null;
        nextLast = 'minmax(max(' + parts[0] + ',' + need + 'px),' + parts[1] + ')';
      } else nextLast = 'minmax(' + need + 'px,' + t + ')';
    }
    toks[i] = nextLast;
    if (extraCols.length > 0) {
      const insertToks = [];
      for (const col of extraCols) insertToks.push('[' + col.key + ']', col.width + 'px');
      toks.splice(lastStart, 0, ...insertToks);
    }
    return toks.join(' ');
  }
  function lastTrackPx(grid) {
    const t = getComputedStyle(grid)
      .gridTemplateColumns.trim()
      .split(/\s+/)
      .filter((x) => /^[\d.]+px$/.test(x));
    return t.length ? parseFloat(t[t.length - 1]) : 0;
  }
  function resetGridInline(grid) {
    const orig = grid.dataset.djOrigInline || '';
    if (orig) grid.style.setProperty('grid-template-columns', orig);
    else grid.style.removeProperty('grid-template-columns');
  }
  function pxFit(grid, need, extraCols) {
    const tokens = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/);
    const px = [];
    tokens.forEach((t, i) => {
      if (/^[\d.]+px$/.test(t)) px.push(i);
    });
    if (px.length < 3) return false;
    const lastIdx = px[px.length - 1];
    const origLast = parseFloat(tokens[lastIdx]);
    const extraLast = Math.max(0, need - origLast);
    const sepTotal = extraCols.reduce((acc, c) => acc + c.width, 0);
    const totalDelta = extraLast + sepTotal;
    if (totalDelta <= 0.5) return false;
    const donors = px.slice(1, -1).sort((a, b) => parseFloat(tokens[b]) - parseFloat(tokens[a]));
    let taken = 0;
    for (const i of donors) {
      const v = parseFloat(tokens[i]);
      const take = Math.min(totalDelta - taken, Math.max(0, v - GRID_MIN_DONOR_PX));
      if (take > 0) {
        tokens[i] = v - take + 'px';
        taken += take;
      }
      if (totalDelta - taken <= 0.5) break;
    }
    if (taken <= 0) return false;
    if (extraCols.length > 0) {
      const lastAllowance = Math.max(0, taken - sepTotal);
      tokens[lastIdx] = origLast + lastAllowance + 'px';
      tokens.splice(lastIdx, 0, ...extraCols.map((c) => c.width + 'px'));
    } else tokens[lastIdx] = origLast + taken + 'px';
    grid.style.setProperty('grid-template-columns', tokens.join(' '), 'important');
    return true;
  }
  function applyGridFit(grid, need, extraCols) {
    const cur = grid.style.getPropertyValue('grid-template-columns');
    const ours = grid.dataset.djFitStyle;
    if (cur && cur !== ours) grid.dataset.djOrigInline = cur;
    const mode = grid.dataset.djMode || '';
    const extraSig = extraCols.map((c) => c.key + ':' + c.width).join(',');
    const sigNow =
      need + '|' + extraSig + '|' + (mode === 'px' ? Math.round(grid.clientWidth) : '');
    if (!forceFit && grid.dataset.djFit === sigNow && cur === ours) return;
    resetGridInline(grid);
    let usedMode = '';
    let spec = grid.dataset.djOrigInline;
    if (!spec) {
      const key = grid.className;
      if (!specCache.has(key)) specCache.set(key, findSheetSpec(grid));
      spec = specCache.get(key);
    }
    spec = resolveSpec(spec, grid);
    const next = spec && !/^\s*var\(/.test(spec) ? transformGridSpec(spec, need, extraCols) : null;
    if (next) {
      grid.style.setProperty('grid-template-columns', next, 'important');
      if (lastTrackPx(grid) >= need - 1) usedMode = 'spec';
      else resetGridInline(grid);
    }
    if (!usedMode && pxFit(grid, need, extraCols)) usedMode = 'px';
    grid.dataset.djMode = usedMode;
    grid.dataset.djFit =
      need + '|' + extraSig + '|' + (usedMode === 'px' ? Math.round(grid.clientWidth) : '');
    grid.dataset.djFitStyle = grid.style.getPropertyValue('grid-template-columns');
  }
  function fitGridsNow() {
    const groups = new Map();
    const getGroup = (row) => {
      const key =
        row.closest(
          '[role="grid"], [role="table"], [data-testid="playlist-tracklist"], [data-testid="track-list"]',
        ) || document.body;
      if (!groups.has(key))
        groups.set(key, {
          grids: [],
          headerIp: null,
          widestRowIp: null,
          maxScore: -1,
          sepSamples: { djinfo: [], stars: [], djprep: [] },
        });
      return groups.get(key);
    };
    const collectSepSamples = (row, g) => {
      for (const def of EXTRA_COL_DEFS) {
        if (g.sepSamples[def.key].length < 9) {
          const el = row.querySelector(def.selector);
          if (el) g.sepSamples[def.key].push(el);
        }
      }
    };
    const hasAnyExtensionChild = (row) =>
      row.querySelector(
        '.djInfoList, .djInfoHeaderCol, .starRatings, .starRatingsHeader, .djprep-row-wrapper, .djprep-header-wrapper',
      ) !== null;
    getAllHeaderRows().forEach((r) => {
      if (!hasAnyExtensionChild(r)) return;
      const ip = getRowInsertionPoint(r, true);
      const grid = ip && ip.parentElement;
      if (!grid || getComputedStyle(grid).display !== 'grid') return;
      const g = getGroup(r);
      g.grids.push(grid);
      if (!g.headerIp) g.headerIp = ip;
      collectSepSamples(r, g);
    });
    getAllTrackRows().forEach((r) => {
      if (!hasAnyExtensionChild(r)) return;
      const ip = getRowInsertionPoint(r, false);
      const grid = ip && ip.parentElement;
      if (!grid || getComputedStyle(grid).display !== 'grid') return;
      const g = getGroup(r);
      g.grids.push(grid);
      collectSepSamples(r, g);
      const score = (ip.textContent || '').length + ip.childElementCount * 10;
      if (score > g.maxScore) {
        g.maxScore = score;
        g.widestRowIp = ip;
      }
    });
    groups.forEach((g) => {
      let need = 0;
      if (g.headerIp) need = Math.max(need, Math.ceil(g.headerIp.getBoundingClientRect().width));
      if (g.widestRowIp)
        need = Math.max(need, Math.ceil(g.widestRowIp.getBoundingClientRect().width));
      const extraCols = [];
      for (const def of EXTRA_COL_DEFS) {
        const samples = g.sepSamples[def.key];
        if (samples.length > 0) {
          // The cells carry their own width (user setting / CSS min-width), so measure them
          // directly; defaultWidth only applies when a sample cannot be measured.
          let w = 0;
          samples.forEach((el) => {
            w = Math.max(w, Math.ceil(el.getBoundingClientRect().width));
          });
          if (w <= 0) w = def.defaultWidth;
          extraCols.push({ key: def.key, width: w });
        }
      }
      g.grids.forEach((grid) => applyGridFit(grid, need, extraCols));
    });
  }

  let observedMain = null;
  const resizeObs = new ResizeObserver(() => {
    specCache.clear();
    try {
      fitGridsNow();
    } catch {}
  });
  let styleRaf = 0;
  const observedStyleRoots = new WeakSet();
  const styleObs = new MutationObserver((records) => {
    if (styleRaf) return;
    let relevant = false;
    for (const r of records) {
      const t = r.target;
      if (!t || !t.style) continue;
      if (t.dataset && t.dataset.djFit !== undefined) {
        if (t.style.getPropertyValue('grid-template-columns') !== t.dataset.djFitStyle) {
          relevant = true;
          break;
        }
      } else if (t.style.cssText.indexOf('--') !== -1 && t.querySelector('[data-dj-fit]')) {
        relevant = true;
        break;
      }
    }
    if (!relevant) return;
    styleRaf = requestAnimationFrame(() => {
      styleRaf = 0;
      forceFit = true;
      try {
        fitGridsNow();
      } catch {}
      forceFit = false;
    });
  });
  function bindObservers() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;
    if (mainEl !== observedMain) {
      resizeObs.disconnect();
      resizeObs.observe(mainEl);
      observedMain = mainEl;
    }
    const roots = mainEl.querySelectorAll(
      '[data-testid="playlist-tracklist"], [data-testid="track-list"], .main-trackList-indexable, [role="grid"], [role="table"]',
    );
    roots.forEach((root) => {
      if (!observedStyleRoots.has(root)) {
        styleObs.observe(root, { attributes: true, attributeFilter: ['style'], subtree: true });
        observedStyleRoots.add(root);
      }
    });
  }
  function scheduleFit(force = false) {
    if (force) forceFit = true;
    bindObservers();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      try {
        fitGridsNow();
      } catch (e) {
        console.error('SpicetifyGridCoordinator fit error:', e);
      }
      forceFit = false;
    });
  }
  const api = {
    version: 2,
    isInsideSearchBarDropdown,
    getRowInsertionPoint,
    getAllHeaderRows,
    getAllTrackRows,
    fitGridsNow,
    scheduleFit,
    bindObservers,
    clearSpecCache: () => specCache.clear(),
    cleanup: () => {
      resizeObs.disconnect();
      styleObs.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
  window.SpicetifyGridCoordinator = api;
  return api;
})();
