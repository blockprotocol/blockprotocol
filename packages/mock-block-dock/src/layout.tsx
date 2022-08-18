import { DarkMode, LightMode } from "@mui/icons-material";
import {
  Box,
  createTheme,
  CssBaseline,
  Drawer,
  IconButton,
  styled,
  Switch,
  ThemeProvider,
  Typography
} from "@mui/material";
import { ReactNode, useState } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const SIDEBAR_WIDTH = 250;

const HeaderContainer = styled(Box)(({ theme }) => ({
  height: 50,
  position: "sticky",
  top: 0,
  zIndex: 5,
  backgroundColor: theme.palette.background.default,
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

export const MainContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowY: "scroll",
  position: "relative",
  marginLeft: SIDEBAR_WIDTH
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

const lightTheme = createTheme({
  palette: {
    mode: "light"
  }
});

export const Layout = ({ children }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={!darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box height="100vh" display="flex">
        <Drawer
          variant="persistent"
          open
          PaperProps={{
            sx: {
              width: SIDEBAR_WIDTH
            }
          }}
        >
          <Typography mt={4} pl={2}>
            Mock Block Dock
          </Typography>
        </Drawer>
        <MainContainer component="main">
          <HeaderContainer>
            <IconButton onClick={() => setDarkMode(prev => !prev)}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            {/* zoom */}
          </HeaderContainer>
          <Box flex={1}>{children}</Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};
