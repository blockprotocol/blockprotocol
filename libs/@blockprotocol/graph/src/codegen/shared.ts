import fetch from "node-fetch";

export const fetchTypeAsJson = (versionedUri: string) =>
  fetch(versionedUri, {
    headers: {
      accept: "application/json",
    },
  }).then((resp) => resp.json());
