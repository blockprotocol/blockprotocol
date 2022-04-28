import { createTheme } from "@mui/material";

import { components } from "./components";
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";

export const theme = createTheme({
  palette,
  typography,
  shadows,
  components,
});
