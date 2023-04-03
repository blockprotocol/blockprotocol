export const wordpressInstanceUrlSessionKey =
  "blockprotocol.dashboard.wordpressInstanceUrl";

export const setWordpressInstanceUrlSession = (
  wordpressInstanceUrl: string | null | undefined,
) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call setWordpressInstanceUrlSession on server");
  }

  if (wordpressInstanceUrl) {
    window.sessionStorage.setItem(
      wordpressInstanceUrlSessionKey,
      wordpressInstanceUrl,
    );
  } else {
    window.sessionStorage.removeItem(wordpressInstanceUrlSessionKey);
  }
};

export const getWordpressInstanceUrlSessionOnce = () => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call getWordpressInstanceUrlSessionOnce on server");
  }

  const value = window.sessionStorage.getItem(wordpressInstanceUrlSessionKey);

  window.sessionStorage.removeItem(wordpressInstanceUrlSessionKey);

  return value;
};
