import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumbs, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { Crumb } from "../hooks/use-crumbs";
import { FontAwesomeIcon } from "../icons";
import { Link } from "../link";
import { itemIsPage } from "./util";

type MobileBreadcrumbsProps = {
  hydrationFriendlyAsPath: string;
  crumbs: Crumb[];
};

export const MobileBreadcrumbs: FunctionComponent<MobileBreadcrumbsProps> = ({
  hydrationFriendlyAsPath,
  crumbs,
}) => {
  return (
    <Breadcrumbs
      sx={{ marginTop: 2 }}
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
                ? hydrationFriendlyAsPath.startsWith(`${item.href}#`)
                  ? "#"
                  : item.href
                : `#${item.anchor}`
            }
            whiteSpace="normal"
          >
            {item.title}
          </Link>
        ) : (
          <Typography
            key={item.title}
            variant="bpSmallCopy"
            color="inherit"
            whiteSpace="normal"
          >
            {item.title}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
};
