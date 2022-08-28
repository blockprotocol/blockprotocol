import {
  Box,
  Button as MuiButton,
  ButtonProps,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { useMockBlockDockContext } from "../mock-block-dock-context";
import { DarkMode, LightMode, Logo } from "./icons";
import { customColors } from "./theme/palette";

export const HEADER_HEIGHT = 50;

const Container = styled(Box)(({ theme }) => ({
  height: HEADER_HEIGHT,
  position: "sticky",
  top: 0,
  zIndex: 2000,
  backgroundColor:
    theme.palette.mode === "light" ? theme.palette.common.white : "#2C2C2C",
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Button = styled(({ children, sx = [], ...props }: ButtonProps) => (
  <MuiButton
    size="small"
    disableFocusRipple
    disableRipple
    disableTouchRipple
    {...props}
    variant="outlined"
    color="inherit"
    sx={[
      {
        textTransform: "none",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </MuiButton>
))(({ theme }) => ({
  borderColor:
    theme.palette.mode === "light" ? customColors.gray[30] : "#444444",
  color: theme.palette.mode === "light" ? customColors.gray[90] : "#8E8E8E",
}));

type Props = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const packageVersion = __VERSION__; // eslint-disable-line
const packageVersion = "";

export const Header = ({ darkMode, setDarkMode }: Props) => {
  const { setDebugMode } = useMockBlockDockContext();

  return (
    <Container>
      <Box display="flex" alignItems="center" mr="auto">
        <Logo
          sx={({ palette }) => ({
            fontSize: "3rem",
            color:
              palette.mode === "light"
                ? customColors.black
                : palette.common.white,
            mr: 1,
          })}
        />
        <Typography variant="caption" color={customColors.gray[60]}>
          {packageVersion}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
        }}
      >
        <Typography
          fontWeight="medium"
          mr={0.5}
          variant="subtitle2"
          sx={({ palette }) => ({
            color:
              palette.mode === "light"
                ? customColors.gray[70]
                : customColors.gray[30],
          })}
        >
          Blocks /
        </Typography>
        <Typography variant="subtitle2" fontWeight="medium">
          Person
        </Typography>
      </Box>

      <Tooltip title={`Switch to ${darkMode ? "light" : "dark"} mode`}>
        <IconButton sx={{ mr: 1 }} onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>

      <Button href="https://blockprotocol.org/docs" sx={{ mr: 1 }}>
        Docs
      </Button>
      <Button onClick={() => setDebugMode(false)}>Exit Debug</Button>
    </Container>
  );
};
