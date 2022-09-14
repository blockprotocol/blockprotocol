import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { FunctionComponent } from "react";

import { Button } from "../../button";
import { FontAwesomeIcon, TableTreeIcon } from "../../icons";
import { LinkButton } from "../../link-button";

export const BuildBlockButton: FunctionComponent = () => {
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

export const CreateSchemaButton: FunctionComponent<{
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

export const BrowseHubButton: FunctionComponent = () => {
  return (
    <LinkButton variant="secondary" href="/hub" sx={{ margin: 1 }}>
      Browse the Block Hub
    </LinkButton>
  );
};
