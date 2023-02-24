import { BlockMetadata } from "@blockprotocol/core";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";

import { useUser } from "../context/user-context";
import { ComingSoonBanner } from "./coming-soon-banner";
import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
import { LoginModal } from "./modal/login-modal";
import { Navbar } from "./navbar";
import {
  generatePathWithoutParams,
  useHydrationFriendlyAsPath,
} from "./shared";

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

  const hydrationFriendlyAsPath = useHydrationFriendlyAsPath();
  const pathWithoutParams = generatePathWithoutParams(hydrationFriendlyAsPath);
  const showBanner =
    !pathWithoutParams.startsWith("/wordpress") &&
    !pathWithoutParams.startsWith("/signup");

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
        <Navbar
          openLoginModal={() => setDisplayLoginModal(true)}
          blockMetadata={blockMetadata}
        />
        {showBanner ? <ComingSoonBanner /> : null}
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
