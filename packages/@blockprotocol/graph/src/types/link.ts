export type Link = {
  linkId: string;
  sourceEntityId: string;
  destinationEntityId: string;
  index?: number | null;
  path: string;
};

export type LinkGroup = {
  sourceEntityId: string;
  path: string;
  links: Link[];
};

export type GetLinkData = {
  linkId: string;
};

export type CreateLinkData = Omit<Link, "linkId">;

export type UpdateLinkData = {
  linkId: string;
  data: Pick<Link, "index">;
};

export type DeleteLinkData = {
  linkId: string;
};
