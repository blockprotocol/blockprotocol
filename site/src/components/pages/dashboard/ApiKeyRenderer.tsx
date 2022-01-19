import { Box, Typography } from "@mui/material";
import { useState, VoidFunctionComponent } from "react";
import { Button } from "../../Button";
import { ApiKeyGenerated } from "../../SvgIcon/ApiKeyGenerated";
import { CopyIcon } from "../../SvgIcon/CopyIcon";

import { dashboardSmallButtonStyles } from "./utils";

type ApiKeyRendererProps = {
  apiKey: string;
  regenerate?: boolean;
  closeModal: () => void;
  keyName: string;
};

export const ApiKeyRenderer: VoidFunctionComponent<ApiKeyRendererProps> = ({
  apiKey,
  closeModal,
  regenerate,
  keyName,
}) => {
  const [copied, setCopied] = useState(false);

  const copyApiKey = () => {
    if (navigator.clipboard != undefined) {
      // Chrome
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          marginBottom: 2,
        }}
      >
        <ApiKeyGenerated sx={{ fontSize: "52px" }} />
      </Box>
      <Typography
        sx={{
          fontFamily: "Apercu Pro",
          fontSize: "35.1625px",
          lineHeight: "120%",
          color: "#37434F",
          marginBottom: 2,
        }}
      >
        {keyName} {regenerate ? "regenerated" : "generated"}
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Your key {keyName} has been {regenerate ? "regenerated" : "generated"}.
        {regenerate ? " The previous key will no longer work." : ""} Here is
        your new key:
      </Typography>

      <Box
        onMouseLeave={() => setCopied(false)}
        sx={{
          marginBottom: 2,
          border: "1px solid #F2F5FA",
          borderRadius: 2,
          p: 2,
          position: "relative",
        }}
      >
        <Box
          sx={{
            overflowWrap: "anywhere",
            textAlign: "left",
            color: "#91A5BA",
          }}
        >
          {apiKey}
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="button"
            id="api-copy"
            sx={{
              ...dashboardSmallButtonStyles,
              transition: "all 0.2s ease-in-out",
              display: "flex",
              alignItems: "center",
            }}
            onClick={copyApiKey}
          >
            {copied ? (
              "✓ Copied"
            ) : (
              <>
                <CopyIcon
                  width="auto"
                  height="1em"
                  sx={{ fontSize: "1em", marginRight: 1 }}
                />
                Copy to Clipboard
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <Button onClick={closeModal} sx={{ borderRadius: 2 }}>
          Go back to settings
        </Button>
      </Box>
    </Box>
  );
};
