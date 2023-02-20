import { EntityTypeWithMetadata } from "@blockprotocol/graph/.";
import { Box } from "@mui/material";
import { FunctionComponent, useState } from "react";

import { SerializedUser } from "../../../lib/api/model/user.model";
import { Button } from "../../button";
import { CreateSchemaModal } from "../../modal/create-schema-modal";
import { ListViewCard } from "./list-view-card";
import { Placeholder } from "./placeholder";
import { BrowseHubButton, CreateSchemaButton } from "./placeholder-buttons";
import { useUserStatus } from "./use-user-status";

export interface TabPanelContentsWithSchemasProps {
  entityTypes: EntityTypeWithMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithSchemas: FunctionComponent<
  TabPanelContentsWithSchemasProps
> = ({ user, entityTypes }) => {
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const userStatus = useUserStatus(user);
  const createSchemaModal = (
    <CreateSchemaModal
      open={schemaModalOpen}
      onClose={() => setSchemaModalOpen(false)}
    />
  );

  if (!entityTypes.length) {
    if (userStatus === "loading") {
      return null;
    }

    return userStatus === "current" ? (
      <>
        <Placeholder
          header="You haven’t created any types yet"
          tip="Start building to see your creations show up here."
          actions={
            <CreateSchemaButton onClick={() => setSchemaModalOpen(true)} />
          }
        />
        {createSchemaModal}
      </>
    ) : (
      <Placeholder
        header={`@${user.shortname} hasn’t published any types yet`}
        tip="You can browse existing types on the Hub."
        actions={<BrowseHubButton />}
      />
    );
  }

  return (
    <>
      {userStatus === "current" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          <Button squared size="small" onClick={() => setSchemaModalOpen(true)}>
            Create New Entity Type
          </Button>
        </Box>
      )}
      {entityTypes.map(({ metadata, schema }) => (
        <ListViewCard
          key={schema.$id}
          title={schema.title}
          description={schema.description as string}
          extraContent={`Version ${metadata.recordId.version}`}
          url={schema.$id}
        />
      ))}
      {createSchemaModal}
    </>
  );
};
