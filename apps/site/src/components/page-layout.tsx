import { BlockMetadata } from "@blockprotocol/core";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";

import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
import { LoginModal } from "./modal/login-modal";
import { Navbar } from "./navbar";

type PageLayoutProps = {
  blockMetadata?: BlockMetadata;
  children?: ReactNode;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
  blockMetadata,
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
        <Navbar
          openLoginModal={() => setDisplayLoginModal(true)}
          blockMetadata={blockMetadata}
        />
        <Box flexGrow={1} display="flex" flexDirection="column">
          {children}
        </Box>
        {banner ? <FooterBanner banner={banner} /> : null}
        <Footer
          sx={{
            paddingTop: banner?.overlapsFooter ? 8 : 0,
          }}
        />
      </Box>
    </>
  );
};
