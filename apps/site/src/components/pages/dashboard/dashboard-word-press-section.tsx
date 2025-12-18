import { faEye } from "@fortawesome/free-regular-svg-icons";
import { Box, Stack, Typography, typographyClasses } from "@mui/material";
import { useState } from "react";

import { apiClient } from "../../../lib/api-client";
import { CODE_FONT_FAMILY } from "../../../theme/typography";
import { Button } from "../../button";
import { CopyToClipboardButton } from "../../copy-to-clipboard-button";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

const defaultApiKey =
  "b10ck5.00000000000000000000000000000000.00000000-0000-0000-0000-000000000000";

export const DashboardWordPressSection = ({
  wordpressSettingsUrl,
}: {
  wordpressSettingsUrl: string;
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generateApiKey = () => {
    if (generating) {
      return;
    }

    setGenerating(true);
    void apiClient
      .generateApiKey({ displayName: "WordPress" })
      .then(({ data }) => {
        setGenerating(false);
        if (data) {
          setApiKey(data.apiKey);
          void navigator.clipboard.writeText(data.apiKey);
        }
      });
  };

  return (
    <>
      <Typography
        mb={2}
        mt={4}
        variant="bpSmallCaps"
        sx={{ color: "purple.70" }}
        fontWeight={500}
      >
        Getting Started
      </Typography>
      <Box
        sx={(theme) => ({
          borderRadius: 1.5,
          overflow: "hidden",
          background: "white",
          boxShadow: theme.shadows[2],
        })}
      >
        <Box
          sx={{
            background: "linear-gradient(to right, #0E0135 0%, #2B1A5C 100%)",
            py: 3,
            px: 4,
          }}
        >
          <Typography variant="bpHeading4" color="white">
            Copy and paste the below key into WordPress
          </Typography>
        </Box>
        <Stack
          sx={{
            py: 4,
            px: 4,
            [`.${typographyClasses.root}`]: { maxWidth: "none" },
          }}
        >
          <Typography mb={3}>
            <Box component="span" fontWeight={700}>
              Click or tap
            </Box>{" "}
            to copy the key below to your clipboard, then head back to your{" "}
            <Link
              href={wordpressSettingsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              WordPress dashboard
            </Link>{" "}
            to paste it in.
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            sx={(theme) => ({
              py: 1,
              px: 2,
              backgroundColor: theme.palette.gray[10],
              borderRadius: 1.5,
              mb: 3,
              border: 1,
              borderColor: theme.palette.gray[20],
              maxWidth: "max-content",
              minHeight: 56,

              ...(apiKey
                ? {}
                : {
                    cursor: "pointer",
                    userSelect: "none",
                  }),
            })}
            gap={3}
            onClick={
              apiKey
                ? undefined
                : (evt) => {
                    evt.preventDefault();

                    generateApiKey();
                  }
            }
          >
            <Typography
              sx={(theme) => ({
                minWidth: "76ch",
                fontFamily: CODE_FONT_FAMILY,
                ...(apiKey
                  ? {
                      cursor: "pointer",
                      color: theme.palette.gray[70],
                    }
                  : {
                      userSelect: "none",
                      pointerEvents: "none",
                      filter: "blur(6px)",
                      color: theme.palette.purple[70],
                    }),
              })}
              onClick={
                apiKey
                  ? (evt) => {
                      evt.preventDefault();
                      const selection = window.getSelection();
                      if (selection) {
                        const range = document.createRange();
                        range.selectNodeContents(evt.currentTarget);
                        selection.removeAllRanges();
                        selection.addRange(range);
                      }
                    }
                  : undefined
              }
            >
              {apiKey ?? defaultApiKey}
            </Typography>
            <Stack direction="row" justifyContent="flex-end" minWidth="172px">
              {apiKey ? (
                <CopyToClipboardButton copyText={apiKey} />
              ) : (
                <Button
                  variant="tertiary"
                  color="gray"
                  squared
                  startIcon={<FontAwesomeIcon icon={faEye} />}
                  loading={generating}
                  size="small"
                  onClick={generateApiKey}
                >
                  Reveal API Key
                </Button>
              )}
            </Stack>
          </Stack>
          <Typography mb={2} fontWeight={700}>
            You won’t be able to see this key again. Save it somewhere secure,
            and keep it secret.
          </Typography>
          <Typography>
            If you ever need to generate a new key you can do so by visiting the{" "}
            <Link href="/account/api">API Keys</Link> page.
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
