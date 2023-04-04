import { createRoot } from "react-dom/client";
import { ReactPromo } from "./react-promo";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("blockprotocol-settings-react-promo");
  if (root) {
    createRoot(root).render(<ReactPromo />);
  }
});
