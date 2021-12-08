import { FC } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { DESKTOP_NAVBAR_HEIGHT, MOBILE_NAVBAR_HEIGHT, Navbar } from "./Navbar";
import { Footer } from "./Footer";

type PageLayoutProps = {};

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { asPath } = useRouter();

  const isHomePage = asPath === "/";

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
      <Navbar />
      <Box
        flexGrow={1}
        sx={{
          paddingTop: isHomePage
            ? {}
            : {
                xs: `${MOBILE_NAVBAR_HEIGHT}px`,
                md: `${DESKTOP_NAVBAR_HEIGHT}px`,
              },
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
