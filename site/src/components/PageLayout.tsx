import { FC, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { DESKTOP_NAVBAR_HEIGHT, Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BANNERS, FooterBanner } from "./FooterBanner";

type PageLayoutProps = {};

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { asPath, pathname } = useRouter();

  const [navbarHeight, setNavbarHeight] = useState<number>(
    DESKTOP_NAVBAR_HEIGHT,
  );

  const isHomePage = asPath === "/";

  const banner = useMemo(
    () => BANNERS.find(({ shouldDisplay }) => shouldDisplay({ pathname })),
    [pathname],
  );

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
      <Navbar navbarHeight={navbarHeight} setNavbarHeight={setNavbarHeight} />
      <Box
        flexGrow={1}
        sx={{
          paddingTop: isHomePage ? {} : `${navbarHeight}px`,
        }}
      >
        {children}
      </Box>
      {banner ? <FooterBanner banner={banner} /> : null}
      <Footer
        sx={{
          paddingTop: banner?.overlapsFooter ? 8 : 0,
        }}
      />
    </Box>
  );
};
