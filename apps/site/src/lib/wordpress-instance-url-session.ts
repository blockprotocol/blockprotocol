export const wordpressInstanceUrlSessionKey =
  "blockprotocol.dashboard.wordpressInstanceUrl";

export const setWordpressInstanceUrlSession = (
  wordpressInstanceUrl: string | null | undefined,
) => {
  if (typeof window === "undefined") {
    throw new Error("Cannot call setWordpressInstanceUrlSession on server");
  }

  // @note must be compatible with use-session-storage-state
  if (wordpressInstanceUrl) {
    window.sessionStorage.setItem(
      wordpressInstanceUrlSessionKey,
      JSON.stringify(wordpressInstanceUrl),
    );
  } else {
    window.sessionStorage.removeItem(wordpressInstanceUrlSessionKey);
  }
};
