import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Icon,
} from "@mui/material";
import { SyncIcon } from "../../SvgIcon/SyncIcon";

export const Section4 = () => {
  const theme = useTheme();

  const isDesktopSize = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        mb: { xs: 10, md: 20 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "", md: "space-between" },
          alignItems: { xs: "flex-start", md: "flex-end" },
          position: "relative",
          pt: 7,
          pb: { xs: 9, md: 0 },
          background: `#1C1B25`,
          overflowY: "hidden",
          color: ({ palette }) => ({
            xs: palette.common.white,
            md: palette.gray[60],
          }),
        }}
      >
        <Box
          sx={{
            flex: { xs: 1, md: 0.44 },
            position: "relative",
            zIndex: 3,
            mr: { xs: 2, md: 0 },
            mb: { xs: 3, md: 0 },
          }}
        >
          <Typography
            sx={{ py: 2, px: 3, fontWeight: "500" }}
            color="currentColor"
          >
            <Icon
              sx={{ fontSize: "inherit", mr: 1.25 }}
              className="fas fa-pencil"
            />
            Personal Notes
          </Typography>
          <Box
            sx={{ display: "block", width: "100%" }}
            component="img"
            src={
              isDesktopSize
                ? "/assets/realtime-left.svg"
                : "/assets/realtime-left-mobile.svg"
            }
          />
        </Box>
        <Box
          sx={{
            flex: { xs: 1, md: 0.44 },
            position: "relative",
            zIndex: 3,
            textAlign: { xs: "left", md: "right" },
            ml: { xs: 2, md: 0 },
            alignSelf: "flex-end",
          }}
        >
          <Typography
            sx={{ py: 2, px: 3, fontWeight: "500" }}
            color="currentColor"
          >
            <Icon
              sx={{ fontSize: "inherit", mr: 1.25 }}
              className="fas fa-check-circle"
            />
            Project Management App
          </Typography>
          <Box
            sx={{ display: "block", width: "100%" }}
            component="img"
            src={
              isDesktopSize
                ? "/assets/realtime-right.svg"
                : "/assets/realtime-right-mobile.svg"
            }
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            top: 0,
            transform: "translateX(-50%)",
            width: { xs: "80%", md: "27%" },
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
            display: { xs: "none", md: "block" },
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
          width: { xs: "90%", md: "30%" },
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
