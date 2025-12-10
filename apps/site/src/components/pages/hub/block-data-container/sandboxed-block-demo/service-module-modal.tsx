import { ExternalServiceMethodRequest } from "@local/internal-api-client";
import { Box, Typography } from "@mui/material";

import { useUser } from "../../../../../context/user-context";
import { Button } from "../../../../button";
import { Link } from "../../../../link";
import { LinkButton } from "../../../../link-button";
import { Modal } from "../../../../modal/modal";

type ServiceModuleModalProps = {
  setServiceUsagePermission: (permit: boolean) => void;
  onClose: () => void;
  serviceModuleMessage: ExternalServiceMethodRequest | null;
};

const AnonymousUserContent = () => (
  <>
    <Typography
      sx={{
        mt: 2,
        fontSize: 16,
        lineHeight: 2,
      }}
    >
      <Link href="https://app.hash.ai/signup">Sign up for a HASH account</Link>
      to get free credits for services like this, and to try this block out.
    </Typography>
    <Typography
      sx={{
        mt: 1,
        mb: 3,
        fontSize: 16,
        lineHeight: 2,
      }}
    >
      <strong>Þ</strong> blocks can be used within various different block-based
      applications, including <Link href="https://hash.ai/">HASH</Link>.
    </Typography>
    <Box display="flex" justifyContent="center">
      <LinkButton sx={{ width: 160, mr: 4, fontWeight: 600 }} href="/signup">
        Sign up
      </LinkButton>
      <LinkButton sx={{ width: 160, mr: 4, fontWeight: 600 }} href="/login">
        Log in
      </LinkButton>
    </Box>
  </>
);

const AuthenticatedUserContent = ({
  setServiceUsagePermission,
}: Pick<ServiceModuleModalProps, "setServiceUsagePermission">) => (
  <>
    <Typography
      sx={{
        mt: 2,
        fontSize: 16,
        lineHeight: 2,
      }}
    >
      Your Block Protocol account gives you free credits for services like this
      to try out here or for use in real applications.
    </Typography>
    <Typography
      sx={{
        mt: 1,
        mb: 1,
        fontSize: 16,
        lineHeight: 2,
      }}
    >
      <strong>
        Do you want to allow this block to make requests to external services?
      </strong>
    </Typography>
    <Typography
      sx={{
        mb: 4,
        fontSize: 16,
        lineHeight: 2,
      }}
    >
      This will use your free credits, or incur charges if you have used all of
      them for this service and have a payment method associated.
    </Typography>
    <Box display="flex" justifyContent="center">
      <Button
        onClick={() => setServiceUsagePermission(true)}
        sx={{ width: 160, mr: 4 }}
      >
        Yes please
      </Button>
      <Button
        onClick={() => setServiceUsagePermission(false)}
        sx={{ width: 160 }}
        color="danger"
      >
        No thanks
      </Button>
    </Box>
  </>
);

export const ServiceModuleModal = ({
  setServiceUsagePermission,
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
          This block uses
          <strong> {serviceModuleMessage?.providerName}</strong>
        </Typography>
        {user ? (
          <AuthenticatedUserContent
            setServiceUsagePermission={(permit) => {
              setServiceUsagePermission(permit);
              onClose();
            }}
          />
        ) : (
          <AnonymousUserContent />
        )}
      </Box>
    </Modal>
  );
};
