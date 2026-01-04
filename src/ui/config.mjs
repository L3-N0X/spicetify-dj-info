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
};

export let CONFIG;

export function loadConfig() {
  try {
    CONFIG = JSON.parse(Spicetify.LocalStorage.get("dj-info-config") || "error");
  } catch {
    CONFIG = { ...DEFAULT_CONFIG };
  }
}

export function saveConfig() {
  Spicetify.LocalStorage.set("dj-info-config", JSON.stringify(CONFIG));
}