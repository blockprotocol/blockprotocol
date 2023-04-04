import { createRoot } from "react-dom/client";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("blockprotocol-settings-react-promo");
  if (root) {
    createRoot(root).render(<p>@todo React promo (from JSX)</p>, root);
  }
});