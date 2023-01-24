import { Box, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";

import { Button } from "../../button";
import { ApiKeyGeneratedIcon, CopyIcon } from "../../icons";

type ApiKeyRendererProps = {
  apiKey: string;
  regenerate?: boolean;
  closeModal: () => void;
  keyName: string;
};

export const ApiKeyRenderer: FunctionComponent<ApiKeyRendererProps> = ({
  apiKey,
  closeModal,
  regenerate,
  keyName,
}) => {
  const [copied, setCopied] = useState(false);

  const copyApiKey = () => {
    if (navigator.clipboard !== undefined) {
      // Chrome
      setCopied(true);
      return navigator.clipboard.writeText(apiKey);
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
        <ApiKeyGeneratedIcon sx={{ fontSize: "52px" }} />
      </Box>
      <Typography
        sx={{
          fontSize: "35.1625px",
          lineHeight: "120%",
          color: "#37434F",
          marginBottom: 2,
        }}
      >
        Key {regenerate ? "regenerated" : "generated"}
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Your key {keyName} has been {regenerate ? "regenerated" : "generated"}.
        <br />
        {regenerate ? (
          <strong>
            The previous key will no longer work.
            <br />
          </strong>
        ) : null}
        Here is your new key - make a note of it, <br />
        we can't show it to you again!
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
          data-testid="api-key-value"
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
          <Button
            sx={{
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
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <Button onClick={closeModal} sx={{ borderRadius: 2 }}>
          Go back
        </Button>
      </Box>
    </Box>
  );
};
