import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  Box,
  MenuItem,
  Select,
  selectClasses,
  Typography,
} from "@mui/material";
import { NextSeo } from "next-seo";
import { FunctionComponent, ReactNode } from "react";

import { Button } from "../../components/button";
import { FontAwesomeIcon } from "../../components/icons";

const Section = ({
  children,
  title,
  description,
  titleEndContent,
}: {
  title: string;
  children: ReactNode;
  description: string;
  titleEndContent?: ReactNode;
}) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="bpHeading2" sx={{ fontSize: 28, mb: 1 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              color: "gray.70",
              maxWidth: "unset",
              fontSize: 15,
            }}
          >
            {description}
          </Typography>
        </Box>
        {!!titleEndContent && <Box>{titleEndContent}</Box>}
      </Box>
      {children}
    </div>
  );
};

const ContactSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Section title={title} description={description}>
      <Button
        href="/contact"
        squared
        variant="tertiary"
        size="small"
        color="gray"
      >
        Contact us to enable
      </Button>
    </Section>
  );
};

export const UsagePanel: FunctionComponent = () => {
  return (
    <>
      <NextSeo title="Block Protocol – Service Usage" />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 5.25 }}>
        <Section
          title="Service Usage"
          description="These keys allow you to access the Block Protocol from within other applications."
          titleEndContent={
            <Select
              sx={{
                height: "32px",
                [`.${selectClasses.icon}`]: { color: "gray.50" },
              }}
              value="1"
              startAdornment={
                <FontAwesomeIcon sx={{ color: "gray.80" }} icon={faCalendar} />
              }
            >
              <MenuItem value="1">This billing cycle</MenuItem>
            </Select>
          }
        >
          <Box sx={{ border: "1px solid gray", p: 2, mb: 2 }}>
            <Typography>Here will be the table</Typography>
          </Box>

          <Typography
            variant="bpSmallCopy"
            sx={{
              color: "gray.70",
              fontWeight: 400,
              fontSize: 13,
            }}
          >
            Your bill may exceed the total combined cost of all services due to
            cent-rounding, platform service charges and taxes
          </Typography>
        </Section>

        <ContactSection
          title="Service Analytics"
          description="View service raw request counts, response times, success/error data,
            filter by API key/user, and drill into service logs"
        />

        <ContactSection
          title="Block Analytics"
          description="View block usage and delivery analytics, including error reports, performance information and page speed metrics"
        />

        <ContactSection
          title="Activity Export"
          description="Download block, service, or all activity in CSV, JSON, or NDJSON format"
        />

        <ContactSection
          title="Activity Log Drain"
          description="Set up a log drain to forward JSON, NDJSON or Syslog formatted logs to a webhook"
        />
      </Box>
    </>
  );
};
