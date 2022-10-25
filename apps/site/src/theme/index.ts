import { createTheme } from "@mui/material";

import { components } from "./components/index.js";
import { palette } from "./palette.js";
import { shadows } from "./shadows.js";
import { typography } from "./typography.js";

export const theme = createTheme({
  palette,
  typography,
  shadows,
  components,
});
