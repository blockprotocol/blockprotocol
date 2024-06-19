import { Box, Container } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { MdxPageContent } from "../components/mdx/mdx-page-content";
import { getSerializedPage } from "../util/mdx-utils";

type AboutPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const serializedPage = await getSerializedPage({
    pathToDirectory: "about",
    parts: ["index"],
  });

  return {
    props: {
      serializedPage,
    },
  };
};

const AboutPage: NextPage<AboutPageProps> = ({ serializedPage }) => {
  return (
    <Box display="flex" alignItems="flex-start">
      <Container
        sx={{
          margin: "auto",
          marginTop: { xs: 5, md: 8 },
          width: "inherit",
          maxWidth: "100%",
        }}
      >
        <Box mb={4}>
          <MdxPageContent flexGrow={1} serializedPage={serializedPage} />
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
