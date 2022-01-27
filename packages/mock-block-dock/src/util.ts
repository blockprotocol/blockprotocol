type Identifiers = {
  accountId?: string | null;
  entityId: string;
  entityTypeId?: string | null;
};

export const matchIdentifiers = (first: Identifiers, second: Identifiers) => {
  if (first.entityId !== second.entityId) {
    return false;
  }
  if (first.accountId != null && first.accountId !== second.accountId) {
    return false;
  }
  if (
    first.entityTypeId != null &&
    first.entityTypeId !== second.entityTypeId
  ) {
    return false;
  }
  return true;
};
