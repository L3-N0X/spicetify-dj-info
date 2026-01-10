const DEFAULT_CONFIG = {
  isPlaylistEnabled: true,
  isNowPlayingEnabled: true,
  isLeftPlayingEnabled: false,
  isRecommendationsEnabled: true,
  isBPMEnabled: true,
  isKeyEnabled: false,
  isCamelotEnabled: true,
  isPopularityEnabled: true,
  isEnergyEnabled: false,
  isDanceEnabled: false,
  isYearEnabled: true,
  isRichUiEnabled: true,
};

export let CONFIG;

export function loadConfig() {
  try {
    CONFIG = JSON.parse(Spicetify.LocalStorage.get('dj-info-config') || 'error');

    // Make sure energy and dance are disabled because it's not available anymore
    if (CONFIG.isEnergyEnabled) {
      CONFIG.isEnergyEnabled = false;
      saveConfig();
    }
    if (CONFIG.isDanceEnabled) {
      CONFIG.isDanceEnabled = false;
      saveConfig();
    }
  } catch {
    CONFIG = { ...DEFAULT_CONFIG };
  }
}

export function saveConfig() {
  Spicetify.LocalStorage.set('dj-info-config', JSON.stringify(CONFIG));
}
