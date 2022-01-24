// ---------------------------- UTILITIES ----------------------------- //

type DistributedOmit<T, K extends PropertyKey> = T extends T
  ? Omit<T, K>
  : never;

// -------------------------- BLOCK METADATA -------------------------- //

export type BlockVariant = {
  description?: string | null;
  displayName?: string | null;
  icon?: string | null;
  properties?: JSONObject | null;
};

export type BlockMetadata = {
  author?: string | null;
  default?: JSONObject | null;
  description?: string | null;
  displayName?: string | null;
  examples?: JSONObject[] | null;
  externals?: Record<string, string> | null;
  icon?: string | null;
  image?: string | null;
  license?: string | null;
  name?: string | null;
  protocol?: string | null;
  schema?: string | null;
  source?: string | null;
  variants?: BlockVariant[] | null;
  version?: string | null;
};

// ----------------------------- ENTITIES ----------------------------- //

export type BlockProtocolEntity = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
  [key: string]: JSONValue;
};

export type BlockProtocolCreateEntitiesAction<T> = {
  entityTypeId: string;
  entityTypeVersionId?: string | null;
  data: T;
  accountId?: string | null;
  links?: DistributedOmit<
    BlockProtocolCreateLinksAction,
    | "sourceAccountId"
    | "sourceEntityId"
    | "sourceEntityTypeId"
    | "sourceEntityVersionId"
  >[];
};

export type BlockProtocolCreateEntitiesFunction = {
  <T>(actions: BlockProtocolCreateEntitiesAction<T>[]): Promise<unknown[]>;
};

export type BlockProtocolGetEntitiesAction = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
};

export type BlockProtocolGetEntitiesFunction = {
  (actions: BlockProtocolGetEntitiesAction[]): Promise<unknown[]>;
};

export type BlockProtocolUpdateEntitiesAction<T> = {
  entityTypeId?: string | null;
  entityTypeVersionId?: string | null;
  entityId: string;
  accountId?: string | null;
  data: T;
};

