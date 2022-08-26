import {
  faExternalLink,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Alert, alertClasses, Box, Typography } from "@mui/material";

import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

export const PublishBlockInfo = () => {
  return (
    <Alert
      icon={<FontAwesomeIcon icon={faInfoCircle} />}
      severity="info"
      sx={(theme) => ({
        width: "100%",
        alignItems: "center",
        padding: theme.spacing(3, 4),
        background: theme.palette.purple[100],

        [`.${alertClasses.icon}`]: {
          marginRight: theme.spacing(3),
          svg: {
            color: theme.palette.purple[200],
            fontSize: theme.spacing(4),
          },
        },

        [`.${alertClasses.message}`]: {
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          overflow: "visible",
          padding: 0,
        },
      })}
    >
      <Box flexGrow={1}>
        <Typography
          variant="bpSmallCaps"
          fontWeight={500}
          mb={1.5}
          color={({ palette }) => palette.gray[90]}
        >
          Adding a new block will make it public on the hub
        </Typography>
        <Typography
          variant="bpSmallCopy"
          color={({ palette }) => palette.gray[80]}
        >
          Your package must contain a valid{" "}
          <Typography variant="bpCode">block-metadata.json</Typography> file.
        </Typography>
      </Box>

      <Link
        variant="bpSmallCopy"
        alignSelf="flex-end"
        href="/docs/developing-blocks#lifecycle-of-a-block"
        target="_blank"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        Learn more in the docs{" "}
        <FontAwesomeIcon sx={{ ml: 1 }} icon={faExternalLink} />
      </Link>
    </Alert>
  );
};
