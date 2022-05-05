import { Box } from "@mui/material";
import { useState, VoidFunctionComponent } from "react";

import { EntityType } from "../../../lib/api/model/entityType.model";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { Button } from "../../Button";
import { CreateSchemaModal } from "../../Modal/CreateSchemaModal";
import { ListViewCard } from "./ListViewCard";
import { Placeholder } from "./Placeholder";
import { BrowseHubButton, CreateSchemaButton } from "./PlaceholderButtons";
import { useUserStatus } from "./useUserStatus";

export interface TabPanelContentsWithSchemasProps {
  entityTypes: EntityType[];
  user: SerializedUser;
}

export const TabPanelContentsWithSchemas: VoidFunctionComponent<
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
        tip="You can browse existing schemas on the Block Hub."
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
          type="schema"
          title={schema.title}
          description={schema.description as string}
          lastUpdated={updatedAt as unknown as string}
          url={schema.$id}
        />
      ))}
      {createSchemaModal}
    </>
  );
};
