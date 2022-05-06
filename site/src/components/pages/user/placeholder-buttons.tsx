import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { VoidFunctionComponent } from "react";

import { Button } from "../../button";
import { FontAwesomeIcon, TableTreeIcon } from "../../icons";
import { LinkButton } from "../../link-button";

export const BuildBlockButton: VoidFunctionComponent = () => {
  return (
    <LinkButton
      variant="secondary"
      href="/docs/developing-blocks"
      sx={{ margin: 1 }}
      startIcon={<FontAwesomeIcon icon={faHammer} />}
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
      startIcon={<TableTreeIcon />}
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
