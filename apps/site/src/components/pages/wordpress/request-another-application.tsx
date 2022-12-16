import { Box, modalClasses, Typography } from "@mui/material";
import {
  cloneElement,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useState,
} from "react";

import { Button } from "../../button";
import {
  ArrowLeftIcon,
  CommentDotsIcon,
  ContentfulIcon,
  GithubIcon,
  HashIcon,
  SanityIcon,
  StrapiIcon,
  WordPressIcon,
} from "../../icons";
import { Modal } from "../../modal/modal";
import { Input } from "./input";
import { VoteCastModal } from "./vote-cast-modal";
import { VoteEmailInput } from "./vote-email-input";

export interface ApplicationBadgeProps {
  icon: ReactElement;
  name: string;
}

const ApplicationBadge: FunctionComponent<ApplicationBadgeProps> = ({
  icon,
  name,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {cloneElement(icon, { sx: { height: 88, width: "unset" } })}

      <Typography sx={{ mt: 2.25, fontSize: 16 }}>{name}</Typography>
    </Box>
  );
};

const ApplicationBadgeButton: FunctionComponent<
  ApplicationBadgeProps & { onClick: () => void }
> = ({ onClick, ...props }) => {
  return (
    <Button
      color="inherit"
      onClick={onClick}
      sx={{
        borderRadius: 2.5,
        background: "transparent",
        p: 0,
        "&:hover": {
          background: "#F4F3FF !important",
        },
      }}
    >
      <ApplicationBadge {...props} />
    </Button>
  );
};

export enum ApplicationIds {
  Sanity = "ECO_SANITY",
  Strapi = "ECO_STRAPI",
  Contentful = "ECO_CONFUL",
  Github = "ECO_GITHUB",
  Other = "ECO_OTHER",
}

export interface Application {
  id: ApplicationIds;
  name: string;
  icon: ReactElement;
}

const otherApplication = {
  id: ApplicationIds.Other,
  name: "Other",
  icon: <CommentDotsIcon />,
};

export const applications: Application[] = [
  {
    id: ApplicationIds.Sanity,
    name: "Sanity",
    icon: <SanityIcon />,
  },
  {
    id: ApplicationIds.Strapi,
    name: "Strapi",
    icon: <StrapiIcon />,
  },
  {
    id: ApplicationIds.Contentful,
    name: "Contentful",
    icon: <ContentfulIcon />,
  },
  {
    id: ApplicationIds.Github,
    name: "Github",
    icon: <GithubIcon />,
  },
  otherApplication,
];

