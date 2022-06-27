import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FC, ReactNode, useState } from "react";
import slugify from "slugify";

import { Link } from "../link";
import { usePageHeading } from "./shared/use-page-heading";
import { stringifyChildren } from "./shared/util";

type FAQProps = {
  question: ReactNode;
};

export const FAQ: FC<FAQProps> = ({ question, children }) => {
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
      }}
    >
      <Link href={`#${anchor}`}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={(event) => {
            if (expanded) {
              event.stopPropagation();
            }
            setExpanded(!expanded);
          }}
          sx={{ padding: 0 }}
        >
          <Typography ref={headingRef} variant="bpHeading4" component="h3">
            {question}
          </Typography>
        </AccordionSummary>
      </Link>
      <AccordionDetails sx={{ padding: 0, marginTop: 1, marginBottom: 2 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
