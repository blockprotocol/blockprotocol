import { ReactElement } from "react";

import {
  CommentDotsIcon,
  ContentfulIcon,
  SanityIcon,
  StrapiIcon,
} from "../../../icons";
import { DrupalIcon } from "../../../icons/drupal-icon";

export type ApplicationId =
  | "ECO_SANITY"
  | "ECO_STRAPI"
  | "ECO_CONFUL"
  | "ECO_DRUPAL"
  | "ECO_OTHER";
export interface Application {
  id: ApplicationId;
  name: string;
  icon: ReactElement;
  twitterHref?: string;
}

export const applications: Record<ApplicationId, Application> = {
  ECO_SANITY: {
    id: "ECO_SANITY",
    name: "Sanity",
    icon: <SanityIcon />,
    twitterHref:
      "https://x.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40sanity_io%20support%20next%20at%20blockprotocol.org%2Fwordpress",
  },
  ECO_STRAPI: {
    id: "ECO_STRAPI",
    name: "Strapi",
    icon: <StrapiIcon />,
    twitterHref:
      "https://x.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40strapijs%20support%20next%20at%20blockprotocol.org%2Fwordpress",
  },
  ECO_CONFUL: {
    id: "ECO_CONFUL",
    name: "Contentful",
    icon: <ContentfulIcon />,
    twitterHref:
      "https://x.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40contentful%20support%20next%20at%20blockprotocol.org%2Fwordpress",
  },
  ECO_DRUPAL: {
    id: "ECO_DRUPAL",
    name: "Drupal",
    icon: <DrupalIcon />,
    twitterHref:
      "https://x.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20Join%20me%20in%20voting%20for%20%40GitHubNext%20support%20at%20blockprotocol.org%2Fwordpress",
  },
  ECO_OTHER: {
    id: "ECO_OTHER",
    name: "Other",
    icon: <CommentDotsIcon />,
    twitterHref:
      "https://x.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20developing%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20What%20app%20would%20you%20like%20to%20see%20support%20in%20next%3F%20blockprotocol.org%2Fwordpress",
  },
};
