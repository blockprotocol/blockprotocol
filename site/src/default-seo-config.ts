import { NextSeoProps } from "next-seo";

export const defaultSeoConfig: NextSeoProps = {
  title: "Block Protocol – an open standard for data-driven blocks",
  description:
    "A standardized way to create blocks whose contents are mapped to schemas, which are both human and machine-readable.",

  twitter: {
    cardType: "summary_large_image",
    site: "@blockprotocol",
  },
  openGraph: {
    title: "Block Protocol",
    description: "An open standard for data-driven blocks",
    images: [{ url: "https://blockprotocol.org/assets/bp_og_cover.png" }],
    site_name: "Block Protocol",
    type: "website",
  },
};
