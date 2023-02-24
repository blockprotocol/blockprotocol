import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Collapse,
  Container,
  List,
  Stack,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FunctionComponent, ReactNode, useState } from "react";

import { FontAwesomeIcon } from "../../icons";
import { CustomLink } from "./custom-link";

const DescriptionTypography: FunctionComponent<TypographyProps> = ({
  children,
  ...props
}) => (
  <Typography
    {...props}
    variant="bpBodyCopy"
    sx={{
      lineHeight: 1.7,
      maxWidth: "unset",
    }}
  >
    {children}
  </Typography>
);

const FAQ_QUESTIONS = [
  {
    title: "Can free users access premium external services?",
    description: (
      <DescriptionTypography>
        Free users as well as paying users can benefit from blocks that utilize
        external services. All free users receive a limited number of credits
        for use each month, providing free access to ordinarily paid services
        including OpenAI DALL-E, GPT-3, and Mapbox for free. These allowances
        are more restrictive than those on the <i>Hobby</i> and <i>Pro</i>{" "}
        plans, but can allow for limited testing and use of services in blocks.
      </DescriptionTypography>
    ),
  },
  {
    title: "How does overage charging work?",
    description: (
      <>
        <DescriptionTypography>
          Charges for external services/API usage beyond the allowances included
          in a plan are billed in line with the rates shown on the{" "}
          <CustomLink href="/pricing">pricing</CustomLink> page. Every effort is
          taken to ensure these costs match the prices charged by the original
          service provider (e.g. OpenAI/Mapbox), and as a result these overage
          prices may be subject to change at any time. You can view the current
          active pricing for a service at any time by visiting this page. Upon
          the issuance of each invoice, a <strong>platform fee</strong> will be
          calculated based on the total amount of unpaid overage charges
          accrued, and appended to your bill. The platform fee you pay varies
          depending on your account tier:
        </DescriptionTypography>
        <List sx={{ marginLeft: 3, listStyle: "disc" }}>
          <li>
            <strong>Free</strong> - 30%
          </li>

          <li>
            <strong>Hobby</strong> - 25%
          </li>

          <li>
            <strong>Pro</strong> - 20%
          </li>
        </List>
        <DescriptionTypography>
          If you have any additional questions about overage charges, please{" "}
          <CustomLink href="/contact">contact us</CustomLink>
        </DescriptionTypography>
      </>
    ),
  },
  {
    title: "How do I upgrade from Hobby to Pro?",
    description: (
      <DescriptionTypography>
        While logged in to the <i>Hobby</i> account you wish to upgrade, you can
        upgrade at any time by navigating to your{" "}
        <CustomLink href="/settings/billing">Account Billing</CustomLink> page
        and clicking the “Upgrade” button under the “Plans” section.
        <br />
        <br /> If you experience any difficulty with this, please{" "}
        <CustomLink href="/contact">contact us</CustomLink>.
      </DescriptionTypography>
    ),
  },
  {
    title: "How can I downgrade from Pro to Hobby?",
    description: (
      <DescriptionTypography>
        While logged in to the <i>Pro</i> account you wish to downgrade,
        navigate to your <i>Account Billing</i> page and clicking the link next
        to the text that reads “Trying to cancel or downgrade?”
        <br /> <br /> If you experience any difficulty with this, please{" "}
        <CustomLink href="/contact">contact us</CustomLink>.
      </DescriptionTypography>
    ),
  },
  {
    title: "What is the process for canceling a paid subscription?",
    description: (
      <DescriptionTypography>
        You can end a paid subscription at any time by navigating to your
        <i>Account Billing</i> page while logged in, and clicking the link next
        to the text that reads “Trying to cancel or downgrade?”
        <br />
        <br /> If you experience any difficulty with this, please{" "}
        <CustomLink href="/contact">contact us</CustomLink>.
      </DescriptionTypography>
    ),
  },
  {
    title:
      "A service provider’s pricing appears different to the cost shown on this page - what should I do?",
    description: (
      <DescriptionTypography>
        This is an error, and is most likely the result of a change in the price
        charged by the original service provider. Please{" "}
        <CustomLink href="/contact">contact us</CustomLink>, and we’ll send a
        special something your way as a token of our thanks!
      </DescriptionTypography>
    ),
  },
  {
    title: "Can I change the payment method associated with my account?",
    description: (
      <DescriptionTypography>
        Yes! Provided you already have a payment method associated with your
        account you can navigate to your{" "}
        <CustomLink href="/settings/billing">Account Billing</CustomLink> page
        and click “Change payment method” in the top-right of the main section.
        If you see a message that says “Upgrade to get more” instead, you can
        add a payment method by first upgrading your account to <i>Hobby</i> or{" "}
        <i>Pro</i>.
      </DescriptionTypography>
    ),
  },
  {
    title: "Can I change my tax information?",
    description: (
      <DescriptionTypography>
        Yes. This will soon be possible from the{" "}
        <CustomLink href="/settings/billing">Account Billing</CustomLink> page.
        In the meantime, please{" "}
        <CustomLink href="/contact">contact us</CustomLink>.
      </DescriptionTypography>
    ),
  },
  {
    title: "Can I get a tax receipt?",
    description: (
      <DescriptionTypography>
        Yes, please navigate to your{" "}
        <CustomLink href="/settings/billing">Account Billing</CustomLink> page
        and scroll down to the “Payment History” section. If you cannot see
        this, please <CustomLink href="/contact">contact us</CustomLink> for a
        manually-issued receipt.
      </DescriptionTypography>
    ),
  },
];

const Question: FunctionComponent<{
  title: string;
  description: ReactNode;
}> = ({ title, description }) => {
  const [expanded, setExpanded] = useState(false);

  const words = title.split(" ");
  const lastWord = words.pop();
  const restOfSentence = words.join(" ");

  return (
    <Box sx={{ mb: { xs: 2, md: 3 } }}>
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
        {restOfSentence}{" "}
        <Box component="span" sx={{ whiteSpace: "nowrap" }}>
          {lastWord}
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
        </Box>
      </Typography>

      <Collapse in={expanded}>{description}</Collapse>
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
          padding: { xs: 2.5, md: 4.25 },
          justifyContent: "center",
          alignItems: "flex-start",
          borderRadius: 4,
          boxShadow: "0px 4.23704px 8.1px rgb(61 78 133 / 6%)",
        })}
      >
        <Box sx={{ paddingX: { xs: 0, md: 1.5 } }}>
          {FAQ_QUESTIONS.map((question) => (
            <Question key={question.title} {...question} />
          ))}
        </Box>
      </Stack>
    </Container>
  );
};
