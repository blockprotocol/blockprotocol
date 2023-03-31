import { useSetting } from "@wordpress/block-editor";

type ColorOptions = {
  light: string;
  main: string;
  dark: string;
};

type TypographyOptions = {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  textDecoration?: string;
  textTransform?: string;
};

export type BlockProtocolThemeObject = {
  colors: {
    // from https://mui.com/material-ui/customization/palette/
    primary: ColorOptions;
    secondary: ColorOptions;
    error: ColorOptions;
    warning: ColorOptions;
    info: ColorOptions;
    success: ColorOptions;

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
  typography: TypographyOptions & {
    h1: TypographyOptions;
    h2: TypographyOptions;
    h3: TypographyOptions;
    h4: TypographyOptions;
    h5: TypographyOptions;
    h6: TypographyOptions;
  };
};

// Things that might be useful
// for full list @see https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/#settings
// and JSON schema for this file here https://schemas.wp.org/trunk/theme.json
// const userPalette = useSetting("color.palette.custom");
// const themePalette = useSetting("color.palette.theme");
// const defaultPalette = useSetting("color.palette.default");
// const userGradientPalette = useSetting("color.gradients.custom");
// const themeGradientPalette = useSetting("color.gradients.theme");
// const defaultGradientPalette = useSetting("color.gradients.default");
//
// const fontSizes = useSetting("typography.fontSizes");
// const blockLevelFontFamilies = useSetting("typography.fontFamilies");
//
// const coreBlockSettings = useSetting("blocks");
//
// // these are all booleans
// const areCustomSolidsEnabled = useSetting("color.custom");
// const areCustomGradientsEnabled = useSetting("color.customGradient");
// const isBackgroundEnabled = useSetting("color.background");
// const isLinkEnabled = useSetting("color.link");
// const isTextEnabled = useSetting("color.text");
// const hasFontStyles = useSetting("typography.fontStyle");
// const hasFontWeights = useSetting("typography.fontWeight");
// const hasLetterSpacing = useSetting("typography.letterSpacing");
// const hasTextDecoration = useSetting("typography.textDecoration");
// const hasTextTransforms = useSetting("typography.textTransform");
//
// const spacingSizes = useSetting("spacing.spacingSizes");

const getCssVariableValue = (variableName: string, element: HTMLElement) => {
  console.log("Computed", getComputedStyle(element));
  getComputedStyle(element).getPropertyValue(variableName);
};

const getValue = (value: string | undefined, element: HTMLElement) => {
  if (value?.startsWith("var(")) {
    const variableName = value.slice(4, -1);
    console.log({ variableName, element });
    return getCssVariableValue(variableName, element);
  }
  return value;
};

const resolveObjectValues = (
  object: Record<string, string>,
  element: HTMLElement,
) => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      getValue(value, element),
    ]),
  );
};

export const generateTheme = (
  element: HTMLElement,
): BlockProtocolThemeObject => {
  const themeJson = window.block_protocol_data.theme;

  if (!themeJson) {
    throw new Error(
      "No theme information attached to window.block_protocol_Data",
    );
  }

  const {
    settings: {
      color: { palette },
    },
    styles,
  } = themeJson;

  console.log({ themeJson });

  const background = palette.find((color) => color.slug === "base");
  const foreground = palette.find((color) => color.slug === "contrast");
  const primary = palette.find((color) => color.slug === "primary");
  const secondary = palette.find((color) => color.slug === "secondary");
  const tertiary = palette.find((color) => color.slug === "tertiary");

  const defaultTypography = resolveObjectValues(
    themeJson.styles.typography,
    element,
  );

  console.log("Typo", themeJson.styles.typography, defaultTypography);

  return {
    colors: {
      background: {
        main:
          getValue(background?.color, element) ||
          getCssVariableValue("--wp--preset--color--base", element),
      },
      foreground: {
        main:
          getValue(foreground?.color, element) ||
          getCssVariableValue("--wp--preset--color--contrast", element),
      },
      primary: {
        main:
          getValue(primary?.color, element) ||
          getCssVariableValue("--wp--preset--color--primary", element),
      },
      secondary: {
        main:
          getValue(secondary?.color, element) ||
          getCssVariableValue("--wp--preset--color--secondary", element),
      },
      tertiary: {
        main:
          getValue(tertiary?.color, element) ||
          getCssVariableValue("--wp--preset--color--tertiary", element),
      },
    },
    typography: {
      ...defaultTypography,
      h1: {
        ...defaultTypography,
        ...resolveObjectValues(styles.elements.h1.typography, element),
      },
      h2: {
        ...defaultTypography,
        ...resolveObjectValues(styles.elements.h2.typography, element),
      },
      h3: {
        ...defaultTypography,
        ...resolveObjectValues(styles.elements.h3.typography, element),
      },
      h4: {
        ...defaultTypography,
        ...resolveObjectValues(styles.elements.h4.typography, element),
      },
      h5: {
        ...defaultTypography,
        ...resolveObjectValues(styles.elements.h5.typography, element),
      },
      h6: {
        ...defaultTypography,
        ...resolveObjectValues(styles.elements.h6.typography, element),
      },
    },
  };
};
