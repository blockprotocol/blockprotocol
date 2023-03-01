import { ExternalServiceMethodRequest } from "@local/internal-api-client";
import { Box, Typography } from "@mui/material";

import { useUser } from "../../../../context/user-context";
import { Button } from "../../../button";
import { Link } from "../../../link";
import { Modal } from "../../../modal/modal";

type ServiceModuleModalProps = {
  onClose: () => void;
  serviceModuleMessage: ExternalServiceMethodRequest | null;
};

export const ServiceModuleModal = ({
  onClose,
  serviceModuleMessage,
}: ServiceModuleModalProps) => {
  const { user } = useUser();

  return (
    <Modal
      open={!!serviceModuleMessage}
      onClose={onClose}
      contentStyle={{
        top: "40%",
        "&:focus": {
          outline: "none",
        },
      }}
    >
      <Box width="100%">
        <Typography
          variant="bpHeading4"
          sx={{
            mb: 2,
            display: "block",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          This block called the <br />
          <strong>
            {serviceModuleMessage?.providerName}{" "}
            {serviceModuleMessage?.methodName}
          </strong>{" "}
          service
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: 16,
            lineHeight: 2,
          }}
        >
          {user ? (
            <>Your Block Protocol account gives you</>
          ) : (
            <>
              <Link href="/signup">Sign up for a Block Protocol account</Link>{" "}
              to get
            </>
          )}{" "}
          free credits for services like this when you use blocks in real
          applications.
        </Typography>
        <Typography
          sx={{
            mt: 1,
            mb: 3,
            fontSize: 16,
            lineHeight: 2,
          }}
        >
          <strong>Þ</strong> blocks can be used within various different
          block-based applications, including{" "}
          <Link href="/wordpress">WordPress</Link>.
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button onClick={onClose} sx={{ width: 160 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
