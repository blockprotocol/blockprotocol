import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FC, ReactNode, useMemo, useState } from "react";

import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
import { HiringBanner } from "./hiring-banner";
import { LoginModal } from "./modal/login-modal";
import { Navbar } from "./navbar";

type PageLayoutProps = {
  children?: ReactNode;
};

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  const { pathname } = useRouter();

  const [displayLoginModal, setDisplayLoginModal] = useState(false);

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
        <Navbar openLoginModal={() => setDisplayLoginModal(true)} />
        <Box flexGrow={1} display="flex" flexDirection="column">
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
