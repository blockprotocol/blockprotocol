import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { Footer } from "./Footer";
import { BANNERS, FooterBanner } from "./FooterBanner";
import { HiringBanner } from "./HiringBanner";
import { LoginModal } from "./Modal/LoginModal";
import { DESKTOP_NAVBAR_HEIGHT, Navbar } from "./Navbar";

type PageLayoutProps = {};

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { asPath, pathname } = useRouter();

  const [navbarHeight, setNavbarHeight] = useState<number>(
    DESKTOP_NAVBAR_HEIGHT,
  );
  const [displayLoginModal, setDisplayLoginModal] = useState<boolean>(false);

  const isHomePage = asPath === "/";

  const banner = useMemo(
    () => BANNERS.find(({ shouldDisplay }) => shouldDisplay({ pathname })),
    [pathname],
  );

  return (
    <>
      <LoginModal
        open={displayLoginModal}
        onClose={() => setDisplayLoginModal(false)}
      />
      <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
        <Navbar
          navbarHeight={navbarHeight}
          setNavbarHeight={setNavbarHeight}
          openLoginModal={() => setDisplayLoginModal(true)}
        />
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
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
        <HiringBanner />
      </Box>
    </>
  );
};
