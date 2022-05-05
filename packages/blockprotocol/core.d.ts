// ---------------------------- UTILITIES ----------------------------- //

type UnknownRecord = Record<string, unknown>;

export type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | JSONObject;

export type JSONObject = { [key: string]: JSONValue };

export interface JSONArray extends Array<JSONValue> {}

// -------------------------- BLOCK METADATA -------------------------- //

export type BlockVariant = {
  description?: string | null;
  icon?: string | null;
  name: string;
  /**
   * @deprecated - Use the `name` field instead.
   */
  displayName?: string;
  properties: JSONObject;
  examples?: JSONObject[] | null;
};

export type BlockMetadataRepository =
  | {
      type: string;
      url: string;
      directory?: string;
    }
  | string;

export type BlockMetadata = {
  /**
   * The name of the author of the block
   */
  author?: string | null;
  /**
   * The default data used as the block's properties on first load - must comply with its schema
   */
  default?: JSONObject | null;
  /**
   * A short description of the block, to help users understand its capabilities
   */
  description?: string | null;
  /**
   * The display name used for a block
   */
  displayName?: string | null;
  /**
   * A list of examples used to showcase a block's capabilities
   */
  examples?: JSONObject[] | null;
  /**
   * The dependencies a block relies on but expects the embedding application to provide, e.g. { "react": "^17.0.2" }
   */
  externals?: JSONObject;
  /**
   * An icon for the block, to be displayed when the user is selecting from available blocks (as well as elsewhere as appropriate, e.g. in a website listing the block).
   */
  icon?: string | null;
  /**
   * A preview image of the block for users to see it in action before using it. This would ideally have a 3:2 width:height ratio and be a minimum of 900x1170px.
   */
  image?: string | null;
  /**
   * The license the block is made available under (e.g. MIT).
   */
  license?: string | null;
  /**
   * A unique, slugified name for the block.
   */
  name: string;
  /**
   * The applicable block protocol version.
   */
  protocol: string;
  /**
   * Specify the place where your block's code lives. This is helpful for people who want to explore the source, or contribute to your block's development.
   */
  repository?: BlockMetadataRepository | null;
  /**
   * The path or URL to the block's schema (e.g. block-schema.json)
   */
  schema: string;
  /**
   * The path or URL to the entrypoint source file (e.g. index.html, index.js).
   */
  source: string;
  /**
   * A list which represents different variants of the block that the user can create.
   */
  variants?: BlockVariant[] | null;
  /**
   * The version of the block, which should use semantic versioning (@see https://semver.org/).
   */
  version: string;
};

// ----------------------------- ENTITIES ----------------------------- //

export type BlockProtocolEntity = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
  [key: string]: unknown;
};

export type BlockProtocolCreateEntitiesAction = {
  entityTypeId: string;
  entityTypeVersionId?: string | null;
  data: UnknownRecord;
  accountId?: string | null;
  links?: Omit<
    BlockProtocolCreateLinksAction,
    "sourceAccountId" | "sourceEntityId" | "sourceEntityTypeId"
  >[];
};

export type BlockProtocolCreateEntitiesFunction = {
  (actions: BlockProtocolCreateEntitiesAction[]): Promise<
    BlockProtocolEntity[]
  >;
};

export type BlockProtocolGetEntitiesAction = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
};

export type BlockProtocolGetEntitiesFunction = {
  (actions: BlockProtocolGetEntitiesAction[]): Promise<BlockProtocolEntity[]>;
};

export type BlockProtocolUpdateEntitiesAction = {
  entityTypeId?: string | null;
  entityTypeVersionId?: string | null;
  entityId: string;
  accountId?: string | null;
  data: UnknownRecord;
};

export type BlockProtocolUpdateEntitiesFunction = {
  (actions: BlockProtocolUpdateEntitiesAction[]): Promise<
    BlockProtocolEntity[]
  >;
};

export type BlockProtocolDeleteEntitiesAction = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
};

