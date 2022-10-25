import _SearchIcon from "@mui/icons-material/Search.js";
import { Chip, chipClasses, modalClasses, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

import { Button } from "./button.jsx";
import { Modal } from "./modal/modal.jsx";
import { Search } from "./pages/docs/search/index.jsx";

const SearchIcon = _SearchIcon as unknown as typeof _SearchIcon.default;

export const SearchNavButton = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        // Do not trigger search when user is typing in an input field
        const { nodeName } = (event.target as HTMLElement | undefined) ?? {};
        if (nodeName === "INPUT" || nodeName === "TEXTAREA") {
          return;
        }

        event.preventDefault();
        setDisplayModal((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        sx={{
          height: 40,
          color: theme.palette.gray[50],
          fill: theme.palette.gray[50],
          fontSize: 15,
          padding: 0.5,
          paddingLeft: 1.5,
          boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          marginRight: 3,
          "&::before": {
            borderColor: theme.palette.gray[30],
            position: "absolute",
            left: 0,
          },
          "&:hover, :focus-visible": {
            color: theme.palette.purple[800],
            fill: theme.palette.purple[800],
            background: theme.palette.common.white,
            boxShadow:
              "0px 4px 11px rgba(39, 50, 86, 0.04), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.08), 0px 0.5px 1px rgba(39, 50, 86, 0.15)",
          },
        }}
        startIcon={
          <SearchIcon
            sx={{
              fill: "inherit",
              width: 22,
              height: 22,
            }}
          />
        }
        variant="tertiary"
        squared
        onClick={() => setDisplayModal(true)}
      >
        Search
        <Chip
          label="/"
          sx={({ palette }) => ({
            color: palette.gray[60],
            background: palette.gray[20],
            borderRadius: 0.5,
            fontSize: 15,
            marginLeft: 2.5,
            [`& .${chipClasses.label}`]: {
              paddingX: 1.5,
              paddingY: 1,
              fontWeight: 800,
            },
          })}
        />
      </Button>

      <Modal
        data-testid="bp-search-modal"
        sx={{
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
        open={displayModal}
        onClose={() => setDisplayModal(false)}
      >
        <Search variant="desktop" closeModal={() => setDisplayModal(false)} />
      </Modal>
    </>
  );
};
