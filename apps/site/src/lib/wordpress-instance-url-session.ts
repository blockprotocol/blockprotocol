export const wordpressInstanceUrlSessionKey =
  "blockprotocol.dashboard.wordpressInstanceUrl";

export const setWordpressInstanceUrlSession = (
  wordpressInstanceUrl: string | null | undefined,
) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call setWordpressInstanceUrlSession on server");
  }

  try {
    if (wordpressInstanceUrl) {
      window.sessionStorage.setItem(
        wordpressInstanceUrlSessionKey,
        wordpressInstanceUrl,
      );
    } else {
      window.sessionStorage.removeItem(wordpressInstanceUrlSessionKey);
    }
  } catch (_) {
    // sessionStorage is disabled, do nothing…
  }
};

export const getWordpressInstanceUrlSessionOnce = () => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call getWordpressInstanceUrlSessionOnce on server");
  }

  try {
    const value = window.sessionStorage.getItem(wordpressInstanceUrlSessionKey);

    window.sessionStorage.removeItem(wordpressInstanceUrlSessionKey);

    return value;
  } catch {
    return null;
  }
};
