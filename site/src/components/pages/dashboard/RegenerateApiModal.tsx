import { Box, Typography } from "@mui/material";
import { useState, VoidFunctionComponent } from "react";

import { BpModal } from "../../Modal";
import { WarningIcon } from "../../SvgIcon/WarningIcon";
import { ApiKeyRenderer } from "./ApiKeyRenderer";
import { dashboardDangerButtonStyles, dashboardButtonStyles } from "./utils";

type RegenerateApiModalProps = {
  regenerateKeyModalOpen: boolean;
  closeRegenerateModal: () => void;
  keyName: string;
};

export const RegenerateApiModal: VoidFunctionComponent<
  RegenerateApiModalProps
> = ({ closeRegenerateModal, keyName, regenerateKeyModalOpen }) => {
  const [apiKey, setApiKey] = useState("");

  const closeModal = () => {
    setApiKey("");
    closeRegenerateModal();
  };

  return (
    <BpModal open={regenerateKeyModalOpen} onClose={closeModal}>
      {apiKey ? (
        <ApiKeyRenderer
          apiKey={apiKey}
          closeModal={closeModal}
          keyName={keyName}
          regenerate
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
            Regenerate {keyName}
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Regenerating the <b>{keyName}</b> key will invalidate it. This could
            break your application if you’re using the key in production.{" "}
            <b>Are you sure you want to regenerate it?</b>
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              columnGap: 2,
            }}
          >
            <Box
              onClick={() => {
                setApiKey(
                  "bpkey_7f89shh5009jg8hfnefj0989dqnm0076s00cl8kj9jj87hfnefj0989dqnm0000007shj9",
                );
              }}
              component="button"
              sx={{ ...dashboardDangerButtonStyles, marginBottom: 1 }}
            >
              Regenerate Key
            </Box>

            <Box
              onClick={closeModal}
              component="button"
              sx={{ ...dashboardButtonStyles, marginBottom: 1 }}
            >
              Cancel
            </Box>
          </Box>
        </Box>
      )}
    </BpModal>
  );
};
