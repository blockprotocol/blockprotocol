import { Container, Typography, Box } from "@mui/material";
import { SyncIcon } from "../../SvgIcon/SyncIcon";

export const Section4 = () => {
  return (
    <Box
      sx={{
        mb: 20,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "", md: "space-between" },
          alignItems: { xs: "", md: "flex-end" },
          position: "relative",
          pt: 7,
          background: `#1C1B25`,
          overflowY: "hidden",
        }}
      >
        <Box
          sx={{ flex: { xs: 1, md: 0.44 }, position: "relative", zIndex: 3 }}
        >
          <Typography>Personal Notes</Typography>
          <Box
            sx={{ display: "block", width: "100%" }}
            component="img"
            src="/assets/realtime-left.svg"
          />
        </Box>
        <Box
          sx={{
            flex: { xs: 1, md: 0.44 },
            position: "relative",
            zIndex: 3,
            textAlign: { xs: "left", md: "right" },
          }}
        >
          <Typography>Project Management App</Typography>
          <Box
            sx={{ display: "block", width: "100%" }}
            component="img"
            src="/assets/realtime-right.svg"
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            top: 0,
            transform: "translateX(-50%)",
            width: "27%",
            background: `linear-gradient(179.75deg, #644CFF 0.21%, rgba(38, 39, 49, 0) 143.36%)`,
            filter: "blur(34px)",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        <Box
          component="img"
          src="/assets/realtime-center.svg"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            height: "100%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        />
      </Box>

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "30%",
          maxWidth: 450,
        }}
      >
        <Box
          sx={{
            height: 80,
            width: 80,
            borderRadius: 40,
            backgroundColor: ({ palette }) => palette.common.white,
            filter: `drop-shadow(0px -13px 11px rgba(0, 0, 0, 0.3))`,
            zIndex: 2,
            mt: -5,
            mb: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "& svg": {
              color: ({ palette }) => palette.purple[600],
              height: 44,
              width: 44,
            },
          }}
        >
          <SyncIcon />
        </Box>
        <Typography textAlign="center">
          Keep data in sync, get real-time updates, and integrate with any
          service that uses the protocol.
          <br />
          No extra configuration required
        </Typography>
      </Container>
    </Box>
  );
};
