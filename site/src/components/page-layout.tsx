import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
import { HiringBanner } from "./hiring-banner";
import { LoginModal } from "./modal/login-modal";
import { DESKTOP_NAVBAR_HEIGHT, Navbar } from "./navbar";

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
