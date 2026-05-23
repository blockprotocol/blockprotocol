import { BlockMetadata } from "@blockprotocol/core";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FunctionComponent, ReactNode, useMemo } from "react";

import { Footer } from "./footer";
import { BANNERS, FooterBanner } from "./footer-banner";
import { NavbarContainer } from "./navbar";
import { TopBanner } from "./top-banner";

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
    () =>
      BANNERS.find(({ shouldDisplay }) => shouldDisplay({ pathname, asPath })),
    [pathname, asPath],
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={(theme) => ({
        minHeight: "100vh",
        "--banner-height": "115px",
        [theme.breakpoints.up("sm")]: {
          "--banner-height": "86px",
        },
        [theme.breakpoints.up("md")]: {
          "--banner-height": "72px",
        },
      })}
    >
      <TopBanner />
      <NavbarContainer blockMetadata={blockMetadata}>
        {children}
      </NavbarContainer>
      {banner ? <FooterBanner banner={banner} /> : null}
      <Footer
        sx={{
          paddingTop: banner?.overlapsFooter ? 8 : 0,
        }}
      />
    </Box>
  );
};
