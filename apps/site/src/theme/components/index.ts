import { ThemeOptions } from "@mui/material";

import { MuiIconButtonThemeOptions } from "./data-display/mui-icon-button-theme-options";
import { MuiIconThemeOptions } from "./data-display/mui-icon-theme-options";
import { MuiListItemButtonThemeOptions } from "./data-display/mui-list-item-button-theme-options";
import { MuiListItemIconThemeOptions } from "./data-display/mui-list-item-icon-theme-options";
import { MuiListItemTextThemeOptions } from "./data-display/mui-list-item-text-theme-options";
import { MuiTooltipThemeOptions } from "./data-display/mui-tooltip-theme-options";
import { MuiTypographyThemeOptions } from "./data-display/mui-typography-theme-options";
import { MuiAlertThemeOptions } from "./feedback/mui-alert-theme-options";
import { MuiSkeletonThemeOptions } from "./feedback/mui-skeleton-theme-options";
import { MuiButtonThemeOptions } from "./inputs/mui-button-theme-options";
import { MuiCheckboxThemeOptions } from "./inputs/mui-checkbox-theme-options";
import { MuiFormControlThemeOptions } from "./inputs/mui-form-control-theme-options";
import { MuiInputBaseThemeOptions } from "./inputs/mui-input-base-theme-options";
import { MuiInputLabelThemeOptions } from "./inputs/mui-input-label-theme-options";
import { MuiOutlinedInputThemeOptions } from "./inputs/mui-outlined-input-theme-options";
import { MuiTextFieldThemeOptions } from "./inputs/mui-text-field-theme-options";
import { MuiContainerThemeOptions } from "./layout/mui-container-theme-options";
import { MuiBreadcrumbsThemeOptions } from "./navigation/mui-breadcrumbs-theme-options";
import { MuiLinkThemeOptions } from "./navigation/mui-link-theme-options";
import { MuiTabThemeOptions } from "./navigation/mui-tab-theme-options";
import { MuiTabsThemeOptions } from "./navigation/mui-tabs-theme-options";
import { MuiPaperThemeOptions } from "./surfaces/mui-paper-theme-options";
import { MuiBackdropThemeOptions } from "./utils/mui-backdrop-theme-options";
import { MuiCssBaselineThemeOptions } from "./utils/mui-css-baseline-theme-options";

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
  MuiTooltip: MuiTooltipThemeOptions,

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
