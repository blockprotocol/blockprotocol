import { Box, Chip, IconButton, styled, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { useMockBlockDockContext } from "../mock-block-dock-context";
import { Logo } from "./icons";

export const HEADER_HEIGHT = 56;

const Container = styled(Box)(({ theme }) => ({
  height: HEADER_HEIGHT,
  position: "sticky",
  top: 0,
  zIndex: 2000,
  backgroundColor: theme.palette.background.default,
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const chipInfo = {
  html: {
    color: "info",
    label: "HTML Block"
  },
  "custom-element": {
    label: "Custom Element Block",
    color: "warning"
  },
  react: { label: "React Block", color: "secondary" }
} as const;

type Props = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  blockType?: "html" | "react" | "custom-element";
};

export const Header = ({ darkMode, setDarkMode, blockType }: Props) => {
  const { setDebugMode } = useMockBlockDockContext();

  return (
    <Container>
      <Logo
        sx={({ palette }) => ({
          fontSize: "3rem",
          color: palette.mode === "light" ? "#0E1114" : palette.common.white,
          mr: "auto"
        })}
      />
      <Tooltip title={`Switch to ${darkMode ? "light" : "dark"} mode`}>
        <IconButton sx={{ mr: 1 }} onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? "light mode" : "dark mode"}
        </IconButton>
      </Tooltip>

      {blockType && (
        <Chip
          size="small"
          label={chipInfo[blockType].label}
          color={chipInfo[blockType].color}
        />
      )}

      {/* @todo add zoom functionality */}
      <Tooltip title="Exit Debug View">
        <IconButton onClick={() => setDebugMode(false)}>Exit</IconButton>
      </Tooltip>
    </Container>
  );
};

// #0E1114
