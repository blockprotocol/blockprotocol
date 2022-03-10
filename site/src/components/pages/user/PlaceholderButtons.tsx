import { Icon } from "@mui/material";
import { VoidFunctionComponent } from "react";
import { Button } from "../../Button";
import { LinkButton } from "../../LinkButton";

export const BuildBlockButton: VoidFunctionComponent = () => {
  return (
    <LinkButton
      variant="secondary"
      href="/docs/developing-blocks"
      sx={{ margin: 1 }}
      startIcon={<Icon className="fa-regular fa-hammer" />}
    >
      Build a block
    </LinkButton>
  );
};

export const CreateSchemaButton: VoidFunctionComponent<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <Button
      sx={{ margin: 1 }}
      variant="secondary"
      onClick={onClick}
      startIcon={<Icon className="fa-regular fa-table-tree" />}
    >
      Create a schema
    </Button>
  );
};

export const BrowseHubButton: VoidFunctionComponent = () => {
  return (
    <LinkButton variant="secondary" href="/hub" sx={{ margin: 1 }}>
      Browse the Block Hub
    </LinkButton>
  );
};
