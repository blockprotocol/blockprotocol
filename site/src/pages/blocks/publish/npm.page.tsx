import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/button";
import { useSnackbar } from "../../../components/hooks/use-snackbar";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../../components/pages/auth-wall";
import { BlockFormLayout } from "../../../components/pages/blocks/block-form-layout";
import { BlockFormSection } from "../../../components/pages/blocks/block-form-section";
import { FieldInfoWrapper } from "../../../components/pages/blocks/field-info-wrapper";
import { PublishBlockInfo } from "../../../components/pages/blocks/publish-block-info";
import { RequiredLabel } from "../../../components/pages/blocks/required-label";
import { PageContainer } from "../../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../../components/pages/dashboard/top-navigation-tabs";
import { TextField } from "../../../components/text-field";
import { apiClient } from "../../../lib/api-client";
import { ApiBlockCreateRequest } from "../../api/blocks/create.api";

type FormValues = ApiBlockCreateRequest;

const PublishFromNPMPage: AuthWallPageContent = ({ user }) => {
  const router = useRouter();
  const snackbar = useSnackbar();

  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await apiClient.publishBlockFromNPM(data);

      if (res.error) throw Error(res.error.message);

      await router.push("/blocks");
    } catch (error) {
      /** @todo I think we can improve error handling instead of using `instanceof` every time */
      snackbar.error(error instanceof Error ? error.message : "Oops!");
    }
  };

  const blockName = watch("blockName");

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
              alignItems: "flex-start",
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
                  inputProps={register("npmPackageName", { required: true })}
                />
              </FieldInfoWrapper>
            </BlockFormSection>

            <BlockFormSection title="Block appearance">
              <FieldInfoWrapper
                title="Choose a URL slug for your block"
                items={[
                  "this will appear in the URL of your block on the Hub",
                  <>
                    e.g. blockprotocol.org/@{user.shortname}/
                    <b>{blockName || "[slug]"}</b>
                  </>,
                ]}
              >
                <TextField
                  fullWidth
                  label={<RequiredLabel>URL slug</RequiredLabel>}
                  inputProps={register("blockName", { required: true })}
                />
              </FieldInfoWrapper>
            </BlockFormSection>

            <Button
              type="submit"
              squared
              size="small"
              disabled={!formState.isValid || formState.isSubmitting}
              loading={formState.isSubmitting}
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
