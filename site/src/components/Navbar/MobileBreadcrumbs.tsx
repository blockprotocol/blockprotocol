import { VFC } from "react";
import { Typography, Breadcrumbs } from "@mui/material";
import { useRouter } from "next/router";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
import { Link } from "../Link";
import { itemIsPage } from "./util";
import { FontAwesomeSvgIcon } from "../icons";

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
      separator={<FontAwesomeSvgIcon icon={faChevronRight} />}
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
