import { Container, Typography, Box } from "@mui/material";
import { VFC } from "react";
import { GetStaticProps } from "next";
import { BlockCard, BlockCardComingSoon } from "../components/BlockCard";
import { BlockMetadata, readBlocksFromDisk } from "./api/blocks.api";

interface PageProps {
  catalog: BlockMetadata[];
}

/**
 * used to create an index of all available blocks, the catalog
 */
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { catalog: readBlocksFromDisk() } };
};

const HubPage: VFC<PageProps> = ({ catalog }) => {
  return (
    <Box
      sx={{
        mb: 20,
        position: "relative",
        backgroundImage: "url(/assets/blockhub-gradient.svg)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "30% 50%",
        backgroundSize: "100% 100%",
      }}
    >
      <Container sx={{ padding: { xs: 0, sm: 16, md: 4 } }}>
        <Box
          sx={{
            mb: 10,
            pt: 8,
            width: { xs: "100%", sm: "80%", md: "65%" },
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            mb={{ xs: 2, md: 3 }}
            sx={{
              color: ({ palette }) => palette.purple[700],
              fontWeight: 700,
            }}
            variant="bpSmallCaps"
          >
            Block Hub
          </Typography>
          <Typography mb={3} variant="bpHeading1">
            Interactive, data-driven blocks to use in your projects
          </Typography>
          <Typography sx={{ color: ({ palette }) => palette.gray[60] }}>
            All open-source and free to use
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 288px)",
              lg: "repeat(3, 328px)",
            },
            gap: "32px",
            justifyContent: "center",
            justifyItems: { xs: "center", sm: "flex-start" },
            position: "relative",
            zIndex: 2,
          }}
        >
          {catalog
            ? catalog.map((block) => (
                <Box key={block.packagePath}>
                  <BlockCard data={block} />
                </Box>
              ))
            : Array.from(Array(6), (_, index) => index + 1).map((key) => (
                <Box key={key}>
                  <BlockCard loading />
                </Box>
              ))}
          {catalog && (
            <Box>
              <BlockCardComingSoon />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HubPage;
