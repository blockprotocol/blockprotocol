import { FC } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type PageLayoutProps = {};

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { asPath } = useRouter();

  const isHomePage = asPath === "/";

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
      <Navbar />
      <Box flexGrow={1} pt={isHomePage ? 0 : 8}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
