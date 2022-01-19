import { Box, Typography, TableCell } from "@mui/material";
import { VoidFunctionComponent, ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../../Button";
import { BpModal } from "../../Modal";
import { WarningIcon } from "../../SvgIcon/WarningIcon";
import { TableRows } from "../../Table";
import { ApiKeyRenderer } from "./ApiKeyRenderer";
import { dashboardButtonStyles } from "./utils";

type GenerateApiModalProps = {
  generateKeyModalOpen: boolean;
  closeGenerateModal: () => void;
  setTableRows: (rows: TableRows) => void;
};

type RowDateTimeRendererProps = {
  relative: string;
  absolute: string;
};

const RowDateTimeRenderer: VoidFunctionComponent<RowDateTimeRendererProps> = ({
  absolute,
  relative,
}) => {
  return (
    <TableCell>
      <Box sx={{ marginBottom: 1 }}>{relative}</Box>
      <Box sx={{ fontSize: "0.9rem", color: "#64778C" }}>{absolute}</Box>
    </TableCell>
  );
};

const getMockRows: (keyName: string) => TableRows = (keyname) => [
  [
    keyname,
    "bpkey_7f89shh5009jg",
    <RowDateTimeRenderer
      key="mock-key-lastuser"
      relative="2 hours ago"
      absolute="17.10 PM"
    />,
    <RowDateTimeRenderer
      key="mock-key-created"
      relative="8 months ago"
      absolute="17 April 2020"
    />,
  ],
];

export const GenerateApiModal: VoidFunctionComponent<GenerateApiModalProps> = ({
  closeGenerateModal,
  generateKeyModalOpen,
  setTableRows,
}) => {
  const [keyNameController, setKeyNameController] = useState("");
  const [apiKey, setApiKey] = useState("");

  const closeModal = () => {
    setKeyNameController("");
    setApiKey("");
    closeGenerateModal();
  };

  const createKey = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!keyNameController.trim()) {
      return;
    }

    setTableRows(getMockRows(keyNameController));
    setApiKey(
      "bpkey_7f89shh5009jg8hfnefj0989dqnm0076s00cl8kj9jj87hfnefj0989dqnm0000007shj9",
    );
  };

  return (
    <BpModal open={generateKeyModalOpen} onClose={closeModal}>
      {apiKey ? (
        <ApiKeyRenderer
          keyName={keyNameController}
          apiKey={apiKey}
          closeModal={closeModal}
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
            Generate API Key
          </Typography>
          <Typography sx={{ marginBottom: 1.5 }}>
            <p>Name your key.</p> Key names usually describe where they’re used,
            such as “Production”.
          </Typography>

          <form onSubmit={createKey}>
            <Box
              value={keyNameController}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setKeyNameController(event.target.value);
              }}
              component="input"
              sx={{
                background: "#FFFFFF",
                border: "1px solid #D8DFE5",
                width: "100%",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                borderRadius: "6px",
                marginBottom: 2,
              }}
              py={1}
              px={2}
              placeholder="Key Name"
              required
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 2,
              }}
            >
              <Button type="submit" sx={{ borderRadius: 2, marginBottom: 2 }}>
                Create Key
              </Button>

              <Box
                onClick={closeModal}
                component="button"
                sx={{ ...dashboardButtonStyles, marginBottom: 2 }}
              >
                Cancel
              </Box>
            </Box>
          </form>
        </Box>
      )}
    </BpModal>
  );
};