export type BlockProtocolDeleteEntitiesFunction = {
  (actions: BlockProtocolDeleteEntitiesAction[]): Promise<boolean[]>;
};

export type BlockProtocolFilterOperatorType =
  | "CONTAINS"
  | "DOES_NOT_CONTAIN"
  | "IS"
  | "IS_NOT"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "IS_EMPTY"
  | "IS_NOT_EMPTY";

export type BlockProtocolMultiFilterOperatorType = "AND" | "OR";

export type BlockProtocolMultiFilter = {
  filters: {
    field: string;
    operator: BlockProtocolFilterOperatorType;
    value: string;
  }[];
  operator: BlockProtocolMultiFilterOperatorType;
};

export type BlockProtocolMultiSort = {
  field: string;
  desc?: boolean | undefined | null;
}[];

export type BlockProtocolAggregateOperationInput = {
  entityTypeId?: string | null;
  entityTypeVersionId?: string | null;
  pageNumber?: number | null;
  itemsPerPage?: number | null;
  multiSort?: BlockProtocolMultiSort | null;
  multiFilter?: BlockProtocolMultiFilter | null;
};

export type BlockProtocolAggregateEntitiesPayload = {
  operation: BlockProtocolAggregateOperationInput;
  accountId?: string | null;
};

export type BlockProtocolAggregateEntitiesResult<
  T extends BlockProtocolEntity | BlockProtocolEntityType,
> = {
  results: T[];
  operation: BlockProtocolAggregateOperationInput &
    Required<
      Pick<BlockProtocolAggregateOperationInput, "pageNumber" | "itemsPerPage">
    > & {
      pageCount?: number | null;
      totalCount?: number | null;
    };
};

export type BlockProtocolAggregateEntitiesFunction = {
  (payload: BlockProtocolAggregateEntitiesPayload): Promise<
    BlockProtocolAggregateEntitiesResult<BlockProtocolEntity>
  >;
};

// ------------------------ OTHER FUNCTIONS --------------------------- //

export type BlockProtocolFileMediaType = "image" | "video";

export type BlockProtocolUploadFileFunction = {
  (action: {
    accountId?: string | null;
    file?: File | null;
    url?: string | null;
    mediaType: BlockProtocolFileMediaType;
  }): Promise<{
    accountId?: string | null;
    entityId: string;
    url: string;
    mediaType: BlockProtocolFileMediaType;
  }>;
};

// ----------------------------- LINKS -------------------------------- //

export type BlockProtocolLink = {
  linkId: string;
  sourceAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityTypeId?: string | null;
  destinationAccountId?: string | null;
  destinationEntityId: string;
  destinationEntityTypeId?: string | null;
  index?: number | null;
  path: string;
};

export type BlockProtocolLinkGroup = {
  sourceAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityTypeId?: string | null;
  path: string;
  links: BlockProtocolLink[];
};

export type BlockProtocolGetLinkAction = {
  linkId: string;
};

export type BlockProtocolGetLinksFunction = {
  (actions: BlockProtocolGetLinkAction[]): Promise<BlockProtocolLink[]>;
};

export type BlockProtocolCreateLinksAction = Omit<BlockProtocolLink, "linkId">;

export type BlockProtocolCreateLinksFunction = {
  (actions: BlockProtocolCreateLinksAction[]): Promise<BlockProtocolLink[]>;
};

export type BlockProtocolUpdateLinksAction = {
  sourceAccountId?: string | null;
  linkId: string;
  data: Pick<BlockProtocolLink, "index">;
};

export type BlockProtocolUpdateLinksFunction = {
  (actions: BlockProtocolUpdateLinksAction[]): Promise<BlockProtocolLink[]>;
};

export type BlockProtocolDeleteLinksAction = {
  sourceAccountId?: string | null;
  linkId: string;
};

