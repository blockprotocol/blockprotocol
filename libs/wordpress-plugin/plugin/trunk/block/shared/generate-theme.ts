import { useSetting } from "@wordpress/block-editor";

export type StyleObject = {
  colors: {
    // from https://mui.com/material-ui/customization/palette/
    primary: {
      light: string;
      main: string;
      dark: string;
    };
    secondary: {
      light: string;
      main: string;
      dark: string;
    };
    error: {
      light: string;
      main: string;
      dark: string;
    };
    warning: {
      light: string;
      main: string;
      dark: string;
    };
    info: {
      light: string;
      main: string;
      dark: string;
    };
    success: {
      light: string;
      main: string;
      dark: string;
    };
    // from https://primer.style/design/foundations/color
    background: {
      main: string;
      inset: string;
      subtle: string;
      emphasis: string;
    };
    foreground: {
      main: string;
      muted: string;
      subtle: string;
      onEmphasis: string;
    };
    border: {
      main: string;
      muted: string;
    };
  };
};

export const generateTheme = () => {
  // for full list @see https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#settings
  const userPalette = useSetting("color.palette.custom");
  const themePalette = useSetting("color.palette.theme");
  const defaultPalette = useSetting("color.palette.default");
  const userGradientPalette = useSetting("color.gradients.custom");
  const themeGradientPalette = useSetting("color.gradients.theme");
  const defaultGradientPalette = useSetting("color.gradients.default");

  const fontSizes = useSetting("typography.fontSizes");
  const blockLevelFontFamilies = useSetting("typography.fontFamilies");

  const coreBlockSettings = useSetting("blocks");
  console.log({ coreBlockSettings });

  // these are all booleans
  const areCustomSolidsEnabled = useSetting("color.custom");
  const areCustomGradientsEnabled = useSetting("color.customGradient");
  const isBackgroundEnabled = useSetting("color.background");
  const isLinkEnabled = useSetting("color.link");
  const isTextEnabled = useSetting("color.text");
  const hasFontStyles = useSetting("typography.fontStyle");
  const hasFontWeights = useSetting("typography.fontWeight");
  const hasLetterSpacing = useSetting("typography.letterSpacing");
  const hasTextDecoration = useSetting("typography.textDecoration");
  const hasTextTransforms = useSetting("typography.textTransform");

  const spacingSizes = useSetting("spacing.spacingSizes");

  console.log({
    userPalette,
    themePalette,
    defaultPalette,
    userGradientPalette,
    themeGradientPalette,
    defaultGradientPalette,
    areCustomSolidsEnabled,
    areCustomGradientsEnabled,
    isBackgroundEnabled,
    isLinkEnabled,
    isTextEnabled,
    fontSizes,
    blockLevelFontFamilies,
    hasFontStyles,
    hasFontWeights,
    hasLetterSpacing,
    hasTextDecoration,
    hasTextTransforms,
    spacingSizes,
  });
};
