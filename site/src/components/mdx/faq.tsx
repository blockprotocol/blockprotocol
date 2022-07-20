import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  accordionSummaryClasses,
  Typography,
  typographyClasses,
} from "@mui/material";
import { FunctionComponent, ReactNode, useState } from "react";
import slugify from "slugify";

import { Link } from "../link";
import { usePageHeading } from "./shared/use-page-heading";
import { stringifyChildren } from "./shared/util";

type FAQProps = {
  children?: ReactNode;
  anchor?: string;
  question?: ReactNode;
};

export const FAQ: FunctionComponent<FAQProps> = ({
  question,
  children,
  ...props
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const anchor =
    props.anchor ??
    slugify(stringifyChildren(question), {
      lower: true,
    });

  const { headingRef } = usePageHeading({ anchor });

  return (
    <Accordion
      expanded={expanded}
      sx={{
        boxShadow: "none",
        "&:first-child": {
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
      <AccordionDetails sx={{ padding: 0, marginTop: 1, marginBottom: 4 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
