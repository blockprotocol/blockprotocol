import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useMemo, useState } from "react";

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
  children?: ReactNode;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
  children,
}) => {
  const { pathname, asPath } = useRouter();

  const [displayLoginModal, setDisplayLoginModal] = useState(false);

  const hydrationFriendlyAsPath = useHydrationFriendlyAsPath();
  const isWordPressPage = generatePathWithoutParams(
    hydrationFriendlyAsPath,
  ).startsWith("/wordpress");

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
        {!isWordPressPage ? <ComingSoonBanner /> : null}
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
