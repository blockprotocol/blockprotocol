import { Box, Typography } from "@mui/material";
import { VoidFunctionComponent, ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../../Button";
import { Modal } from "../../Modal/Modal";
import { WarningIcon } from "../../icons";
import { ApiKeyRenderer } from "./ApiKeyRenderer";
import { apiClient } from "../../../lib/apiClient";

type GenerateApiModalProps = {
  close: () => void;
  keyNameToRegenerate?: string;
  refetchKeyList: () => void;
};

export const GenerateApiModal: VoidFunctionComponent<GenerateApiModalProps> = ({
  close,
  keyNameToRegenerate,
  refetchKeyList,
}) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [keyName, setKeyName] = useState(keyNameToRegenerate || "");

  const regenerate = !!keyNameToRegenerate;

  const createKey = (event: FormEvent) => {
    event.preventDefault();
    /** @todo handle errors and show the user a msg */
    void apiClient.generateApiKey({ displayName: keyName }).then(({ data }) => {
      if (data) {
        setApiKey(data.apiKey);
      }
      refetchKeyList();
    });
  };

  return (
    <Modal open onClose={close}>
      {apiKey ? (
        <ApiKeyRenderer
          keyName={keyName}
          apiKey={apiKey}
          closeModal={close}
          regenerate={regenerate}
        />
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              background: "#FFF6ED",
              borderRadius: "100%",
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              marginBottom: 2,
            }}
          >
            <WarningIcon width="auto" height="1em" />
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
            {regenerate ? `Regenerate ${keyName}` : "Generate API Key"}
          </Typography>
          <Typography sx={{ marginBottom: 1.5 }}>
            {regenerate ? (
              <>
                Regenerating the <b>{keyName}</b> key will invalidate it. <br />
                This could break any application that relies on it. <br />
                <b>Are you sure you want to regenerate it?</b>
              </>
            ) : (
              <>
                <p>Name your key.</p>
                Key names usually describe where they’re used, <br />
                such as “Production”.
              </>
            )}
          </Typography>

          <form onSubmit={createKey}>
            {regenerate ? null : (
              <Box
                value={keyName}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setKeyName(event.target.value);
                }}
                component="input"
                sx={(theme) => ({
                  background: "#FFFFFF",
                  border: `1px solid ${theme.palette.gray[30]}`,
                  width: "100%",
                  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                  borderRadius: "6px",
                  marginBottom: 2,
                })}
                py={1}
                px={2}
                placeholder="Key Name"
                required
              />
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 2,
              }}
            >
              <Button
                color={regenerate ? "warning" : "purple"}
                type="submit"
                variant="tertiary"
                sx={{ marginBottom: 1 }}
                squared
              >
                {regenerate ? "Regenerate Key" : "Create Key"}
              </Button>

              <Button
                onClick={close}
                color="gray"
                variant="tertiary"
                sx={{ marginBottom: 1 }}
                squared
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Modal>
  );
};
