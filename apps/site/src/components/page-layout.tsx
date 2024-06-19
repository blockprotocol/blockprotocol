import { BlockMetadata } from "@blockprotocol/core";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";

import { useUser } from "../context/user-context";
import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
import { LoginModal } from "./modal/login-modal";
import { NavbarContainer } from "./navbar";

type PageLayoutProps = {
  blockMetadata?: BlockMetadata;
  children?: ReactNode;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
  blockMetadata,
  children,
}) => {
  const { pathname, asPath } = useRouter();
  const { user } = useUser();

  const [displayLoginModal, setDisplayLoginModal] = useState(false);

  const signedIn = user === "loading" || user?.id;

  const banner = useMemo(
    () =>
      BANNERS.find(
        ({ shouldDisplay, hideWhenSignedIn }) =>
          shouldDisplay({ pathname, asPath }) &&
          !(hideWhenSignedIn && signedIn),
      ),
    [pathname, asPath, signedIn],
  );

  return (
    <>
      <LoginModal
        open={displayLoginModal}
        onClose={() => setDisplayLoginModal(false)}
      />
      <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
        <NavbarContainer
          openLoginModal={() => setDisplayLoginModal(true)}
          blockMetadata={blockMetadata}
        >
          {children}
        </NavbarContainer>
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