export type BlockProtocolDeleteLinksFunction = {
  (actions: BlockProtocolDeleteLinksAction[]): Promise<boolean[]>;
};

// ---------------------- LINKED AGGREGATIONS ------------------------- //

export type BlockProtocolLinkedAggregationDefinition = {
  aggregationId: string;
  sourceAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityTypeId?: string | null;
  path: string;
  operation: BlockProtocolAggregateOperationInput;
};

export type BlockProtocolLinkedAggregation = Omit<
  BlockProtocolLinkedAggregationDefinition,
  "operation"
> &
  BlockProtocolAggregateEntitiesResult<BlockProtocolEntity>;

export type BlockProtocolGetLinkedAggregationAction = {
  sourceAccountId?: string | null;
  aggregationId: string;
};

export type BlockProtocolGetLinkedAggregationsFunction = {
  (actions: BlockProtocolGetLinkedAggregationAction[]): Promise<
    BlockProtocolLinkedAggregation[]
  >;
};

export type BlockProtocolCreateLinkedAggregationAction = Omit<
  BlockProtocolLinkedAggregationDefinition,
  "aggregationId"
>;

export type BlockProtocolCreateLinkedAggregationsFunction = {
  (actions: BlockProtocolCreateLinkedAggregationAction[]): Promise<
    BlockProtocolLinkedAggregationDefinition[]
  >;
};

export type BlockProtocolUpdateLinkedAggregationActionFragment = {
  sourceAccountId?: string | null;
  aggregationId: string;
};

export type BlockProtocolUpdateLinkedAggregationAction = {
  sourceAccountId?: string | null;
  aggregationId: string;
  data: BlockProtocolLinkedAggregationDefinition["operation"];
};

export type BlockProtocolUpdateLinkedAggregationsFunction = {
  (actions: BlockProtocolUpdateLinkedAggregationAction[]): Promise<
    BlockProtocolLinkedAggregationDefinition[]
  >;
};

export type BlockProtocolDeleteLinkedAggregationAction = {
  sourceAccountId?: string | null;
  aggregationId: string;
};

export type BlockProtocolDeleteLinkedAggregationsFunction = {
  (actions: BlockProtocolDeleteLinkedAggregationAction[]): Promise<boolean[]>;
};

// ------------------------- ENTITY TYPES ----------------------------- //

export type BlockProtocolEntityType = {
  accountId?: string | null;
  entityTypeId: string; // @todo consider removing this and just using $id, the URI
  $id: string;
  $schema: string;
  title: string;
  type: string;
  [key: string]: unknown;
};

type BlockProtocolCreateEntityTypesAction = {
  accountId?: string | null;
  schema: JSONObject; // @todo should this be an Omit<BlockProtocolEntityType, "entityTypeId" | "$id">?
};

export type BlockProtocolCreateEntityTypesFunction = {
  (actions: BlockProtocolCreateEntityTypesAction[]): Promise<
    BlockProtocolEntityType[]
  >;
};

export type BlockProtocolAggregateEntityTypesPayload = {
  accountId?: string | null;
  // @todo mention in spec or remove
  // include entities that are used by, but don't belong to, the specified account
  includeOtherTypesInUse?: boolean | null;
  operation?: Omit<
    BlockProtocolAggregateOperationInput,
    "entityTypeId" | "entityTypeVersionId"
  > | null;
};

export type BlockProtocolAggregateEntityTypesFunction = {
  (payload: BlockProtocolAggregateEntityTypesPayload): Promise<
    BlockProtocolAggregateEntitiesResult<BlockProtocolEntityType>
  >;
};

type BlockProtocolGetEntityTypesAction = {
  accountId?: string | null;
  entityTypeId: string;
};

export type BlockProtocolGetEntityTypesFunction = {
  (actions: BlockProtocolGetEntityTypesAction[]): Promise<
    BlockProtocolEntityType[]
  >;
};

type BlockProtocolUpdateEntityTypesAction = {
  accountId?: string | null;
  entityTypeId: string;
  schema: JSONObject;
};

