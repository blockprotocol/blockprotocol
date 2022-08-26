import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/button";
import { useSnackbar } from "../../../components/hooks/use-snackbar";
import { FontAwesomeIcon } from "../../../components/icons";
import { Link } from "../../../components/link";
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
import { shy } from "../../../components/pages/user/utils";
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
    const res = await apiClient.publishBlockFromNPM(data);

    if (res.error) {
      /**  @todo depending on res.error.code, call form.setError on related field  */
      return snackbar.error("error");
    }

    const blockHref = `@${user.shortname}/blocks/${data.blockName}`;

    snackbar.success(
      <Box sx={{ wordBreak: "break-all" }}>
        Your block was published successfully. It can now be found at{" "}
        <Link
          href={blockHref}
          sx={{ color: "inherit", textDecoration: "underline" }}
        >
          {`blockprotocol.org/${blockHref}`}
          <FontAwesomeIcon sx={{ ml: 0.5 }} icon={faExternalLink} />
        </Link>
      </Box>,
    );
    await router.push("/blocks");
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
                title="Provide the package name of a valid npm repository"
                items={["package must be public"]}
              >
                <TextField
                  fullWidth
                  label={<RequiredLabel>npm package name</RequiredLabel>}
                  inputProps={register("npmPackageName", {
                    required: "Required",
                  })}
                  error={!!formState.errors.npmPackageName}
                  helperText={formState.errors.npmPackageName?.message}
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
                    <b>{shy(blockName || "[slug]")}</b>
                  </>,
                ]}
              >
                <TextField
                  fullWidth
                  label={<RequiredLabel>URL slug</RequiredLabel>}
                  inputProps={register("blockName", { required: "Required" })}
                  error={!!formState.errors.blockName}
                  helperText={formState.errors.blockName?.message}
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
