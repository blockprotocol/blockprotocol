import { Breadcrumbs, Container, Typography, Icon } from "@mui/material";
import { NextPage } from "next";
import React from "react";

import { Link, LinkProps } from "../../components/Link";

const ChevronRight: React.VFC = () => (
  <Icon sx={{ fontSize: "0.8rem" }} className="fas fa-chevron-right" />
);

const BreadcrumbLink: React.FC<LinkProps> = ({ children, ...props }) => (
  <Link style={{ textDecoration: "none" }} {...props}>
    <Typography variant="bpSmallCopy">{children}</Typography>
  </Link>
);

const Block: NextPage = () => {
  const name = "Video";
  const slug = "video";

  return (
    <Container>
      <Breadcrumbs separator={<ChevronRight />}>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbLink href="/hub">Block Hub</BreadcrumbLink>
        <BreadcrumbLink href={`/hub/${slug}`}>{name}</BreadcrumbLink>
      </Breadcrumbs>
      <Typography variant="bpHeading1" mt={4}>
        <img
          style={{ display: "inline-block" }}
          alt="icon"
          src="/blocks/@hash/video/public/play-box-outline.svg"
        />{" "}
        {name}
      </Typography>
    </Container>
  );
};

export default Block;
