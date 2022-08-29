import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";

import { Alert } from "../../alert";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

interface BlockPublishedAlertProps {
  blockHref: string;
}

export const BlockPublishedAlert = ({
  blockHref,
}: BlockPublishedAlertProps) => {
  return (
    <Alert
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
      sx={{ mb: 3 }}
    />
  );
};
