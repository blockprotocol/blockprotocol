import localBlocks from "../../../blocks-data.json";
import { ExpandedBlockMetadata } from "../blocks";

export const getAllBlocks = (): ExpandedBlockMetadata[] => {
  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return localBlocks as ExpandedBlockMetadata[];
};

export const getAllBlocksByUser = (params: {
  shortname: string;
}): ExpandedBlockMetadata[] => {
  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return localBlocks.filter(
    ({ author }) => author === params.shortname,
  ) as ExpandedBlockMetadata[];
};

export const getBlockByUserAndName = (params: {
  name: string;
  shortname: string;
}): ExpandedBlockMetadata | null => {
  const { name, shortname } = params;
  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return (localBlocks.filter(
    ({ pathWithNamespace }) => pathWithNamespace === `@${shortname}/${name}`,
  )?.[0] ?? null) as ExpandedBlockMetadata | null;
};