export const RequestAnotherApplication = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [otherEA, setOtherEA] = useState<string | null>(null);
  const [displayModal, setDisplayModal] = useState(true);

  const resetFlow = () => {
    setSelectedApplication(null);
    setOtherEA(null);
  };

  return (
    <Box
      sx={{
        fontFamily: "Inter",
        textAlign: "center",
        width: 1,
      }}
    >
      <Box mb={6}>
        <Typography
          sx={{ fontSize: "2rem", lineHeight: 1, fontWeight: 900, mb: 1 }}
        >
          Request another application
        </Typography>

        <Typography
          component="div"
          sx={{
            fontSize: "2rem",
            lineHeight: 1,
            color: ({ palette }) => palette.gray[50],
          }}
        >
          Where would you like to use the <strong>Þ</strong> next?
        </Typography>
      </Box>

      <Box
        sx={({ breakpoints }) => ({
          display: "inline-flex",
          width: 1,
          [breakpoints.down("lg")]: {
            flexDirection: "column",
          },
        })}
      >
        <Box
          sx={({ breakpoints }) => ({
            pr: 4.875,
            borderRight: ({ palette }) => `1px solid ${palette.gray[30]}`,

            [breakpoints.down("lg")]: {
              pr: 0,
              pb: 1.5,
              mb: 3,
              borderRightWidth: 0,
              borderBottom: ({ palette }) => `1px solid ${palette.gray[30]}`,
            },
          })}
        >
          <Typography
            variant="bpSmallCaps"
            sx={({ palette, breakpoints }) => ({
              color: palette.gray[90],
              mb: 3,
              fontWeight: 900,
              [breakpoints.up("lg")]: {
                textAlign: "left",
              },
            })}
          >
            Now in beta
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              gap: 2,
              opacity: selectedApplication || otherEA !== null ? 0.4 : 1,
              transition: ({ transitions }) => transitions.create("opacity"),
            }}
          >
            <ApplicationBadge icon={<HashIcon />} name="HASH" />
            <ApplicationBadge icon={<WordPressIcon />} name="Wordpress" />
          </Box>
        </Box>

        <Box
          sx={({ breakpoints }) => ({
            pl: 4.875,
            width: 1,
            [breakpoints.down("lg")]: {
              pl: 0,
            },
          })}
        >
          {!selectedApplication && otherEA === null ? (
            <>
              <Typography
                variant="bpSmallCaps"
                sx={({ palette, breakpoints }) => ({
                  color: palette.gray[90],
                  mb: 3,
                  fontWeight: 900,

                  [breakpoints.up("lg")]: {
                    textAlign: "left",
                  },
                })}
              >
                Vote for What’s Next
              </Typography>

              <Box sx={{ display: "inline-flex", gap: 2 }}>
                {applications.map((application) => (
                  <ApplicationBadgeButton
                    key={application.id}
                    name={application.name}
                    icon={application.icon}
                    onClick={() =>
                      application.id === ApplicationIds.Other
                        ? setOtherEA("")
                        : setSelectedApplication(application)
                    }
                  />
                ))}
              </Box>
            </>
          ) : null}

          {!selectedApplication && otherEA !== null ? (
            <Box
              sx={({ breakpoints }) => ({
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                flex: 1,
                [breakpoints.down("lg")]: {
                  display: "inline-flex",
                },
              })}
            >
              <Typography
                variant="bpBodyCopy"
                sx={({ palette, breakpoints }) => ({
                  color: palette.gray[90],
                  mb: 4,
                  fontSize: 16,
                  fontWeight: 900,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  [breakpoints.up("lg")]: {
                    textAlign: "left",
                  },
                })}
              >
                Suggest another application
              </Typography>

              <Typography
                variant="bpBodyCopy"
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1,
                  mb: 2,
                  color: ({ palette }) => palette.common.black,
                }}
              >
                What application would you like to use the Þ in? 👀
              </Typography>

              <Input
                placeholder="Enter the app’s name here"
                value={otherEA}
                onChange={({ target }) => {
                  setOtherEA(target.value);
                }}
                buttonLabel="Suggest app"
                handleSubmit={() => setSelectedApplication(otherApplication)}
              />

              <Typography
                variant="bpBodyCopy"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  fontWeight: 700,
                  color: ({ palette }) => palette.purple[70],
                  cursor: "pointer",
                }}
                onClick={resetFlow}
              >
                <ArrowLeftIcon sx={{ fontSize: "inherit", mr: 0.5 }} />
                Go back and vote for a different application
              </Typography>
            </Box>
          ) : null}

          {selectedApplication ? (
            <Box
              sx={({ breakpoints }) => ({
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                flex: 1,
                [breakpoints.down("lg")]: {
                  display: "inline-flex",
                },
              })}
            >
              <Typography
                variant="bpBodyCopy"
                sx={({ palette, breakpoints }) => ({
                  color: palette.gray[90],
                  mb: 4,
                  fontSize: 16,
                  fontWeight: 900,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  [breakpoints.up("lg")]: {
                    textAlign: "left",
                  },
                })}
              >
                {otherEA === null ? (
                  "Make your vote count"
                ) : (
                  <>
                    <Box component="span" sx={{ fontWeight: 400 }}>
                      You are suggesting{" "}
                    </Box>{" "}
                    {otherEA}
                  </>
                )}
              </Typography>

              {otherEA === null ? (
                <Typography
                  variant="bpBodyCopy"
                  sx={{
                    lineHeight: 1,
                    color: ({ palette }) => palette.common.black,
                    mb: 2,
                  }}
                >
                  You’ve chosen to vote for
                  <strong> {selectedApplication.name}</strong>
                  {cloneElement(selectedApplication.icon, {
                    sx: { height: 24, width: "unset", ml: 1.5, mb: 0.125 },
                  })}
                </Typography>
              ) : null}

              <Typography
                variant="bpBodyCopy"
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1,
                  mb: 1,
                  color: ({ palette }) => palette.common.black,
                }}
              >
                Enter your email address below to submit your vote
              </Typography>
              <Typography
                variant="bpBodyCopy"
                sx={{
                  fontSize: 14,
                  lineHeight: 1,
                  color: ({ palette }) => palette.gray[50],
                  mb: 2,
                }}
              >
                We’ll let you know when the Block Protocol arrives{" "}
                {otherEA === null ? `in ${selectedApplication.name}` : ""} 💯
              </Typography>

              <VoteEmailInput
                applicationId={selectedApplication.id}
                other={otherEA}
                onSubmit={() => setDisplayModal(true)}
              />

              <Typography
                variant="bpBodyCopy"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  lineHeight: 1,
                  fontWeight: 700,
                  color: ({ palette }) => palette.purple[70],
                  cursor: "pointer",
                }}
                onClick={resetFlow}
              >
                <ArrowLeftIcon sx={{ fontSize: "inherit", mr: 0.5 }} />
                Go back and vote for a different application
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>

      <VoteCastModal
        open={displayModal}
        onClose={() => setDisplayModal(false)}
      />
    </Box>
  );
};
