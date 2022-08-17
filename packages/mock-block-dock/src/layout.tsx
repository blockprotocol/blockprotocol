import {
  Box,
  createTheme,
  CssBaseline,
  styled,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { palette } from "@mui/system";
import { ReactNode } from "react";

const theme = createTheme();

type LayoutProps = {
  children: ReactNode;
};

export const SIDEBAR_WIDTH = 250;

const HeaderContainer = styled(Box)(({ theme }) => ({
  height: 50,
  position: "sticky",
  top: 0,
  zIndex: 5,
  backgroundColor: theme.palette.common.white,
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  // @todo:  confirm if box shadow is needed
  boxShadow: theme.shadows[1],
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  background: theme.palette.grey[100],
}));

export const MainContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowY: "scroll",
  position: "relative",
}));

export const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex">
        <SidebarContainer>
          <Typography mt={4} pl={2}>
            Mock Block Dock
          </Typography>
        </SidebarContainer>
        <MainContainer component="main">
          <HeaderContainer>Header</HeaderContainer>
          <Box flex={1}>{children}</Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};
