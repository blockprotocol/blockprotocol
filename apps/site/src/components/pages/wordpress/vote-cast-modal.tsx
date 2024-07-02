import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleCheck,
  faComment,
  faTimes,
  faZap,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  IconButton,
  modalClasses,
  Typography,
  useTheme,
} from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { EnvelopeIcon, FontAwesomeIcon, GithubIcon } from "../../icons";
import { LinkButton } from "../../link-button";
import { Modal } from "../../modal/modal";

export interface CTASectionProps {
  title: string;
  subtitle: string;
  icon: IconDefinition;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  children: ReactNode;
}

export const CTASection: FunctionComponent<CTASectionProps> = ({
  title,
  subtitle,
  icon,
  textColor,
  backgroundColor,
  borderColor,
  children,
}) => {
  return (
    <Box
      sx={{
        background: backgroundColor,
        alignItems: "start",
        padding: "12px 16px",
        borderRadius: 1,
        width: 1,
        justifyContent: "start",
        marginTop: 1.25,
        border: `1px solid ${borderColor}`,
      }}
    >
      <Box display="flex" gap={2}>
        <FontAwesomeIcon
          icon={icon}
          sx={{
            fontSize: 16,
            color: textColor,
            mt: 0.75,
          }}
        />

        <Box>
          <Typography
            variant="bpBodyCopy"
            sx={{
              color: textColor,
              fontWeight: 500,
              fontSize: 15,
              textAlign: "start",
              line: 1.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="bpBodyCopy"
            sx={{
              fontWeight: 400,
              fontSize: 15,
              textAlign: "start",
              line: 1.5,
              mb: 1.5,
            }}
          >
            {subtitle}
          </Typography>

          <Box display="flex" gap={1.5}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  href: string;
}

export const ActionButton: FunctionComponent<ActionButtonProps> = ({
  label,
  icon,
  href,
}) => {
  return (
    <LinkButton
      squared
      href={href}
      variant="tertiary"
      startIcon={icon}
      sx={{
        borderColor: "#DEF4FD",
        fontSize: 15,
        fontWeight: 700,
        color: ({ palette }) => palette.gray[90],
      }}
    >
      {label}
    </LinkButton>
  );
};

export interface VoteCastModalProps {
  open: boolean;
  onClose: () => void;
  twitterButtonHref?: string;
}

export const VoteCastModal: FunctionComponent<VoteCastModalProps> = ({
  open,
  onClose,
  twitterButtonHref,
}) => {
  const theme = useTheme();

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
        outline: "none",
        p: {
          xs: 1.25,
        },
      }}
      open={open}
      onClose={onClose}
    >
      <>
        <Box sx={{ px: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="bpSmallCaps"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: ({ palette }) => palette.gray[50],
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              Vote successfully cast 🎉
            </Typography>

            <IconButton onClick={onClose}>
              <FontAwesomeIcon
                icon={faTimes}
                sx={{ fontSize: 16, fill: ({ palette }) => palette.gray[50] }}
              />
            </IconButton>
          </Box>

          <Box display="flex" gap={2.625} alignItems="center" mb={3.5}>
            <FontAwesomeIcon
              icon={faCircleCheck}
              sx={{ fontSize: 32, color: "#0775E3" }}
            />
            <Typography sx={{ fontSize: 15, lineHeight: 1.5 }}>
              <strong>
                Thanks! Your vote has now been verified and counted towards the
                total.
              </strong>{" "}
              We’ll let you know when work begins on your chosen app.
            </Typography>
          </Box>
        </Box>

        <CTASection
          title="Speed up how quickly we get to your app"
          subtitle="The more votes apps receive, the sooner we’ll prioritize their
        support. Consider letting others you think might be interested
        know."
          icon={faZap}
          textColor={theme.palette.purple[70]}
          backgroundColor="#FBF7FF"
          borderColor="#EFEBFE"
        >
          <ActionButton
            href={twitterButtonHref ?? ""}
            label="Compose a tweet"
            icon={
              <FontAwesomeIcon icon={faTwitter} sx={{ color: "#1DA1F2" }} />
            }
          />
          <ActionButton
            href="https://blockprotocol.org/contact"
            label="Send an email"
            icon={
              <EnvelopeIcon sx={{ color: ({ palette }) => palette.gray[50] }} />
            }
          />
        </CTASection>

        <CTASection
          title="Join the Þ community"
          subtitle="You can also watch and star us on GitHub."
          icon={faComment}
          textColor="#0089B4"
          backgroundColor="#F0F9FF"
          borderColor={theme.palette.teal[200]}
        >
          <ActionButton
            href="https://github.com/blockprotocol/blockprotocol"
            label="View on GitHub"
            icon={
              <GithubIcon sx={{ color: ({ palette }) => palette.gray[90] }} />
            }
          />
        </CTASection>
      </>
    </Modal>
  );
};
