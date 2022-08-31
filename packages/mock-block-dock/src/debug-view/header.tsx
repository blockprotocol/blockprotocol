import {
  Box,
  Button as MuiButton,
  ButtonProps,
  styled,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { useMockBlockDockContext } from "../mock-block-dock-context";
import { MOCK_BLOCK_DOCK_VERSION } from "../version";
import { Logo, OffSwitch, OnSwitch } from "./icons";
import { customColors } from "./theme/palette";

export const HEADER_HEIGHT = 50;

const Container = styled(Box)(({ theme }) => ({
  height: HEADER_HEIGHT,
  position: "sticky",
  top: 0,
  zIndex: 2000,
  backgroundColor:
    theme.palette.mode === "light" ? theme.palette.common.white : "#2C2C2C", // @todo include dark mode color in palette
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
    theme.palette.mode === "light" ? customColors.gray[30] : "#444444", // @todo include dark mode color in palette
  color: theme.palette.mode === "light" ? customColors.gray[90] : "#8E8E8E", // @todo include dark mode color in palette
}));

type Props = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({ darkMode, setDarkMode }: Props) => {
  const { setDebugMode, blockName } = useMockBlockDockContext();

  return (
    <Container>
      <Box display="flex" alignItems="center" mr="auto">
        <Logo
          sx={({ palette }) => ({
            height: 20,
            width: "auto",
            color:
              palette.mode === "light"
                ? customColors.black
                : palette.common.white,
            mr: 1,
          })}
        />
        <Typography
          variant="subtitle2"
          fontWeight="normal"
          color={customColors.gray[60]}
        >
          v{MOCK_BLOCK_DOCK_VERSION}
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
          {blockName}
        </Typography>
      </Box>

      <Button href="https://blockprotocol.org/docs" sx={{ mr: 1 }}>
        Docs
      </Button>

      <Button onClick={() => setDarkMode((prev) => !prev)} sx={{ mr: 1 }}>
        Dark Mode
        {darkMode ? (
          <OnSwitch sx={{ height: 20, width: 40, ml: 1.25 }} />
        ) : (
          <OffSwitch sx={{ height: 20, width: 40, ml: 1.25 }} />
        )}
      </Button>

      <Button onClick={() => setDebugMode(false)}>
        Preview Mode
        <OnSwitch sx={{ height: 20, width: 40, ml: 1.25 }} />
      </Button>
    </Container>
  );
};
