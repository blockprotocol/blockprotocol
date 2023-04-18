import { Box } from "@mui/system";
import { Fragment, memo } from "react";

import { useApiKeys } from "../api-keys-context";
import { ApiKeyItemProps, ApiKeyProps } from "../types";
import { ApiKeyCard } from "./api-key-card";
import { ApiKeyTableRow } from "./api-key-table-row";
import { MobileApiKeyItem } from "./mobile-api-key-item";
import { RevokeApiKeyCard } from "./revoke-api-key-card";

const ApiKeysMemoizedItems = ({
  apiKeys,
  mobile = false,
}: {
  apiKeys: ApiKeyProps[];
  mobile?: boolean;
}) => {
  const {
    keyActionStatus,
    setKeyActionStatus,
    newlyCreatedKeyIds,
    revokeApiKey,
    renameApiKey,
  } = useApiKeys();

  const generateApiKeyItemProps = (data: ApiKeyProps): ApiKeyItemProps => {
    const dismissKeyAction = () => setKeyActionStatus(undefined);

    const { displayName, publicId } = data;
    return {
      apiKey: data,
      fullKeyValue: newlyCreatedKeyIds.find((key) => key.includes(publicId)),
      keyAction:
        keyActionStatus?.publicId === publicId
          ? keyActionStatus.action
          : undefined,
      renameApiKeyCard: (
        <ApiKeyCard
          onClose={dismissKeyAction}
          defaultValue={displayName}
          showDiscardButton
          submitTitle="Rename key"
          inputLabel="Rename your key"
          onSubmit={async (newDisplayName) =>
            renameApiKey(publicId, newDisplayName)
          }
        />
      ),
      revokeApiKeyCard: (
        <RevokeApiKeyCard
          onClose={dismissKeyAction}
          displayName={displayName}
          onRevoke={async () => revokeApiKey(publicId)}
        />
      ),
    };
  };

  if (mobile) {
    return (
      <>
        {apiKeys.map((data, index) => (
          <Fragment key={data.publicId}>
            <MobileApiKeyItem {...generateApiKeyItemProps(data)} />

            <Box
              sx={{
                mt: 3,
                mb: index < apiKeys.length - 1 ? 3 : 0,
                borderTop: "1px solid",
                borderColor: ({ palette }) => palette.gray[30],
              }}
            />
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <>
      {apiKeys.map((data) => (
        <ApiKeyTableRow
          key={data.publicId}
          {...generateApiKeyItemProps(data)}
        />
      ))}
    </>
  );
};

const ApiKeysMemoListOuter = memo(ApiKeysMemoizedItems);

export { ApiKeysMemoListOuter as ApiKeysMemoizedItems };
