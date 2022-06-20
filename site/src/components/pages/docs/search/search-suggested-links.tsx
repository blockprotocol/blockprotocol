import { Box, buttonClasses, Typography, useTheme } from "@mui/material";
import React from "react";

import { Button } from "../../../button";
import { SpecificationIcon } from "../../../icons";
import { LinkButton } from "../../../link-button";

interface SearchSuggestedLinksProps {
  setSearchText?: (text: string) => void;
  closeModal?: () => void;
}

const SUGGESTED_LINKS = [
  "Introduction to the Block Protocol",
  "Quick start guide to developing blocks",
  "Embed blocks within your site or app",
  "Frequently asked questions",
];

const SearchSuggestedLinks: React.VoidFunctionComponent<
  SearchSuggestedLinksProps
> = ({ setSearchText, closeModal }) => {
  const theme = useTheme();

  return (
    <Box sx={{ marginTop: 1.5 }}>
      <Typography
        sx={({ palette }) => ({
          fontWeight: 600,
          fontSize: 13,
          color: palette.gray[50],
          paddingY: 0.5,
          paddingX: 2,
          letterSpacing: "0.05em",
        })}
      >
        SUGGESTED TOPICS
      </Typography>

      {SUGGESTED_LINKS.map((label) => (
        <Button
          sx={{
            width: 1,
            justifyContent: "start",
            fontSize: 15,
            color: theme.palette.gray[90],
            paddingY: 0.5,
            paddingX: 2,
            "&:hover, :focus-visible": {
              color: theme.palette.purple[800],
              background: theme.palette.purple[100],
            },
            "&::before": {
              width: "auto",
            },
          }}
          key={label}
          variant="transparent"
          onClick={() => setSearchText?.(label)}
        >
          {label}
        </Button>
      ))}

      <LinkButton
        sx={{
          background: theme.palette.teal[100],
          alignItems: "start",
          padding: "12px 16px",
          borderRadius: 1,
          width: 1,
          justifyContent: "start",
          marginTop: 1.5,
          [`& .${buttonClasses.startIcon}`]: {
            color: theme.palette.teal[600],
            paddingTop: 0.5,
            paddingLeft: 0.5,
            marginRight: 1.5,
            marginLeft: 0,
          },
          "&:hover": {
            background: theme.palette.teal[200],
          },
          "&::before": {
            display: "none",
          },
        }}
        href="/spec"
        onClick={() => closeModal?.()}
        startIcon={<SpecificationIcon />}
        squared
      >
        <Box>
          <Typography
            sx={{
              color: theme.palette.teal[700],
              fontWeight: 600,
              fontSize: 15,
              textAlign: "start",
            }}
          >
            Read the official specification
          </Typography>
          <Typography
            sx={{
              color: theme.palette.teal[600],
              fontWeight: 500,
              fontSize: 14,
              textAlign: "start",
            }}
          >
            The open-source protocol for creating interoperable, data-driven
            blocks
          </Typography>
        </Box>
      </LinkButton>
    </Box>
  );
};

export default SearchSuggestedLinks;
