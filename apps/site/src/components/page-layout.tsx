import { BlockMetadata } from "@blockprotocol/core";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useMemo } from "react";

import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
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

  const banner = useMemo(
    () => BANNERS.find(({ shouldDisplay }) => shouldDisplay({ pathname, asPath })),
    [pathname, asPath],
  );

  return (
    <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
      <NavbarContainer blockMetadata={blockMetadata}>{children}</NavbarContainer>
      {banner ? <FooterBanner banner={banner} /> : null}
      <Footer
        sx={{
          paddingTop: banner?.overlapsFooter ? 8 : 0,
        }}
      />
    </Box>
  );
};
