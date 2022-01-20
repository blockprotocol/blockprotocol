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
  (actions: BlockProtocolDeleteEntitiesAction[]): Promise<unknown[]>;
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
  operation: Required<BlockProtocolAggregateOperationInput> & {
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
    file?: File | null;
    url?: string | null;
    mediaType: BlockProtocolFileMediaType;
  }): Promise<{
    entityId: string;
    url: string;
    mediaType: BlockProtocolFileMediaType;
  }>;
};

// ----------------------------- LINKS -------------------------------- //
export type BlockProtocolLink = {
  linkId: string;
  sourceEntityAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityTypeId?: string | null;
  sourceEntityVersionId?: string | null;
  index?: number | null;
  path: string;
} & (
  | {
      destinationAccountId?: string | null;
      destinationEntityId: string;
      destinationEntityTypeId?: string | null;
      destinationEntityVersionId?: string | null;
    }
  | { operation: BlockProtocolAggregateOperationInput }
);

export type BlockProtocolLinkGroup = {
  sourceEntityAccountId?: string | null;
  sourceEntityId: string;
  sourceEntityVersionId?: string | null;
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
  | BlockProtocolAggregateEntityTypesFunction
  | BlockProtocolCreateEntitiesFunction
  | BlockProtocolCreateEntityTypesFunction
  | BlockProtocolCreateLinksFunction
  | BlockProtocolDeleteEntitiesFunction
  | BlockProtocolDeleteEntityTypesFunction
  | BlockProtocolDeleteLinksFunction
  | BlockProtocolGetEntitiesFunction
  | BlockProtocolGetEntityTypesFunction
  | BlockProtocolGetLinksFunction
  | BlockProtocolUpdateEntitiesFunction
  | BlockProtocolUpdateEntityTypesFunction
  | BlockProtocolUpdateLinksFunction
  | BlockProtocolUploadFileFunction;

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
  aggregateEntities?: BlockProtocolAggregateEntitiesFunction;
  aggregateEntitiesLoading?: boolean;
  aggregateEntitiesError?: Error;
  aggregateEntityTypes?: BlockProtocolAggregateEntityTypesFunction;
  createEntities?: BlockProtocolCreateEntitiesFunction;
  createEntitiesLoading?: boolean;
  createEntitiesError?: Error;
  createLinks?: BlockProtocolCreateLinksFunction;
  createLinksLoading?: boolean;
  createLinksError?: Error;
  deleteLinks?: BlockProtocolDeleteLinksFunction;
  deleteLinksLoading?: boolean;
  deleteLinksError?: Error;
  entityId?: string;
  entityTypeId?: string;
  entityTypes?: BlockProtocolEntityType[];
  linkedEntities?: BlockProtocolEntity[];
  linkGroups?: BlockProtocolLinkGroup[];
  updateEntities?: BlockProtocolUpdateEntitiesFunction;
  updateEntitiesLoading?: boolean;
  updateEntitiesError?: Error;
  updateEntityTypes?: BlockProtocolUpdateEntityTypesFunction;
  updateEntityTypesLoading?: boolean;
  updateEntityTypesError?: Error;
  uploadFile?: BlockProtocolUploadFileFunction;
};
