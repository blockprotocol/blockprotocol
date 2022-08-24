import { createTheme } from "@mui/material";

const fallbackFonts = [`Inter`, `"Helvetica"`, `"Arial"`, "sans-serif"];

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: fallbackFonts.join(", "),
  },
});
