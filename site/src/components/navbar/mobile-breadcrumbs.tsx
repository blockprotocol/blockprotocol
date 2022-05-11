import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { VFC } from "react";

import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
import { FontAwesomeIcon } from "../icons";
import { Link } from "../link";
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
        <FontAwesomeIcon
          sx={{ fontSize: 14, color: ({ palette }) => palette.gray[40] }}
          icon={faChevronRight}
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
