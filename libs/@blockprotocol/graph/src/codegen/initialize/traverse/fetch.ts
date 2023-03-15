import fetch from "node-fetch";

export const fetchTypeAsJson = (versionedUrl: string) =>
  fetch(versionedUrl, {
    headers: {
      accept: "application/json",
    },
  }).then((resp) => resp.json());
