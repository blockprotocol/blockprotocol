import { ReactElement } from "react";
import {
  CommentDotsIcon,
  ContentfulIcon,
  GithubIcon,
  SanityIcon,
  StrapiIcon,
} from "../../../icons";

export enum ApplicationIds {
  Sanity = "ECO_SANITY",
  Strapi = "ECO_STRAPI",
  Contentful = "ECO_CONFUL",
  Github = "ECO_GITHUB",
  Other = "ECO_OTHER",
}

export interface Application {
  id: ApplicationIds;
  name: string;
  icon: ReactElement;
  twitterHref?: string;
}

const otherApplication = {
  id: ApplicationIds.Other,
  name: "Other",
  icon: <CommentDotsIcon />,
  twitterHref:
    "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20developing%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20What%20app%20would%20you%20like%20to%20see%20support%20in%20next%3F%20blockprotocol.org%2Fwordpress",
};

export const applications: Application[] = [
  {
    id: ApplicationIds.Sanity,
    name: "Sanity",
    icon: <SanityIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40sanity_io%20support%20next%20at%20blockprotocol.org%2Fwordpress",
  },
  {
    id: ApplicationIds.Strapi,
    name: "Strapi",
    icon: <StrapiIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40strapijs%20support%20next%20at%20blockprotocol.org%2Fwordpress",
  },
  {
    id: ApplicationIds.Contentful,
    name: "Contentful",
    icon: <ContentfulIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40contentful%20support%20next%20at%20blockprotocol.org%2Fwordpress",
  },
  {
    id: ApplicationIds.Github,
    name: "GitHub",
    icon: <GithubIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20Join%20me%20in%20voting%20for%20%40GitHubNext%20support%20at%20blockprotocol.org%2Fwordpress",
  },
  otherApplication,
];
