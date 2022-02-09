import { ThemeOptions } from "@mui/material";

import { MuiCssBaselineThemeOptions } from "./utils/MuiCssBaselineThemeOptions";
import { MuiTypographyThemeOptions } from "./dataDisplay/MuiTypographyThemeOptions";
import { MuiIconButtonThemeOptions } from "./dataDisplay/MuiIconButtonThemeOptions";
import { MuiPaperThemeOptions } from "./surfaces/MuiPaperThemeOptions";
import { MuiButtonThemeOptions } from "./inputs/MuiButtonThemeOptions";
import { MuiContainerThemeOptions } from "./layout/MuiContainerThemeOptions";
import { MuiIconThemeOptions } from "./dataDisplay/MuiIconThemeOptions";
import { MuiSkeletonThemeOptions } from "./feedback/MuiSkeletonThemeOptions";
import { MuiListItemButtonThemeOptions } from "./dataDisplay/MuiListItemButtonThemeOptions";
import { MuiListItemIconThemeOptions } from "./dataDisplay/MuiListItemIconThemeOptions";
import { MuiListItemTextThemeOptions } from "./dataDisplay/MuiListItemTextThemeOptions";
import { MuiLinkThemeOptions } from "./navigation/MuiLinkThemeOptions";
import { MuiCheckboxThemeOptions } from "./inputs/MuiCheckboxThemeOptions";
import { MuiTabsThemeOptions } from "./navigation/MuiTabsThemeOptions";
import { MuiTabThemeOptions } from "./navigation/MuiTabThemeOptions";
import { MuiBreadcrumbsThemeOptions } from "./navigation/MuiBreadcrumbsThemeOptions";
import { MuiFormControlThemeOptions } from "./inputs/MuiFormControlThemeOptions";
import { MuiInputLabelThemeOptions } from "./inputs/MuiInputLabelThemeOptions";
import { MuiInputBaseThemeOptions } from "./inputs/MuiInputBaseThemeOptions";
import { MuiOutlinedInputThemeOptions } from "./inputs/MuiOutlinedInputThemeOptions";
import { MuiTextFieldThemeOptions } from "./inputs/MuiTextFieldThemeOptions";

export const components: ThemeOptions["components"] = {
  MuiCssBaseline: MuiCssBaselineThemeOptions,
  MuiTypography: MuiTypographyThemeOptions,
  MuiIconButton: MuiIconButtonThemeOptions,
  MuiPaper: MuiPaperThemeOptions,
  MuiButton: MuiButtonThemeOptions,
  MuiContainer: MuiContainerThemeOptions,
  MuiIcon: MuiIconThemeOptions,
  MuiSkeleton: MuiSkeletonThemeOptions,
  MuiListItemButton: MuiListItemButtonThemeOptions,
  MuiListItemIcon: MuiListItemIconThemeOptions,
  MuiListItemText: MuiListItemTextThemeOptions,
  MuiLink: MuiLinkThemeOptions,
  MuiCheckbox: MuiCheckboxThemeOptions,
  MuiTabs: MuiTabsThemeOptions,
  MuiTab: MuiTabThemeOptions,
  MuiBreadcrumbs: MuiBreadcrumbsThemeOptions,
  MuiFormControl: MuiFormControlThemeOptions,
  MuiInputLabel: MuiInputLabelThemeOptions,
  MuiInputBase: MuiInputBaseThemeOptions,
  MuiOutlinedInput: MuiOutlinedInputThemeOptions,
  MuiTextField: MuiTextFieldThemeOptions,
};
