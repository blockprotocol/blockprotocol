import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Box, Collapse, Container, Stack, Typography } from "@mui/material";
import { FunctionComponent, ReactNode, useState } from "react";

import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../link";

const FAQ_QUESTIONS = [
  {
    title: "Whodunnit?",
    description: (
      <>
        This is just example text{" "}
        <Link
          href=""
          sx={{
            color: ({ palette }) => `${palette.purple[70]} !important`,
            borderBottomWidth: "0px !important",
          }}
        >
          with a link in
        </Link>
        . You can ignore the copy here which exists for illustrative purposes
        only. It’s going to be about Cluedo. You really don’t need to read it.
      </>
    ),
  },
  {
    title: "Who is the real owner of Tudor Close?",
    description: <>And yes, multiple answers can be open at once.</>,
  },
  {
    title: "Did Professor Plum really blackmail Ambassador Peacock?",
    description: <>And yes, multiple answers can be open at once.</>,
  },
  {
    title:
      "Question 4 title is a big longer than the others and shows what happens when it bleeds over onto two lines. It will take a really long question to get this big, at least on desktop, but maybe not on mobile?",
    description: <>And yes, multiple answers can be open at once.</>,
  },
  {
    title:
      "Was it Miss Scarlett with the lead pipe in the dining room? No? Oh hell.",
    description: <>And yes, multiple answers can be open at once.</>,
  },
];

const Question: FunctionComponent<{
  title: string;
  description: ReactNode;
}> = ({ title, description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box mb={3}>
      <Typography
        onClick={() => setExpanded(!expanded)}
        variant="bpBodyCopy"
        sx={{
          cursor: "pointer",
          lineHeight: 1.4,
          fontWeight: 700,
          mb: 1,
          maxWidth: "unset",
        }}
      >
        {title}

        <FontAwesomeIcon
          icon={faChevronRight}
          sx={{
            ml: 1,
            mb: 0.25,
            fontSize: 12,
            transform: `rotate(${expanded ? 90 : 0}deg)`,
            transition: ({ transitions }) => transitions.create("transform"),
          }}
        />
      </Typography>

      <Collapse in={expanded}>
        <Typography
          variant="bpBodyCopy"
          sx={{
            lineHeight: 1.3,
            maxWidth: "unset",
          }}
        >
          {description}
        </Typography>
      </Collapse>
    </Box>
  );
};

export const FaqSection: FunctionComponent = () => {
  return (
    <Container
      sx={{
        position: "relative",
        mb: { xs: 8, md: 12.5 },
        maxWidth: { md: 800, lg: 1200 },
        px: "6.5%",
      }}
    >
      <Typography
        variant="bpHeading4"
        sx={{
          textTransform: "uppercase",
          mb: 2.5,
          lineHeight: 1.4,
          color: ({ palette }) => palette.gray[90],
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Stack
        sx={({ palette }) => ({
          background: `${palette.common.white}80`,
          border: `1px solid ${palette.gray[20]}`,
          backdropFilter: "blur(7.5px)",
          padding: 4.25,
          justifyContent: "center",
          alignItems: "flex-start",
          borderRadius: 4,
          boxShadow: "0px 4.23704px 8.1px rgb(61 78 133 / 6%)",
        })}
      >
        <Box sx={{ paddingX: 1.5 }}>
          {FAQ_QUESTIONS.map((question) => (
            <Question key={question.title} {...question} />
          ))}
        </Box>
      </Stack>
    </Container>
  );
};
