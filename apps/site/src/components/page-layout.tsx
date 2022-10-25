import { Box } from "@mui/material";
import { useRouter } from "next/router.js";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";

import { Footer } from "./footer.js";
import { BANNERS, FooterBanner } from "./footer-banner.js";
import { HiringBanner } from "./hiring-banner.js";
import { LoginModal } from "./modal/login-modal.js";
import { Navbar } from "./navbar.js";

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
