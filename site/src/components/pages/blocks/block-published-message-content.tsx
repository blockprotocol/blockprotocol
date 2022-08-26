import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

interface BlockPublishedMessageContentProps {
  blockHref: string;
}

export const BlockPublishedMessageContent = ({
  blockHref,
}: BlockPublishedMessageContentProps) => {
  return (
    <Box sx={{ wordBreak: "break-all" }}>
      Your block was published successfully. It can now be found at{" "}
      <Link
        href={blockHref}
        sx={{ color: "inherit", textDecoration: "underline" }}
      >
        {`blockprotocol.org/${blockHref}`}
        <FontAwesomeIcon sx={{ ml: 0.5 }} icon={faExternalLink} />
      </Link>
    </Box>
  );
};