export type BlockProtocolUpdateEntityTypesFunction = {
  (actions: BlockProtocolUpdateEntityTypesAction[]): Promise<
    BlockProtocolEntityType[]
  >;
};

type BlockProtocolDeleteEntityTypesAction = {
  accountId?: string | null;
  entityTypeId: string;
};

export type BlockProtocolDeleteEntityTypesFunction = {
  (actions: BlockProtocolDeleteEntityTypesAction[]): Promise<boolean[]>;
};

// ------------------------- GENERAL / SUMMARY ----------------------------- //

export type BlockProtocolFunction =
  | BlockProtocolAggregateEntitiesFunction
  | BlockProtocolAggregateEntityTypesFunction
  | BlockProtocolCreateEntitiesFunction
  | BlockProtocolCreateEntityTypesFunction
  | BlockProtocolCreateLinksFunction
  | BlockProtocolCreateLinkedAggregationsFunction
  | BlockProtocolGetEntitiesFunction
  | BlockProtocolGetEntityTypesFunction
  | BlockProtocolGetLinksFunction
  | BlockProtocolGetLinkedAggregationsFunction
  | BlockProtocolDeleteEntitiesFunction
  | BlockProtocolDeleteEntityTypesFunction
  | BlockProtocolDeleteLinksFunction
  | BlockProtocolDeleteLinkedAggregationsFunction
  | BlockProtocolUpdateEntitiesFunction
  | BlockProtocolUpdateEntityTypesFunction
  | BlockProtocolUpdateLinksFunction
  | BlockProtocolUpdateLinkedAggregationsFunction
  | BlockProtocolUploadFileFunction;

export type BlockProtocolFunctions = {
  aggregateEntities?: BlockProtocolAggregateEntitiesFunction | undefined;
  createEntities?: BlockProtocolCreateEntitiesFunction | undefined;
  getEntities?: BlockProtocolGetEntitiesFunction | undefined;
  deleteEntities?: BlockProtocolDeleteEntitiesFunction | undefined;
  updateEntities?: BlockProtocolUpdateEntitiesFunction | undefined;

  aggregateEntityTypes?: BlockProtocolAggregateEntityTypesFunction | undefined;
  createEntityTypes?: BlockProtocolCreateEntityTypesFunction | undefined;
  getEntityTypes?: BlockProtocolGetEntityTypesFunction | undefined;
  updateEntityTypes?: BlockProtocolUpdateEntityTypesFunction | undefined;
  deleteEntityTypes?: BlockProtocolDeleteEntityTypesFunction | undefined;

  getLinks?: BlockProtocolGetLinksFunction | undefined;
  createLinks?: BlockProtocolCreateLinksFunction | undefined;
  deleteLinks?: BlockProtocolDeleteLinksFunction | undefined;
  updateLinks?: BlockProtocolUpdateLinksFunction | undefined;

  getLinkedAggregations?:
    | BlockProtocolGetLinkedAggregationsFunction
    | undefined;
  createLinkedAggregations?:
    | BlockProtocolCreateLinkedAggregationsFunction
    | undefined;
  deleteLinkedAggregations?:
    | BlockProtocolDeleteLinkedAggregationsFunction
    | undefined;
  updateLinkedAggregations?:
    | BlockProtocolUpdateLinkedAggregationsFunction
    | undefined;

  uploadFile?: BlockProtocolUploadFileFunction | undefined;
};

/**
 * Block Protocol-specified properties,
 * which the embedding application should provide.
 */
export type BlockProtocolProps = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
  entityTypeVersionId?: string | null;
  entityTypes?: BlockProtocolEntityType[];
  linkedAggregations?: BlockProtocolLinkedAggregation[];
  linkedEntities?: BlockProtocolEntity[];
  linkGroups?: BlockProtocolLinkGroup[];
} & BlockProtocolFunctions;
