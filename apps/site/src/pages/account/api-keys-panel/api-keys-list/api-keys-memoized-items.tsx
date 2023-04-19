import { Box } from "@mui/system";
import { Fragment, memo } from "react";

import { UserFacingApiKeyProperties } from "../../../../lib/api/model/api-key.model";
import { ApiKeyItemProps, ApiKeyProps } from "../types";
import { ApiKeyTableRow } from "./api-key-table-row";
import { MobileApiKeyItem } from "./mobile-api-key-item";

const ApiKeyItem = ({
  mobile = false,
  ...rest
}: ApiKeyItemProps & { mobile?: boolean }) => {
  if (mobile) {
    return <MobileApiKeyItem {...rest} />;
  }

  return <ApiKeyTableRow {...rest} />;
};

const MemoizedApiKeyItem = memo(ApiKeyItem);

const ApiKeysMemoizedItems = ({
  apiKeys,
  newlyCreatedKeyIds,
  mobile = false,
}: {
  apiKeys: ApiKeyProps[];
  newlyCreatedKeyIds: string[];
  mobile?: boolean;
}) => {
  const getApiKeyItemProps = (
    data: UserFacingApiKeyProperties,
  ): ApiKeyItemProps => ({
    apiKey: data,
    fullKeyValue: newlyCreatedKeyIds.find((key) => key.includes(data.publicId)),
  });

  if (mobile) {
    return (
      <>
        {apiKeys.map((data, index) => (
          <Fragment key={data.publicId}>
            <MemoizedApiKeyItem mobile {...getApiKeyItemProps(data)} />

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
        <MemoizedApiKeyItem key={data.publicId} {...getApiKeyItemProps(data)} />
      ))}
    </>
  );
};

const ApiKeysMemoListOuter = memo(ApiKeysMemoizedItems);

export { ApiKeysMemoListOuter as ApiKeysMemoizedItems };
