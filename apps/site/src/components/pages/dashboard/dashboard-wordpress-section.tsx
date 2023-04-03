import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { Box, Stack, Typography, typographyClasses } from "@mui/material";
import { useRef, useState } from "react";

import { apiClient } from "../../../lib/api-client";
import { Button } from "../../button";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

const defaultApiKey =
  "b10ck5.9faa5da6664f7229999439d5433d4ac2.c549e923-c3b6-451f-baba-20b391e6033d";

export const DashboardWordpressSection = ({
  wordpressInstanceUrl,
}: {
  wordpressInstanceUrl: string;
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const copiedTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);

  const copyKey = (keyToCopy: string) => {
    void navigator.clipboard.writeText(keyToCopy);

    setCopied(true);

    if (copiedTimeout.current) {
      clearTimeout(copiedTimeout.current);
    }

    copiedTimeout.current = setTimeout(() => {
      setCopied(false);
    }, 3_000);
  };

  return (
    <>
      <Typography
        mb={2}
        mt={4}
        variant="bpSmallCaps"
        color={(theme) => theme.palette.purple[70]}
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
            {/** @todo link wordpress */}
            <Box component="span" fontWeight={700}>
              Click or tap
            </Box>{" "}
            to copy the key below to your clipboard, then head back to your{" "}
            <Link
              href={wordpressInstanceUrl}
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
            })}
            gap={3}
          >
            <Typography
              sx={(theme) => ({
                color: theme.palette.gray[70],
                minWidth: "76ch",
                ...(apiKey
                  ? {
                      cursor: "pointer",
                    }
                  : {
                      userSelect: "none",
                      filter: "blur(6px)",
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
                <Button
                  variant="tertiary"
                  color="gray"
                  squared
                  startIcon={<FontAwesomeIcon icon={faClipboard} />}
                  onClick={() => copyKey(apiKey)}
                  disabled={copied}
                  size="small"
                >
                  {copied ? "Copied" : "Copy to clipboard"}
                </Button>
              ) : (
                <Button
                  variant="tertiary"
                  color="gray"
                  squared
                  startIcon={<FontAwesomeIcon icon={faAdd} />}
                  loading={generating}
                  size="small"
                  onClick={() => {
                    if (generating) {
                      return;
                    }

                    setGenerating(true);
                    void apiClient
                      .generateApiKey({ displayName: "Wordpress" })
                      .then(({ data }) => {
                        setGenerating(false);
                        if (data) {
                          setApiKey(data.apiKey);
                          copyKey(data.apiKey);
                        }
                      });
                  }}
                >
                  Generate API Key
                </Button>
              )}
            </Stack>
          </Stack>
          <Typography mb={2} fontWeight={700}>
            You won’t be able to see this key again. Save it some where secure,
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
