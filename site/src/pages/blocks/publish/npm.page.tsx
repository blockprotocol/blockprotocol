import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/button";
import { withAuthWall } from "../../../components/pages/auth-wall";
import { BlockFormLayout } from "../../../components/pages/blocks/block-form-layout";
import { BlockFormSection } from "../../../components/pages/blocks/block-form-section";
import { FieldInfoWrapper } from "../../../components/pages/blocks/field-info-wrapper";
import { PublishBlockInfo } from "../../../components/pages/blocks/publish-block-info";
import { RequiredLabel } from "../../../components/pages/blocks/required-label";
import { PageContainer } from "../../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../../components/pages/dashboard/top-navigation-tabs";
import { TextField } from "../../../components/text-field";

interface FormValues {
  npmURL: string;
  urlSlug: string;
}

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
            <PublishBlockInfo />

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
