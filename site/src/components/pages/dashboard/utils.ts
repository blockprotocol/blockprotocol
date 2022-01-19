import { SxProps, Theme } from "@mui/material";

export const dashboardPages: { tabTitle: string; tabHref: string }[] = [
  {
    tabTitle: "Dashboard",
    tabHref: "/dashboard",
  },
  {
    tabTitle: "Settings",
    tabHref: "/settings/api-keys",
  },
];

export const dashboardButtonStyles: SxProps<Theme> = {
  padding: "11px 28px",
  background: "#FFFFFF",
  border: "1px solid #C1CFDE",
  boxShadow:
    "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    color: "#6048E5",
    border: "1px solid #6048E5",
    background: "#F4F3FF",
  },

  transition: "all 0.2s ease-in-out",
};

export const dashboardSmallButtonStyles: SxProps<Theme> = {
  px: 1,
  py: 0.5,
  background: "#FFFFFF",
  border: "1px solid #C1CFDE",
  boxShadow:
    "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    color: "#6048E5",
    border: "1px solid #6048E5",
    background: "#F4F3FF",
  },

  transition: "all 0.2s ease-in-out",
};

export const dashboardDangerButtonStyles: SxProps<Theme> = {
  px: 1,
  py: 0.5,
  background: "#FFF6ED",
  color: "#BF4908",
  border: "1px solid #FEB173",
  boxShadow:
    "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    color: "#853508",
    background: "#f3d9c0",
  },

  transition: "all 0.2s ease-in-out",
};
