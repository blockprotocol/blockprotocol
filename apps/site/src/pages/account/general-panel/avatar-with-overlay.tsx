import {
  faFaceLaugh,
  faUpload as faUploadSolid,
} from "@fortawesome/free-solid-svg-icons";
import { Avatar, Box, Typography } from "@mui/material";
import { AnimatePresence, m } from "framer-motion";
import { DragEvent, useMemo, useState } from "react";

import { FontAwesomeIcon } from "../../../components/icons";
import { faUpload } from "../../../components/icons/pro/fa-upload";

const dangerBg =
  "linear-gradient(0deg, rgba(218, 42, 84, 0.33), rgba(218, 42, 84, 0.33))";
const dropBg =
  "linear-gradient(0deg, rgba(111, 89, 236, 0.85), rgba(111, 89, 236, 0.85))";

const AnimatedBox = m(Box);

type Mode = "idle" | "danger" | "drop";

interface AvatarWithOverlayProps {
  src?: string;
  mode: Mode;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

export const AvatarWithOverlay = ({
  src,
  mode: modeProp,
  onDrop,
  onDragOver,
}: AvatarWithOverlayProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [lastNonIdleMode, setLastNonIdleMode] = useState<Mode>("idle");

  const mode: Mode = useMemo(() => {
    const val = isDraggingOver ? "drop" : modeProp;

    if (val !== "idle") {
      setLastNonIdleMode(val);
    }

    return val;
  }, [isDraggingOver, modeProp]);

  return (
    <Box
      sx={{
        margin: 2,
        position: "relative",
        zIndex: 10,
        alignSelf: "center",
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDraggingOver(false);
        onDrop(event);
      }}
      onDragEnter={() => setIsDraggingOver(true)}
      onDragLeave={() => setIsDraggingOver(false)}
      onDragOver={onDragOver}
    >
      <Avatar
        src={src}
        sx={{
          pointerEvents: "none",
          width: 150,
          height: 150,
          backgroundColor: "gray.10",
          border: "1px solid",
          borderColor: "gray.30",
          position: "relative",

          transition: (theme) => theme.transitions.create("transform"),
          transform: isDraggingOver ? "scale(1.1)" : "scale(1)",

          "&:after": {
            content: '""',
            transition: (theme) => theme.transitions.create("opacity"),
            opacity: mode !== "idle" ? 1 : 0,
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            zIndex: 1,
            background: lastNonIdleMode === "drop" ? dropBg : dangerBg,
          },
        }}
      >
        <FontAwesomeIcon
          icon={faUploadSolid}
          sx={{
            transition: (theme) => theme.transitions.create("opacity"),
            opacity: mode === "drop" ? 1 : 0,
            position: "absolute",
            color: "gray.70",
            fontSize: 80,
          }}
        />
        <FontAwesomeIcon
          icon={faFaceLaugh}
          sx={{
            transition: (theme) => theme.transitions.create("opacity"),
            opacity: mode === "drop" ? 0 : 1,
            position: "absolute",
            color: "gray.40",
            fontSize: 80,
          }}
        />
      </Avatar>
      <AnimatePresence>
        {mode === "drop" && (
          <AnimatedBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {!!src && (
              <FontAwesomeIcon
                icon={faUpload}
                sx={{ color: "white", fontSize: 32 }}
              />
            )}
            <Typography
              sx={{
                whiteSpace: "pre-line",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >{`Drag file\nto upload`}</Typography>
          </AnimatedBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
