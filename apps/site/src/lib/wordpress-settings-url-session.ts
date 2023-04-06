export const wordPressSettingsUrlSessionKey =
  "blockprotocol.dashboard.wordPressSettingsUrl";

export const setWordPressSettingsUrlSession = (
  wordPressSettingsUrl: string | null | undefined,
) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call setWordPressSettingsUrlSession on server");
  }

  try {
    if (wordPressSettingsUrl) {
      window.sessionStorage.setItem(
        wordPressSettingsUrlSessionKey,
        wordPressSettingsUrl,
      );
    } else {
      window.sessionStorage.removeItem(wordPressSettingsUrlSessionKey);
    }
  } catch (_) {
    // sessionStorage is disabled, do nothing…
  }
};

export const getWordPressSettingsUrlSessionOnce = () => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call getWordPressSettingsUrlSessionOnce on server");
  }

  try {
    const value = window.sessionStorage.getItem(wordPressSettingsUrlSessionKey);

    window.sessionStorage.removeItem(wordPressSettingsUrlSessionKey);

    return value;
  } catch {
    return null;
  }
};
