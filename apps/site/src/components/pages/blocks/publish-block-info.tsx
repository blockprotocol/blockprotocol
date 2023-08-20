import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";

import { Alert } from "../../alert";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

export const PublishBlockInfo = () => {
  return (
    <Alert
      type="info"
      title="Adding a new block will make it public on the Hub"
      description={
        <>
          Your package must contain a valid{" "}
          <Typography variant="bpCode">block-metadata.json</Typography> file.
        </>
      }
      extraContent={
        <Link
          variant="bpSmallCopy"
          alignSelf="flex-end"
          href="/docs/blocks/develop#lifecycle-of-a-block"
          target="_blank"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Learn more in the docs{" "}
          <FontAwesomeIcon sx={{ ml: 1 }} icon={faExternalLink} />
        </Link>
      }
    />
  );
};
