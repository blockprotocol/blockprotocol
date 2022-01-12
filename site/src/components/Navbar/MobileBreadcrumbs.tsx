import { VFC } from "react";
import { Typography, Icon, Breadcrumbs } from "@mui/material";
import { useRouter } from "next/router";
import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
import { Link } from "../Link";
import { itemIsPage } from "./util";

type MobileBreadcrumbsProps = {
  crumbs: (SiteMapPage | SiteMapPageSection)[];
};

export const MobileBreadcrumbs: VFC<MobileBreadcrumbsProps> = ({ crumbs }) => {
  const { asPath } = useRouter();

  return (
    <Breadcrumbs
      sx={{
        marginTop: 2,
      }}
      separator={
        <Icon
          sx={{ fontSize: 14, color: ({ palette }) => palette.gray[40] }}
          className="fas fa-chevron-right"
        />
      }
    >
      {crumbs.map((item, i) =>
        i < crumbs.length - 1 ? (
          <Link
            key={item.title}
            href={
              itemIsPage(item)
                ? asPath.startsWith(`${item.href}#`)
                  ? "#"
                  : item.href
                : `#${item.anchor}`
            }
          >
            {item.title}
          </Link>
        ) : (
          <Typography key={item.title} variant="bpSmallCopy" color="inherit">
            {item.title}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
};
