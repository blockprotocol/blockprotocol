import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";

import { Alert } from "../../alert.js";
import { FontAwesomeIcon } from "../../icons/index.js";
import { Link } from "../../link.js";

interface PublishBlockSuccessProps {
  blockHref: string;
}

export const PublishBlockSuccess = ({
  blockHref,
}: PublishBlockSuccessProps) => {
  return (
    <Alert
      sx={{ mb: 3 }}
      type="success"
      title="Your block was published successfully"
      description={
        <>
          Your block is accessible at{" "}
          <Link
            href={blockHref}
            sx={{ wordBreak: "break-all", border: "none !important" }}
          >
            <Typography variant="bpCode">{`blockprotocol.org/${blockHref}`}</Typography>
            <FontAwesomeIcon
              icon={faChevronRight}
              sx={{
                color: ({ palette }) => palette.green[70],
                fontSize: 12,
                ml: 0.5,
              }}
            />
          </Link>
        </>
      }
    />
  );
};
