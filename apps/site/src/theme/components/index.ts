import { ThemeOptions } from "@mui/material";

import { MuiIconButtonThemeOptions } from "./data-display/mui-icon-button-theme-options.js";
import { MuiIconThemeOptions } from "./data-display/mui-icon-theme-options.js";
import { MuiListItemButtonThemeOptions } from "./data-display/mui-list-item-button-theme-options.js";
import { MuiListItemIconThemeOptions } from "./data-display/mui-list-item-icon-theme-options.js";
import { MuiListItemTextThemeOptions } from "./data-display/mui-list-item-text-theme-options.js";
import { MuiTypographyThemeOptions } from "./data-display/mui-typography-theme-options.js";
import { MuiAlertThemeOptions } from "./feedback/mui-alert-theme-options.js";
import { MuiSkeletonThemeOptions } from "./feedback/mui-skeleton-theme-options.js";
import { MuiButtonThemeOptions } from "./inputs/mui-button-theme-options.js";
import { MuiCheckboxThemeOptions } from "./inputs/mui-checkbox-theme-options.js";
import { MuiFormControlThemeOptions } from "./inputs/mui-form-control-theme-options.js";
import { MuiInputBaseThemeOptions } from "./inputs/mui-input-base-theme-options.js";
import { MuiInputLabelThemeOptions } from "./inputs/mui-input-label-theme-options.js";
import { MuiOutlinedInputThemeOptions } from "./inputs/mui-outlined-input-theme-options.js";
import { MuiTextFieldThemeOptions } from "./inputs/mui-text-field-theme-options.js";
import { MuiContainerThemeOptions } from "./layout/mui-container-theme-options.js";
import { MuiBreadcrumbsThemeOptions } from "./navigation/mui-breadcrumbs-theme-options.js";
import { MuiLinkThemeOptions } from "./navigation/mui-link-theme-options.js";
import { MuiTabThemeOptions } from "./navigation/mui-tab-theme-options.js";
import { MuiTabsThemeOptions } from "./navigation/mui-tabs-theme-options.js";
import { MuiPaperThemeOptions } from "./surfaces/mui-paper-theme-options.js";
import { MuiBackdropThemeOptions } from "./utils/mui-backdrop-theme-options.js";
import { MuiCssBaselineThemeOptions } from "./utils/mui-css-baseline-theme-options.js";

export const components: ThemeOptions["components"] = {
  /** ===== INPUTS ==== */
  MuiButton: MuiButtonThemeOptions,
  MuiCheckbox: MuiCheckboxThemeOptions,
  MuiTextField: MuiTextFieldThemeOptions,
  MuiFormControl: MuiFormControlThemeOptions,
  MuiInputLabel: MuiInputLabelThemeOptions,
  MuiInputBase: MuiInputBaseThemeOptions,
  MuiOutlinedInput: MuiOutlinedInputThemeOptions,

  /** ===== DATA DISPLAY ===== */
  MuiTypography: MuiTypographyThemeOptions,
  MuiIconButton: MuiIconButtonThemeOptions,
  MuiIcon: MuiIconThemeOptions,
  MuiListItemButton: MuiListItemButtonThemeOptions,
  MuiListItemIcon: MuiListItemIconThemeOptions,
  MuiListItemText: MuiListItemTextThemeOptions,

  /** ===== SURFACES ===== */
  MuiPaper: MuiPaperThemeOptions,

  /** ===== LAYOUT ===== */
  MuiContainer: MuiContainerThemeOptions,

  /** ===== NAVIGATION ===== */
  MuiBreadcrumbs: MuiBreadcrumbsThemeOptions,
  MuiLink: MuiLinkThemeOptions,
  MuiTabs: MuiTabsThemeOptions,
  MuiTab: MuiTabThemeOptions,

  /** ===== FEEDBACK ===== */
  MuiSkeleton: MuiSkeletonThemeOptions,
  MuiAlert: MuiAlertThemeOptions,

  /** ===== UTILS ===== */
  MuiCssBaseline: MuiCssBaselineThemeOptions,
  MuiBackdrop: MuiBackdropThemeOptions,
};
