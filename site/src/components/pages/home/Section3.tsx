import {
  Container,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Spacer } from "../../Spacer";

const TodoList = () => {
  return (
    <Box
      sx={{
        width: 290,
        p: 3,
        backgroundColor: "white",
        boxShadow: 1,
        borderRadius: 0.75,
      }}
    >
      {[
        "Fix color contrast",
        "Implement sidebar",
        "Write tests",
        "Review latest PRs",
      ].map((text, index) => (
        <Box key={text}>
          <FormControlLabel
            control={
              <Checkbox
                sx={{ padding: 0, pr: 1.5 }}
                checked={[2, 3].includes(index)}
              />
            }
            label={text}
          />
        </Box>
      ))}
    </Box>
  );
};

const Table = () => {
  return (
    <Grid
      container
      sx={{
        borderRadius: 0.75,
        border: ({ palette }) => `1px solid ${palette.purple[300]}`,
        width: 438,
        color: ({ palette }) => palette.purple[300],
      }}
      columns={12}
    >
      {[
        ["item: Fix color contrast", "complete: false"],
        ["item: Implement sidebar", "complete: false"],
        ["item: Write tests", "complete: true"],
        ["item: Review latest PRS", "complete: true"],
      ].map(([col0, col1]) => (
        <>
          <Grid
            sx={{
              py: 1.5,
              px: 3,
              borderRight: ({ palette }) => `1px solid ${palette.purple[300]}`,
              borderBottom: ({ palette }) => `1px solid ${palette.purple[300]}`,
              "&:last-of-type": {
                borderBottom: "none",
              },
            }}
            item
            xs={7}
          >
            <Box>{col0}</Box>
          </Grid>
          <Grid
            sx={{
              py: 1.5,
              px: 3,
              borderBottom: ({ palette }) => `1px solid ${palette.purple[300]}`,
              "&:last-of-type": {
                borderBottom: "none",
              },
            }}
            item
            xs={5}
          >
            <Box>{col1}</Box>
          </Grid>
        </>
      ))}
    </Grid>
  );
};

export const Section3 = () => {
  return (
    <Box
      sx={{
        pt: 20,
        position: "relative",
        "&:after": {
          content: `""`,
          position: "absolute",
          top: "450px",
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(99.32% 99.32% at 50% 0.68%, #3F4553 0.52%, #1C1B25 100%)`,
          zIndex: 1,
        },
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ width: "55%", textAlign: "center" }}>
          <Typography variant="bpHeading2" mb={3}>
            Why would I want to build blocks with the block protocol?
          </Typography>
          <Typography mb={4}>
            Blocks built with the <strong>block protocol</strong> can easily
            pass data between applications because the data within each block is{" "}
            <strong>structured.</strong>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* 1 */}
          <TodoList />
          <Spacer height={13} />

          {/* 2  */}
          <Typography color="white" mb={3}>
            {/* use a percentage here instead of breaking it with br */}
            We could pull in data from a checklist <br /> block our favorite
            to-do app...
          </Typography>
          <TodoList />
          <Spacer height={18} />

          {/* 3  */}
          <Typography color="purple.200" mb={3}>
            {/* use a percentage here instead of breaking it with br */}
            which maps onto an{" "}
            <Box
              sx={{
                color: ({ palette }) => palette.purple[400],
                fontWeight: 700,
              }}
              component="span"
            >
              ItemList
            </Box>{" "}
            schema...
          </Typography>
          <Table />
          <Spacer height={18} />

          {/* 4 */}
          <Typography color="purple.200" mb={3}>
            {/* use a percentage here instead of breaking it with br */}
            and access that same list in a
            <Box
              sx={{
                color: ({ palette }) => palette.purple[400],
                fontWeight: 700,
              }}
              component="span"
            >
              Table
            </Box>
            or
            <Box
              sx={{
                color: ({ palette }) => palette.purple[400],
                fontWeight: 700,
              }}
              component="span"
            >
              Kanban
            </Box>
            block in other applications
          </Typography>
          <Table />
        </Box>
      </Container>
    </Box>
  );
};
