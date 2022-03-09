import { Box } from "@mui/material";
import { useState, VoidFunctionComponent } from "react";
import { Button } from "../../Button";
import { EntityType } from "../../../lib/api/model/entityType.model";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { ListViewCard } from "./ListViewCard";
import { CreateSchemaModal } from "../../Modal/CreateSchemaModal";
import { useUserIsCurrent } from "./useUserIsCurrent";
import { LinkButton } from "../../LinkButton";
import { Placeholder } from "./Placeholder";

export interface TabPanelContentsWithSchemasProps {
  entityTypes: EntityType[];
  user: SerializedUser;
}

export const TabPanelContentsWithSchemas: VoidFunctionComponent<
  TabPanelContentsWithSchemasProps
> = ({ user, entityTypes }) => {
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const userIsCurrent = useUserIsCurrent(user);

  if (!entityTypes.length) {
    return userIsCurrent ? (
      <Placeholder
        header="You haven’t created any schemas yet"
        tip="Start building to see your creations show up here."
        actions={
          <LinkButton variant="secondary" href="/hub">
            Browse the Block Hub
          </LinkButton>
        }
      />
    ) : (
      <Placeholder
        header={`@${user.shortname} hasn’t created any schemas yet`}
        tip="You can browse existing blocks and schemas on the Block Hub."
        actions={
          <LinkButton variant="secondary" href="/hub">
            Browse the Block Hub
          </LinkButton>
        }
      />
    );
  }

  return (
    <>
      {userIsCurrent && (
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
      <CreateSchemaModal
        open={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
      />
    </>
  );
};
