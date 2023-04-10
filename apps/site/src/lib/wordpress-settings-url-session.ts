export const wordpressSettingsUrlSessionKey =
  "blockprotocol.dashboard.wordpressSettingsUrl";

export const setWordpressSettingsUrlSession = (
  wordpressSettingsUrl: string | null | undefined,
) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call setWordpressSettingsUrlSession on server");
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

export const getWordpressSettingsUrlSessionOnce = () => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call getWordpressSettingsUrlSessionOnce on server");
  }

  try {
    const value = window.sessionStorage.getItem(wordpressSettingsUrlSessionKey);

    window.sessionStorage.removeItem(wordpressSettingsUrlSessionKey);

    return value;
  } catch {
    return null;
  }
};
