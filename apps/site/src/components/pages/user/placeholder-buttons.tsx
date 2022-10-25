import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { FunctionComponent } from "react";

import { Button } from "../../button.js";
import { FontAwesomeIcon, TableTreeIcon } from "../../icons/index.js";
import { LinkButton } from "../../link-button.js";

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
      Browse the Hub
    </LinkButton>
  );
};
