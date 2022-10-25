import _ExpandMoreIcon from "@mui/icons-material/ExpandMore.js";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  accordionSummaryClasses,
  Typography,
  typographyClasses,
} from "@mui/material";
import { FunctionComponent, ReactNode, useState } from "react";
import _slugify from "slugify";

import { Link } from "../link.jsx";
import { usePageHeading } from "./shared/use-page-heading.js";
import { stringifyChildren } from "./shared/util.js";

const ExpandMoreIcon =
  _ExpandMoreIcon as unknown as typeof _ExpandMoreIcon.default;
const slugify = _slugify as unknown as typeof _slugify.default;

type FAQProps = {
  children?: ReactNode;
  question?: ReactNode;
};

export const FAQ: FunctionComponent<FAQProps> = ({ question, children }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const anchor = slugify(stringifyChildren(question), {
    lower: true,
  });

  const { headingRef } = usePageHeading({ anchor });

  return (
    <Accordion
      expanded={expanded}
      sx={{
        boxShadow: "none",
        "&:first-of-type": {
          marginTop: -2,
        },
      }}
    >
      <Link
        href={`#${anchor}`}
        sx={(theme) => ({
          transition: theme.transitions.create("color"),
          ":hover": {
            [`.${typographyClasses.root}`]: {
              color: theme.palette.purple[600],
            },
          },
        })}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={(event) => {
            if (expanded) {
              event.stopPropagation();
            }
            setExpanded(!expanded);
          }}
          sx={{
            padding: 0,
            [`&.${accordionSummaryClasses.expanded} .${typographyClasses.root}`]:
              {
                color: ({ palette }) => palette.purple[600],
              },
          }}
        >
          <Typography ref={headingRef}>{question}</Typography>
        </AccordionSummary>
      </Link>
      <AccordionDetails
        sx={{
          padding: 0,
          marginTop: 1,
          marginBottom: 4,
          "& > *": { visibility: "inherit" },
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
