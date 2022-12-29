import { Box } from "@mui/material";
import { FunctionComponent, useState } from "react";

import { EntityType } from "../../../lib/api/model/entity-type.model";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { formatUpdatedAt } from "../../../util/html-utils";
import { Button } from "../../button";
import { CreateTypeModal } from "../../modal/create-type-modal";
import { ListViewCard } from "./list-view-card";
import { Placeholder } from "./placeholder";
import { BrowseHubButton, CreateTypeButton } from "./placeholder-buttons";
import { useUserStatus } from "./use-user-status";

export interface TabPanelContentsWithTypesProps {
  entityTypes: EntityType[];
  user: SerializedUser;
}

export const TabPanelContentsWithTypes: FunctionComponent<
  TabPanelContentsWithTypesProps
> = ({ user, entityTypes }) => {
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const userStatus = useUserStatus(user);
  const createTypeModal = (
    <CreateTypeModal
      open={typeModalOpen}
      onClose={() => setTypeModalOpen(false)}
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
            <CreateTypeButton onClick={() => setTypeModalOpen(true)} />
          }
        />
        {createTypeModal}
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
          <Button squared size="small" onClick={() => setTypeModalOpen(true)}>
            Create New Type
          </Button>
        </Box>
      )}
      {entityTypes.map(({ entityTypeId, type, updatedAt }) => (
        <ListViewCard
          key={entityTypeId}
          title={type.title}
          description={type.description as string}
          extraContent={formatUpdatedAt(updatedAt as unknown as string)}
          url={type.$id}
        />
      ))}
      {createTypeModal}
    </>
  );
};
