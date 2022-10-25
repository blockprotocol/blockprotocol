import { Box } from "@mui/material";
import { FunctionComponent, useState } from "react";

import { EntityType } from "../../../lib/api/model/entity-type.model.js";
import { SerializedUser } from "../../../lib/api/model/user.model.js";
import { formatUpdatedAt } from "../../../util/html-utils.js";
import { Button } from "../../button.js";
import { CreateSchemaModal } from "../../modal/create-schema-modal.js";
import { ListViewCard } from "./list-view-card.js";
import { Placeholder } from "./placeholder.js";
import { BrowseHubButton, CreateSchemaButton } from "./placeholder-buttons.js";
import { useUserStatus } from "./use-user-status.js";

export interface TabPanelContentsWithSchemasProps {
  entityTypes: EntityType[];
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
          header="You haven’t created any schemas yet"
          tip="Start building to see your creations show up here."
          actions={
            <CreateSchemaButton onClick={() => setSchemaModalOpen(true)} />
          }
        />
        {createSchemaModal}
      </>
    ) : (
      <Placeholder
        header={`@${user.shortname} hasn’t published any schemas yet`}
        tip="You can browse existing schemas on the Hub."
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
            Create New Schema
          </Button>
        </Box>
      )}
      {entityTypes.map(({ entityTypeId, schema, updatedAt }) => (
        <ListViewCard
          key={entityTypeId}
          title={schema.title}
          description={schema.description as string}
          extraContent={formatUpdatedAt(updatedAt as unknown as string)}
          url={schema.$id}
        />
      ))}
      {createSchemaModal}
    </>
  );
};
