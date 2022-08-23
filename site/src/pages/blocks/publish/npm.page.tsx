import {
  faExternalLink,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {
  Alert,
  alertClasses,
  Box,
  Grid,
  Link,
  List,
  ListItem,
  Typography
} from "@mui/material";
import Head from "next/head";
import { PropsWithChildren, ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/button";
import { FontAwesomeIcon } from "../../../components/icons";
import { withAuthWall } from "../../../components/pages/auth-wall";
import { BlockFormLayout } from "../../../components/pages/blocks/block-form-layout";
import { BlockFormSection } from "../../../components/pages/blocks/block-form-section";
import { PageContainer } from "../../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../../components/pages/dashboard/top-navigation-tabs";
import { TextField } from "../../../components/text-field";

interface FormValues {
  npmURL: string;
  urlSlug: string;
}

const RequiredLabel = ({ children }: PropsWithChildren) => (
  <>
    {children}
    <Typography
      variant="bpMicroCopy"
      fontWeight="700"
      component="span"
      color={({ palette }) => palette.purple[700]}
      ml={1}
    >
      REQUIRED
    </Typography>
  </>
);

const FieldInfoWrapper = ({
  children,
  items,
  title
}: PropsWithChildren<{ title: string; items: ReactNode[] }>) => {
  return (
    <Grid container columnSpacing={4}>
      <Grid md={6} xs={12} item>
        {children}
      </Grid>
      <Grid md={6} xs={12} item mt={2}>
        <Typography
          variant="bpSmallCopy"
          fontWeight={400}
          color={({ palette }) => palette.gray[70]}
        >
          <List
            dense
            subheader={<b>{title}</b>}
            disablePadding
            sx={theme => ({
              li: {
                display: "list-item",
                listStyleType: "disc",
                listStylePosition: "inside",
                p: theme.spacing(0, 1)
              }
            })}
          >
            {items.map((item, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <ListItem key={i}>{item}</ListItem>
            ))}
          </List>
        </Typography>
      </Grid>
    </Grid>
  );
};

const PublishFromNPMPage = () => {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    mode: "onChange"
  });

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data));
  };

  return (
    <>
      <Head>
        <title>Block Protocol – Publish Block</title>
      </Head>

      <TopNavigationTabs />

      <PageContainer>
        <Typography variant="bpHeading2" mb={4}>
          Add a new block
        </Typography>

        <BlockFormLayout>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              gap: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
          >
            <Alert
              icon={<FontAwesomeIcon icon={faInfoCircle} />}
              severity="info"
              sx={{
                width: "100%",
                [`.${alertClasses.message}`]: {
                  flex: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  // justifyContent: "flex-end",
                  gap: 2
                }
              }}
            >
              <Box flexGrow={1}>
                <Typography
                  variant="bpSmallCaps"
                  fontWeight={500}
                  mb={1.5}
                  color={({ palette }) => palette.gray[90]}
                >
                  Adding a new block will make it public on the hub
                </Typography>
                <Typography
                  variant="bpSmallCopy"
                  color={({ palette }) => palette.gray[80]}
                >
                  Your package must expose a valid{" "}
                  <Typography variant="bpCode">block-metadata.json</Typography>{" "}
                  file.
                </Typography>
              </Box>

              <Link
                variant="bpSmallCopy"
                alignSelf="flex-end"
                href="/docs/developing-blocks#lifecycle-of-a-block"
                target="_blank"
              >
                Learn more in the docs <FontAwesomeIcon icon={faExternalLink} />
              </Link>
            </Alert>

            <BlockFormSection title="Where is your block located?">
              <FieldInfoWrapper
                title="Provide a link to a valid npm repository"
                items={["supports npmjs.org URLs", "package must be public"]}
              >
                <TextField
                  fullWidth
                  label={<RequiredLabel>npm package URL</RequiredLabel>}
                  inputProps={register("npmURL", { required: true })}
                />
              </FieldInfoWrapper>
            </BlockFormSection>

            <BlockFormSection title="Block appearance">
              <FieldInfoWrapper
                title="Choose a URL slug for your block"
                items={[
                  "this will appear in the URL of your block on the Hub",
                  <>
                    e.g. blockprotocol.org/@username/<b>[slug]</b>
                  </>
                ]}
              >
                <TextField
                  fullWidth
                  label={<RequiredLabel>URL slug</RequiredLabel>}
                  inputProps={register("urlSlug", { required: true })}
                />
              </FieldInfoWrapper>
            </BlockFormSection>

            <Button
              type="submit"
              squared
              size="small"
              disabled={!formState.isValid}
            >
              Publish block to hub
            </Button>
          </Box>
        </BlockFormLayout>
      </PageContainer>
    </>
  );
};

export default withAuthWall(PublishFromNPMPage);
