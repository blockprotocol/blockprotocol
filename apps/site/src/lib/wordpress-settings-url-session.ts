export const wordpressSettingsUrlSessionKey =
  "blockprotocol.dashboard.wordpressSettingsUrl";

export const setWordPressSettingsUrlSession = (
  wordpressSettingsUrl: string | null | undefined,
) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call setWordPressSettingsUrlSession on server");
  }

  try {
    if (wordpressSettingsUrl) {
      window.sessionStorage.setItem(
        wordpressSettingsUrlSessionKey,
        wordpressSettingsUrl,
      );
    } else {
      window.sessionStorage.removeItem(wordpressSettingsUrlSessionKey);
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
    const value = window.sessionStorage.getItem(wordpressSettingsUrlSessionKey);

    window.sessionStorage.removeItem(wordpressSettingsUrlSessionKey);

    return value;
  } catch {
    return null;
  }
};
