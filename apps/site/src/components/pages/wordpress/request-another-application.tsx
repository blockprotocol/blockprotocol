import { Box, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { VoteCastModal } from "./vote-cast-modal";
import { AlreadyVotedScreen } from "./voting/already-voted-screen";
import { Application, ApplicationId } from "./voting/applications";
import { EnterEmailScreen } from "./voting/enter-email-screen";
import { NowInBeta } from "./voting/now-in-beta";
import { SelectApplicationScreen } from "./voting/select-application-screen";
import { SuggestAnotherApplicationScreen } from "./voting/suggest-another-application-screen";

export const RequestAnotherApplication = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [modalTwitterHref, setModalTwitterHref] = useState("");
  const [suggestionName, setSuggestionName] = useState<string>("");
  const [displayModal, setDisplayModal] = useState(false);
  const [votes, setVotes] = useState<ApplicationId[]>([]);

  const votingScreenRef = useRef<HTMLDivElement | null>(null);
  const [votingScreenHeight, setVotingScreenHeight] = useState(0);

  const resetFlow = () => {
    setSelectedApplication(null);
    setSuggestionName("");
  };

  const resizeVotingScreen = () => {
    if (votingScreenRef.current) {
      setVotingScreenHeight(votingScreenRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    const localVotes = localStorage.getItem("WP_Application_votes")
      ? JSON.parse(localStorage.getItem("WP_Application_votes") ?? "")
      : [];
    setVotes(localVotes);

    window.addEventListener("resize", resizeVotingScreen);
    return () => {
      window.removeEventListener("resize", resizeVotingScreen);
    };
  }, []);

  useLayoutEffect(() => {
    resizeVotingScreen();
  });

  const isSuggesting =
    selectedApplication && selectedApplication.id === "ECO_OTHER";
  const alreadyVotedForApplication =
    !isSuggesting &&
    selectedApplication &&
    votes.includes(selectedApplication.id);

  return (
    <Box
      sx={{
        fontFamily: "Inter",
        textAlign: "center",
        width: 1,
        overflow: "hidden",
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
        <NowInBeta faded={!!selectedApplication} />

        <Box
          sx={({ transitions }) => ({
            height: votingScreenHeight,
            transition: transitions.create("height"),
          })}
        >
          <Box
            ref={votingScreenRef}
            sx={({ breakpoints }) => ({
              pl: 4.875,
              width: 1,
              [breakpoints.down("lg")]: {
                pl: 0,
              },
            })}
          >
            {!selectedApplication ? (
              <SelectApplicationScreen
                votes={votes}
                onSelect={(application: Application) =>
                  setSelectedApplication(application)
                }
              />
            ) : null}

            {selectedApplication && !isSuggesting ? (
              !alreadyVotedForApplication ? (
                <EnterEmailScreen
                  title="Make your vote count"
                  selectedApplication={selectedApplication}
                  sumbitHandler={() => {
                    setModalTwitterHref(selectedApplication.twitterHref ?? "");
                    setDisplayModal(true);
                    const newVotes = [...votes, selectedApplication.id];
                    setVotes(newVotes);
                    localStorage.setItem(
                      "WP_Application_votes",
                      JSON.stringify(newVotes),
                    );

                    resetFlow();
                  }}
                  errorHandler={resizeVotingScreen}
                  goBackHandler={resetFlow}
                />
              ) : (
                <AlreadyVotedScreen
                  selectedApplication={selectedApplication}
                  goBackHandler={resetFlow}
                />
              )
            ) : null}

            {selectedApplication && isSuggesting ? (
              !suggestionName ? (
                <SuggestAnotherApplicationScreen
                  submitHandler={(applicationName: string) => {
                    setSuggestionName(applicationName);
                    resizeVotingScreen();
                  }}
                  goBackHandler={resetFlow}
                />
              ) : (
                <EnterEmailScreen
                  title={
                    <>
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 500,
                          color: ({ palette }) => palette.gray[50],
                        }}
                      >
                        You are suggesting
                      </Box>{" "}
                      {suggestionName}
                    </>
                  }
                  selectedApplication={selectedApplication}
                  suggestionName={suggestionName}
                  sumbitHandler={() => {
                    setModalTwitterHref(selectedApplication.twitterHref ?? "");
                    setDisplayModal(true);

                    resetFlow();
                  }}
                  errorHandler={resizeVotingScreen}
                  goBackHandler={resetFlow}
                />
              )
            ) : null}
          </Box>
        </Box>
      </Box>

      <VoteCastModal
        open={displayModal}
        onClose={() => setDisplayModal(false)}
        twitterButtonHref={modalTwitterHref}
      />
    </Box>
  );
};
