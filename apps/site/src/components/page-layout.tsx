import { Box } from "@mui/material";
import { useRouter } from "next/router.js";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";

import { Footer } from "./footer.jsx";
import { BANNERS, FooterBanner } from "./footer-banner.jsx";
import { HiringBanner } from "./hiring-banner.jsx";
import { LoginModal } from "./modal/login-modal.jsx";
import { Navbar } from "./navbar.jsx";

type PageLayoutProps = {
  children?: ReactNode;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
  children,
}) => {
  const { pathname, asPath } = useRouter();

  const [displayLoginModal, setDisplayLoginModal] = useState(false);

  const banner = useMemo(
    () =>
      BANNERS.find(({ shouldDisplay }) => shouldDisplay({ pathname, asPath })),
    [pathname, asPath],
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
