import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleCheck,
  faTimes,
  faZap,
} from "@fortawesome/free-solid-svg-icons";
import { Box, IconButton, modalClasses, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { Button } from "../../button";
import { FontAwesomeIcon } from "../../icons";
import { Modal } from "../../modal/modal";

export interface ActionButtonProps {
  label: string;
  icon: ReactNode;
}

export const ActionButton = ({ label, icon }) => (
  <Button
    squared
    variant="tertiary"
    startIcon={icon}
    sx={{
      borderColor: "#DEF4FD",
      fontSize: 15,
      fontWeight: 700,
      background,
    }}
  >
    {label}
  </Button>
);

export interface VoteCastModalProps {
  open: boolean;
  onClose: () => void;
}

export const VoteCastModal: FunctionComponent<VoteCastModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      data-testid="wp-vote-cast"
      sx={{
        fontFamily: "Inter",
        [`& .${modalClasses.root}`]: {
          maxWidth: 600,
        },
      }}
      contentStyle={{
        width: 600,
        p: {
          xs: 1.25,
        },
      }}
      open={open}
      onClose={onClose}
    >
      <>
        <Typography>Vote successfully cast 🎉</Typography>

        <IconButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} sx={{ fontSize: 16 }} />
        </IconButton>

        <Box>
          <FontAwesomeIcon icon={faCircleCheck} sx={{ fontSize: 32 }} />
          <Typography>
            <strong>
              Thanks! Your vote has now been verified and counted towards the
              total.
            </strong>{" "}
            We’ll let you know when work begins on your chosen app.
          </Typography>
        </Box>

        <Box
          sx={{
            background: "#FBF7FF",
            alignItems: "start",
            padding: "12px 16px",
            borderRadius: 1,
            width: 1,
            justifyContent: "start",
            marginTop: 1.5,
          }}
        >
          <Box display="flex" gap={2}>
            <FontAwesomeIcon
              icon={faZap}
              sx={{
                fontSize: 16,
                color: ({ palette }) => palette.purple[70],
                mt: 0.75,
              }}
            />
            <Box>
              <Typography
                variant="bpBodyCopy"
                sx={{
                  color: ({ palette }) => palette.purple[70],
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: "start",
                  line: 1.5,
                }}
              >
                Speed up how quickly we get to your app
              </Typography>
              <Typography
                variant="bpBodyCopy"
                sx={{
                  fontWeight: 400,
                  fontSize: 15,
                  textAlign: "start",
                  line: 1.5,
                }}
              >
                The more votes apps receive, the sooner we’ll prioritize their
                support. Consider letting others you think might be interested
                know.
              </Typography>
            </Box>
          </Box>


                <ActionButton label="Compose a tweet" icon={ <FontAwesomeIcon icon={faTwitter} sx={{ color: "#1DA1F2" }}/>}
          <Button
            squared
            variant="tertiary"
            startIcon={
              <FontAwesomeIcon icon={faTwitter} sx={{ color: "#1DA1F2" }} />
            }
            sx={{
              borderColor: "#DEF4FD",
              color: ({ palette }) => palette.gray[90],
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Compose a tweet
          </Button>
        </Box>
      </>
    </Modal>
  );
};
