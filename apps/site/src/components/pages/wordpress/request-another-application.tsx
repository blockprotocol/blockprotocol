import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import {
  cloneElement,
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";

import { Button } from "../../button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CommentDotsIcon,
  ContentfulIcon,
  FontAwesomeIcon,
  GithubIcon,
  HashIcon,
  SanityIcon,
  StrapiIcon,
  WordPressIcon,
} from "../../icons";
import { Input } from "./input";
import { VoteCastModal } from "./vote-cast-modal";
import { VoteEmailInput } from "./vote-email-input";

export interface ApplicationBadgeProps {
  icon: ReactElement;
  name: string;
  alreadyVoted?: boolean;
}

const ApplicationBadge: FunctionComponent<ApplicationBadgeProps> = ({
  icon,
  name,
  alreadyVoted,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box position="relative">
        {cloneElement(icon, {
          sx: { height: 88, width: "unset", opacity: alreadyVoted ? 0.4 : 1 },
        })}

        {alreadyVoted ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: ({ palette }) => palette.gray[50],
            }}
          >
            <Typography
              variant="bpSmallCopy"
              sx={{
                color: "inherit",
                fontSize: 14,
                lineHeight: 1,
                textTransform: "uppercase",
                fontWeight: 700,
                mr: 0.5,
              }}
            >
              Voted
            </Typography>

            <FontAwesomeIcon icon={faCheck} />
          </Box>
        ) : null}
      </Box>

      <Typography
        sx={{
          mt: 2.25,
          fontSize: 16,
          color: ({ palette }) =>
            alreadyVoted ? palette.gray[50] : palette.common.black,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

const ApplicationBadgeButton: FunctionComponent<
  ApplicationBadgeProps & { onClick: () => void; alreadyVoted: boolean }
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
  twitterHref?: string;
}

const otherApplication = {
  id: ApplicationIds.Other,
  name: "Other",
  icon: <CommentDotsIcon />,
  twitterHref:
    "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20developing%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20What%20app%20would%20you%20like%20to%20see%20support%20in%20next%3F%20https%3A%2F%2Fblockprotocol.org%2Fwordpress",
};

export const applications: Application[] = [
  {
    id: ApplicationIds.Sanity,
    name: "Sanity",
    icon: <SanityIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40sanity_io%20support%20next%20at%20https%3A%2F%2Fblockprotocol.org%2Fwordpress",
  },
  {
    id: ApplicationIds.Strapi,
    name: "Strapi",
    icon: <StrapiIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40strapijs%20support%20next%20at%20https%3A%2F%2Fblockprotocol.org%2Fwordpress",
  },
  {
    id: ApplicationIds.Contentful,
    name: "Contentful",
    icon: <ContentfulIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20I%27ve%20voted%20for%20%40contentful%20support%20next%20at%20https%3A%2F%2Fblockprotocol.org%2Fwordpress",
  },
  {
    id: ApplicationIds.Github,
    name: "GitHub",
    icon: <GithubIcon />,
    twitterHref:
      "https://twitter.com/intent/tweet?text=The%20%40BlockProtocol%20is%20an%20open%20standard%20for%20building%20blocks%20which%20work%20across%20multiple%20apps%20(including%20WordPress).%20Join%20me%20in%20voting%20for%20%40GitHubNext%20support%20at%20https%3A%2F%2Fblockprotocol.org%2Fwordpress",
  },
  otherApplication,
];

export const RequestAnotherApplication = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [otherEA, setOtherEA] = useState<string | null>(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [votes, setVotes] = useState<ApplicationIds[]>([]);
  const [savedEA, setSavedEA] = useState("");

  const resetFlow = () => {
    setSelectedApplication(null);
    setOtherEA(null);
  };

  useEffect(() => {
    const localVotes = localStorage.getItem("WP_Application_votes")
      ? JSON.parse(localStorage.getItem("WP_Application_votes") ?? "")
      : [];
    setVotes(localVotes);

    setSavedEA(localStorage.getItem("WP_EA_Suggestion") ?? "");
  }, []);

  const alreadyVotedForApplication =
    selectedApplication && votes.includes(selectedApplication.id);
  const alreadySuggestedApplication =
    selectedApplication?.id === ApplicationIds.Other &&
    votes.includes(selectedApplication.id);

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

              <Box
                sx={{
                  display: "inline-flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {applications.map((application) => (
                  <ApplicationBadgeButton
                    key={application.id}
                    name={application.name}
                    icon={application.icon}
                    onClick={() =>
                      application.id === ApplicationIds.Other && !savedEA.length
                        ? setOtherEA("")
                        : setSelectedApplication(application)
                    }
                    alreadyVoted={votes.includes(application.id)}
                  />
                ))}
              </Box>
            </>
          ) : null}

          {!selectedApplication && otherEA !== null && !savedEA ? (
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
                {otherEA === null && !alreadySuggestedApplication ? (
                  "Make your vote count"
                ) : (
                  <>
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 500,
                        color: ({ palette }) => palette.gray[50],
                      }}
                    >
                      {alreadySuggestedApplication
                        ? "You previously suggested"
                        : "You are suggesting"}
                    </Box>{" "}
                    {savedEA.length ? savedEA : otherEA}
                  </>
                )}
              </Typography>

              {otherEA === null && !alreadySuggestedApplication ? (
                <Typography
                  variant="bpBodyCopy"
                  sx={{
                    lineHeight: 1,
                    color: ({ palette }) => palette.common.black,
                    mb: 2,
                  }}
                >
                  {alreadyVotedForApplication
                    ? "You previously voted for"
                    : "You’ve chosen to vote for"}
                  <strong> {selectedApplication.name}</strong>
                  {cloneElement(selectedApplication.icon, {
                    sx: { height: 24, width: "unset", ml: 1.5, mb: 0.125 },
                  })}
                </Typography>
              ) : null}

              {!alreadyVotedForApplication ? (
                <>
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
                    {otherEA === null ? `in ${selectedApplication.name}` : ""}{" "}
                    💯
                  </Typography>

                  <VoteEmailInput
                    applicationId={selectedApplication.id}
                    other={otherEA}
                    onSubmit={() => {
                      setDisplayModal(true);
                      const newVotes = [...votes, selectedApplication.id];
                      setVotes(newVotes);
                      localStorage.setItem(
                        "WP_Application_votes",
                        JSON.stringify(newVotes),
                      );

                      if (otherEA?.length) {
                        setSavedEA(otherEA);
                        localStorage.setItem("WP_EA_Suggestion", otherEA);
                      }
                      resetFlow();
                    }}
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
                </>
              ) : null}

              {alreadyVotedForApplication ? (
                <>
                  <Typography
                    variant="bpBodyCopy"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: 18,
                      lineHeight: 1,
                      fontWeight: 700,
                      color: ({ palette }) => palette.purple[70],
                      cursor: "pointer",
                      mb: 2,
                    }}
                    onClick={resetFlow}
                  >
                    Click here to cast your vote for an additional app
                    <ArrowRightIcon sx={{ fontSize: "inherit", ml: 0.5 }} />
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
                    Only one vote will be counted per person, per app.
                  </Typography>
                </>
              ) : null}
            </Box>
          ) : null}
        </Box>
      </Box>

      <VoteCastModal
        open={displayModal}
        onClose={() => setDisplayModal(false)}
        twitterButtonHref={selectedApplication?.twitterHref}
      />
    </Box>
  );
};
