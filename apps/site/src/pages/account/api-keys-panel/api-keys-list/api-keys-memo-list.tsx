import { Box } from "@mui/material";
import { Fragment, memo } from "react";

import { ApiKeyProps } from "../types";
import { ApiKeyTableRow } from "./api-keys-memo-list/api-key-table-row";
import { MobileApiKeyItem } from "./api-keys-memo-list/mobile-api-key-item";

const ApiKeysMemoList = ({
  apiKeys,
  mobile = false,
  onRevoke,
  onRename,
}: {
  apiKeys: ApiKeyProps[];
  mobile?: boolean;
  onRevoke: (publicId: string) => Promise<void>;
  onRename: (publicId: string, displayName: string) => Promise<void>;
}) => {
  if (mobile) {
    return (
      <>
        {apiKeys.map((data, index) => (
          <Fragment key={data.publicId}>
            <MobileApiKeyItem
              apiKey={data}
              onRevoke={onRevoke}
              onRename={onRename}
            />
            <Box
              key={`${data.publicId}-divider`}
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
          apiKey={data}
          onRevoke={onRevoke}
          onRename={onRename}
        />
      ))}
    </>
  );
};

const ApiKeysMemoListOuter = memo(ApiKeysMemoList);

export { ApiKeysMemoListOuter as ApiKeysMemoList };