export type BlockProtocolUpdateEntitiesFunction = {
  <T>(actions: BlockProtocolUpdateEntitiesAction<T>[]): Promise<unknown[]>;
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

export type BlockProtocolAggregateEntitiesResult<T = unknown> = {
  results: T[];
  operation: BlockProtocolAggregateOperationInput &
    Required<
      Pick<BlockProtocolAggregateOperationInput, "pageNumber" | "itemsPerPage">
    > & {
      pageCount: number;
      totalCount: number;
    };
};

export type BlockProtocolAggregateEntitiesFunction = {
  (
    payload: BlockProtocolAggregateEntitiesPayload,
  ): Promise<BlockProtocolAggregateEntitiesResult>;
};

// ------------------------ OTHER FUNCTIONS --------------------------- //

export type BlockProtocolFileMediaType = "image" | "video";

export type BlockProtocolUploadFileFunction = {
  (action: {
    accountId?: string;
    file?: File | null;
    url?: string | null;
    mediaType: BlockProtocolFileMediaType;
  }): Promise<{
    accountId?: string;
    entityId: string;
    url: string;
    mediaType: BlockProtocolFileMediaType;
  }>;
};

// ----------------------------- LINKS -------------------------------- //

type SingleTargetLinkFields = {
  destinationAccountId?: string | null;
  destinationEntityId: string;
  destinationEntityTypeId?: string | null;
  destinationEntityVersionId?: string | null;
};

type AggregationTargetLinkFields = {
  operation: BlockProtocolAggregateOperationInput;
};

export type BlockProtocolLink = {
  linkId: string;
  sourceAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityTypeId?: string | null;
  sourceEntityVersionId?: string | null;
  index?: number | null;
  path: string;
} & (SingleTargetLinkFields | AggregationTargetLinkFields);

export type BlockProtocolLinkGroup = {
  sourceAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityVersionId?: string | null;
  sourceEntityTypeId?: string | null;
  path: string;
  links: BlockProtocolLink[];
};

export type BlockProtocolLinkedAggregation = {
  sourceAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityVersionId?: string | null;
  sourceEntityTypeId?: string | null;
  path: string;
} & BlockProtocolAggregateEntitiesResult;

export type BlockProtocolGetLinkAction = {
  linkId: string;
};

export type BlockProtocolGetLinksFunction = {
  (actions: BlockProtocolGetLinkAction[]): Promise<BlockProtocolLink[]>;
};

export type BlockProtocolCreateLinksAction = DistributedOmit<
  BlockProtocolLink,
  "linkId"
>;

export type BlockProtocolCreateLinksFunction = {
  (actions: BlockProtocolCreateLinksAction[]): Promise<BlockProtocolLink[]>;
};

export type BlockProtocolUpdateLinkAction = {
  data: BlockProtocolLink;
  linkId: string;
};

export type BlockProtocolUpdateLinksFunction = {
  (actions: BlockProtocolUpdateLinkAction[]): Promise<BlockProtocolLink[]>;
};

export type BlockProtocolDeleteLinksAction = {
  linkId: string;
};

export type BlockProtocolDeleteLinksFunction = {
  (actions: BlockProtocolDeleteLinksAction[]): Promise<boolean[]>;
};

// ------------------------- ENTITY TYPES ----------------------------- //

export type BlockProtocolEntityType = {
  accountId?: string | null;
  entityTypeId: string;
  $id: string;
  $schema: string;
  title: string;
  type: string;
  [key: string]: JSONValue;
};

type BlockProtocolCreateEntityTypesAction = {
  accountId?: string | null;
  schema: JSONObject;
};

export type BlockProtocolCreateEntityTypesFunction = {
  (actions: BlockProtocolCreateEntityTypesAction[]): Promise<
    BlockProtocolEntityType[]
  >;
};

export type BlockProtocolAggregateEntityTypesPayload = {
  accountId?: string | null;
  operation?: Omit<
    BlockProtocolAggregateOperationInput,
    "entityTypeId" | "entityTypeVersionId"
  >;
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
  | BlockProtocolCreateEntitiesFunction
  | BlockProtocolGetEntitiesFunction
  | BlockProtocolUpdateEntitiesFunction
  | BlockProtocolDeleteEntitiesFunction
  | BlockProtocolAggregateEntityTypesFunction
  | BlockProtocolCreateEntityTypesFunction
  | BlockProtocolGetEntityTypesFunction
  | BlockProtocolDeleteEntityTypesFunction
  | BlockProtocolUpdateEntityTypesFunction
  | BlockProtocolCreateLinksFunction
  | BlockProtocolGetLinksFunction
  | BlockProtocolUpdateLinksFunction
  | BlockProtocolDeleteLinksFunction
  | BlockProtocolUploadFileFunction;

export type BlockProtocolFunctions = {
  aggregateEntities: BlockProtocolAggregateEntitiesFunction;
  createEntities: BlockProtocolCreateEntitiesFunction;
  getEntities: BlockProtocolGetEntitiesFunction;
  deleteEntities: BlockProtocolDeleteEntitiesFunction;
  updateEntities: BlockProtocolUpdateEntitiesFunction;

  aggregateEntityTypes: BlockProtocolAggregateEntityTypesFunction;
  createEntityTypes: BlockProtocolCreateEntityTypesFunction;
  getEntityTypes: BlockProtocolGetEntityTypesFunction;
  updateEntityTypes: BlockProtocolUpdateEntityTypesFunction;
  deleteEntityTypes: BlockProtocolDeleteEntityTypesFunction;

  getLinks: BlockProtocolGetLinksFunction;
  createLinks: BlockProtocolCreateLinksFunction;
  deleteLinks: BlockProtocolDeleteLinksFunction;
  updateLinks: BlockProtocolUpdateLinksFunction;

  uploadFile: BlockProtocolUploadFileFunction;
};

export type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | JSONObject;

export type JSONObject = { [key: string]: JSONValue };

export interface JSONArray extends Array<JSONValue> {}

/**
 * Block Protocol-specified properties,
 * which the embedding application should provide.
 */
export type BlockProtocolProps = {
  accountId?: string;
  entityId?: string;
  entityTypeId?: string;
  entityTypes?: BlockProtocolEntityType[];
  linkedAggregations?: BlockProtocolLinkedAggregation[];
  linkedEntities?: BlockProtocolEntity[];
  linkGroups?: BlockProtocolLinkGroup[];
} & BlockProtocolFunctions;
