import { Box, BoxProps, Fade, Popper, Typography } from "@mui/material";
import { FunctionComponent, useRef, useState } from "react";

type InlineLinkProps = {
  popperInfo?: { title?: string; content?: string };
} & BoxProps;

export const InlineLink: FunctionComponent<InlineLinkProps> = ({
  children,
  popperInfo,
  sx = [],
  ...boxProps
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const linkRef = useRef(null);
  const popperRef = useRef<HTMLDivElement>(null);

  if (linkRef.current && !anchorEl) {
    setAnchorEl(linkRef.current);
  }

  return (
    <Box
      {...boxProps}
      sx={[{ display: "inline" }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Box
        onMouseOver={() => setOpen(true)}
        onMouseLeave={(error) => {
          if (!popperRef.current) {
            return;
          }
          if (!popperRef.current.contains(error.currentTarget)) {
            setOpen(false);
          }
        }}
        ref={linkRef}
        sx={{
          color: ({ palette }) => palette.purple[600],
          fontWeight: "600",
          position: "relative",
          textDecoration: "none",
          cursor: "pointer",
          display: "inline",
          "&:after": {
            content: "''",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "10px",
            transform: "translateY(100%)",
            pointerEvents: "none",
            transition: "all 0.3s ease",
            background: () =>
              "linear-gradient(186.24deg, #BFA9F9 -37.93%, #FFF 95.07%)",
          },
          "&:hover": {
            "&:after": {
              transform: "translateY(0)",
              height: "100%",
              background: () =>
                "linear-gradient(186.24deg, #BFA9F9 -37.93%, #FFF 95.07%)",
            },
          },
        }}
      >
        {children}
      </Box>
      <Popper open={open} anchorEl={anchorEl} transition placement="top">
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box
              component="div"
              ref={popperRef}
              onMouseLeave={() => setOpen(false)}
              sx={{
                p: 2,
                mb: 2,
                boxShadow: 3,
                borderRadius: "4px",
                backgroundColor: "white",
                width: "245px",
                position: "relative",
                "&::before": {
                  content: "''",
                  position: "absolute",
                  top: "calc(100% - 6px)",
                  left: "50%",
                  width: 14,
                  height: 14,
                  backgroundColor: "white",
                  transform: "translateX(-50%) rotate(45deg)",
                },
              }}
            >
              <Typography sx={{ fontWeight: "700", mb: 1 }}>
                {popperInfo?.title}
              </Typography>
              <Typography>{popperInfo?.content}</Typography>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};
