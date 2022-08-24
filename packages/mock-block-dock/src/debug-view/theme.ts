import { createTheme, ThemeOptions } from "@mui/material";

const fallbackFonts = [`Inter`, `"Helvetica"`, `"Arial"`, "sans-serif"];

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: fallbackFonts.join(", ")
  }
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark"
  }
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light"
  }
});
