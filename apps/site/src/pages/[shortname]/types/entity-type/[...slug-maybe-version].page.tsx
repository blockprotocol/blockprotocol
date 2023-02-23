import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { extractBaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";
import {
  EntityTypeEditorFormData,
  EntityTypeFormProvider,
  getFormDataFromSchema,
  getSchemaFromFormData,
  useEntityTypeForm,
} from "@hashintel/type-editor";
import { Box, Container, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useCallback, useEffect, useState } from "react";
import { tw } from "twind";

import { Link } from "../../../../components/link";
import { useUser } from "../../../../context/user-context";
import { apiClient } from "../../../../lib/api-client";
import { EntityTypeEditBar } from "./[...slug-maybe-version].page/entity-type-edit-bar";
import { EntityTypeForm } from "./[...slug-maybe-version].page/entity-type-form";
import { fetchEntityType } from "./[...slug-maybe-version].page/fetch-entity-type";

type EntityTypeState = {
  entityType: EntityTypeWithMetadata;
  latestVersion: EntityTypeWithMetadata;
};

type EntityTypePageQueryParams = {
  shortname?: string;
  title?: string;
};

const EntityTypePage: NextPage = () => {
  const router = useRouter();

  const { user } = useUser();
  const { shortname } = router.query as EntityTypePageQueryParams;
  const shortnameWithoutLeadingAt = shortname?.replace(/^@/, "");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [entityTypeState, setEntityTypeState] =
    useState<EntityTypeState | null>(null);

  const { entityType, latestVersion } = entityTypeState ?? {};

  const formMethods = useEntityTypeForm<EntityTypeEditorFormData>({
    defaultValues: { properties: [], links: [] },
  });
  const { handleSubmit: wrapHandleSubmit, reset } = formMethods;

  // When loading or updating a type, set local and form state, and set the URI
  const setEntityType = useCallback(
    (stateToSet: EntityTypeState) => {
      setEntityTypeState(stateToSet);
      reset(getFormDataFromSchema(stateToSet.entityType.schema));
      void router.push(stateToSet.entityType.schema.$id);
    },
    [reset, router, setEntityTypeState],
  );

  const submit = async (data: EntityTypeEditorFormData) => {
    if (!entityType) {
      return;
    }

    const schema = getSchemaFromFormData(data);

    const { data: responseData, error: responseError } =
      await apiClient.updateEntityType({
        versionedUrl: entityType.schema.$id,
        schema: {
          ...schema,
          properties: schema.properties ?? {},
          title: schema.title ?? entityType.schema.title,
        },
      });

    if (!responseData) {
      throw new Error(
        responseError?.message || "Unknown error updating entity type",
      );
    }

    setEntityType({
      entityType: responseData.entityType,
      latestVersion: responseData.entityType,
    });
  };

  // Handle fetching of types on initial load (subsequent updates in form submission)
  useEffect(() => {
    const pageUri = window.location.href;

    if (
      entityType?.metadata.recordId.baseUrl &&
      pageUri.startsWith(entityType.metadata.recordId.baseUrl)
    ) {
      // We don't need to fetch again unless we've switched types completely
      return;
    }

    const initialEntityTypeFetch = async () => {
      const [requestedEntityTypeVersion, latestEntityTypeVersion] =
        await fetchEntityType(pageUri);

      if (!requestedEntityTypeVersion && latestEntityTypeVersion) {
        // eslint-disable-next-line no-console -- intentional debugging logging
        console.warn(
          `Requested version ${extractBaseUrl(
            pageUri as VersionedUrl,
          )} not found – redirecting to latest.`,
        );
        setEntityType({
          entityType: latestEntityTypeVersion,
          latestVersion: latestEntityTypeVersion,
        });
      } else if (!requestedEntityTypeVersion && !latestEntityTypeVersion) {
        setEntityTypeState(null);
      } else {
        setEntityType({
          entityType: requestedEntityTypeVersion!,
          latestVersion: latestEntityTypeVersion!,
        });
      }

      setIsLoading(false);
    };

    void initialEntityTypeFetch();
  }, [entityType?.metadata.recordId.baseUrl, router, setEntityType]);

  if (isLoading || !shortname) {
    // @todo proper loading state
    return null;
  }

  if (!entityType || !latestVersion) {
    return <NextError statusCode={404} />;
  }

  const currentVersionNumber = entityType.metadata.recordId.version;
  const latestVersionNumber = latestVersion.metadata.recordId.version;

  const isLatest = currentVersionNumber === latestVersionNumber;
  const latestVersionUri = entityType.schema.$id.replace(
    /\d$/,
    latestVersionNumber.toString(),
  );

  const userCanEdit =
    isLatest &&
    user !== "loading" &&
    user?.shortname === shortnameWithoutLeadingAt;

  const title = entityType.schema.title;

  return (
    <>
      <NextSeo title={`Block Protocol – ${shortname}/${title} Schema`} />
      <EntityTypeFormProvider {...formMethods}>
        <form onSubmit={wrapHandleSubmit(submit)}>
          <EntityTypeEditBar
            currentVersion={currentVersionNumber}
            reset={reset}
          />
          <Container
            sx={{
              marginTop: {
                xs: 4,
                md: 8,
              },
              marginBottom: {
                xs: 4,
                md: 8,
              },
            }}
          >
            <header className={tw`mb-8`}>
              <Link href={`/${shortname}`}>
                {shortname}
                {" >"}
              </Link>
              <Stack flexDirection="row" alignItems="center">
                <Typography variant="bpHeading3" component="h1">
                  <strong>{title}</strong> {"  "}Entity Type
                </Typography>
                <Typography
                  variant="bpHeading3"
                  component="span"
                  marginLeft={1}
                >
                  v{entityType.metadata.recordId.version}
                </Typography>
                {!isLatest && (
                  <Link
                    href={latestVersionUri}
                    onClick={(event) => {
                      event.preventDefault();
                      setEntityType({
                        entityType: latestVersion,
                        latestVersion,
                      });
                    }}
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      marginLeft: 1.5,
                    }}
                  >
                    <Typography variant="bpHeading4" color="inherit">
                      (v{latestVersionNumber} available)
                    </Typography>
                  </Link>
                )}
              </Stack>
            </header>

            <Box component="main" sx={{ mt: 6 }}>
              {entityType.schema.description ? (
                <Box component="section" sx={{ mb: 6 }}>
                  <Typography
                    variant="bpHeading5"
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Description
                  </Typography>
                  <Typography variant="bpBodyCopy">
                    {entityType.schema.description}
                  </Typography>
                </Box>
              ) : null}

              <Box component="section">
                <EntityTypeForm
                  author={shortname as `@${string}`}
                  entityType={entityType}
                  readonly={!userCanEdit}
                />
              </Box>
            </Box>
          </Container>
        </form>
      </EntityTypeFormProvider>
    </>
  );
};

export default EntityTypePage;
