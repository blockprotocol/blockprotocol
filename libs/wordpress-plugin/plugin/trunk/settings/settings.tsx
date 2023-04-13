import { lazy } from "react";
import { createRoot } from "react-dom/client";

const ReactPromo = lazy(() =>
  import("./react-promo").then((mod) => ({ default: mod.ReactPromo })),
);

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("blockprotocol-settings-react-promo");
  if (root) {
    createRoot(root).render(<ReactPromo />);
  }
});
