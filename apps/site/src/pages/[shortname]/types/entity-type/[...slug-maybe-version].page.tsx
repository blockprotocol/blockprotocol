import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { extractBaseUrl, VersionedUrl } from "@blockprotocol/type-system/slim";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  EntityTypeEditorFormData,
  EntityTypeFormProvider,
  getFormDataFromSchema,
  getSchemaFromFormData,
  useEntityTypeForm,
} from "@hashintel/type-editor";
import {
  Box,
  Container,
  Fade,
  IconButton,
  Input,
  inputBaseClasses,
  outlinedInputClasses,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useController } from "react-hook-form";
import { tw } from "twind";

import { FontAwesomeIcon, LinkIcon } from "../../../../components/icons";
import { Link } from "../../../../components/link";
import { useUser } from "../../../../context/user-context";
import { apiClient } from "../../../../lib/api-client";
import { isLinkEntityType } from "../../../../util/type-system-util";
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
  const isDraft = !!router.query.draft;

  const draftEntityType = useMemo(() => {
    if (router.query.draft) {
      const entityType = JSON.parse(
        Buffer.from(
          decodeURIComponent(router.query.draft.toString()),
          "base64",
        ).toString("utf8"),
      );

      // @todo add validation
      return entityType as EntityTypeWithMetadata;
    } else {
      return null;
    }
  }, [router.query.draft]);

  const { user } = useUser();
  const { shortname } = router.query as EntityTypePageQueryParams;
  const shortnameWithoutLeadingAt = shortname?.replace(/^@/, "");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [entityTypeState, setEntityTypeState] =
    useState<EntityTypeState | null>(null);

  if (isDraft && draftEntityType && !entityTypeState) {
    setEntityTypeState({
      entityType: draftEntityType,
      latestVersion: draftEntityType,
    });
    setIsLoading(false);
  }

  const { entityType, latestVersion } = entityTypeState ?? {};

  const [descriptionHovered, setDescriptionHovered] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const descriptionInputRef = useRef<HTMLInputElement | null>();

  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const copyEntityTypeId = useCallback<MouseEventHandler>(
    (event) => {
      event.preventDefault();

      if (entityType && navigator.clipboard !== undefined) {
        setHasCopied(true);
        return navigator.clipboard.writeText(entityType.schema.$id);
      }
    },
    [entityType, setHasCopied],
  );
  const handleTooltipOpen = () => {
    setHasCopied(false);
  };

  const formMethods = useEntityTypeForm<EntityTypeEditorFormData>({
    defaultValues: { properties: [], links: [], description: "" },
  });
  const { handleSubmit: wrapHandleSubmit, reset, control } = formMethods;

  const descriptionController = useController({
    control,
    name: "description",
  });

  // When loading or updating a type, set local and form state, and set the URL
  const setEntityType = useCallback(
    (stateToSet: EntityTypeState) => {
      setEntityTypeState(stateToSet);
      reset(getFormDataFromSchema(stateToSet.entityType.schema));

      void router.replace(stateToSet.entityType.schema.$id, undefined, {
        scroll: false,
      });
    },
    [reset, router, setEntityTypeState],
  );

  const submit = async (data: EntityTypeEditorFormData) => {
    if (!entityType) {
      return;
    }

    const newPartialSchema = getSchemaFromFormData(data);

    const existingSchema = entityType.schema;

    const nextSchema = {
      ...existingSchema,
      description: newPartialSchema.description ?? existingSchema.description,
      links: newPartialSchema.links ?? existingSchema.links ?? {},
      properties:
        newPartialSchema.properties ?? existingSchema.properties ?? {},
      required: newPartialSchema.required ?? existingSchema.required ?? [],
    };

    if (isDraft) {
      const {
        $schema: _,
        $id: __,
        kind: ___,
        type: ____,
        ...partial
      } = nextSchema;

      const { data: responseData, error: responseError } =
        await apiClient.createEntityType({
          schema: partial,
        });

      if (!responseData) {
        throw new Error(
          responseError?.message || "Unknown error creating entity type",
        );
      }

      setEntityType({
        entityType: responseData.entityType,
        latestVersion: responseData.entityType,
      });
    } else {
      const { data: responseData, error: responseError } =
        await apiClient.updateEntityType({
          versionedUrl: entityType.schema.$id,
          schema: nextSchema,
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
    }
  };

  // Handle fetching of types on initial load (subsequent updates in form submission)
  useEffect(() => {
    const pageUrl = window.location.href;

    if (
      entityType?.metadata.recordId.baseUrl &&
      pageUrl.startsWith(entityType.metadata.recordId.baseUrl)
    ) {
      // We don't need to fetch again unless we've switched types completely
      return;
    }

    const initialEntityTypeFetch = async () => {
      if (isDraft || !router.isReady) {
        return;
      }

      const [requestedEntityTypeVersion, latestEntityTypeVersion] =
        await fetchEntityType(pageUrl);

      if (!requestedEntityTypeVersion && latestEntityTypeVersion) {
        // eslint-disable-next-line no-console -- intentional debugging logging
        console.warn(
          `Requested version ${extractBaseUrl(
            pageUrl as VersionedUrl,
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
  }, [
    entityType?.metadata.recordId.baseUrl,
    isDraft,
    router.isReady,
    setEntityType,
  ]);

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
  const latestVersionUrl = entityType.schema.$id.replace(
    /\d$/,
    latestVersionNumber.toString(),
  );

  const userCanEdit =
    isLatest &&
    user !== "loading" &&
    user?.shortname === shortnameWithoutLeadingAt;

  const title = entityType.schema.title;

  const entityTypeIsLink = isLinkEntityType(entityType);

  return (
    <>
      <NextSeo title={`Block Protocol – ${shortname}/${title} Schema`} />
      <EntityTypeFormProvider {...formMethods}>
        <form onSubmit={wrapHandleSubmit(submit)}>
          <EntityTypeEditBar
            currentVersion={currentVersionNumber}
            reset={reset}
            isDraft={isDraft}
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
              <Stack
                flexDirection={{ md: "row" }}
                spacing={{ xs: 1 }}
                justifyContent="space-between"
              >
                <Stack flexDirection="row" alignItems="center">
                  {entityTypeIsLink && (
                    <Tooltip
                      title="This is a 'link' entity type. It is used to link other entities together."
                      placement="top"
                    >
                      <Box>
                        <LinkIcon
                          sx={({ palette }) => ({
                            stroke: palette.gray[50],
                            mr: 0.5,
                          })}
                        />
                      </Box>
                    </Tooltip>
                  )}
                  <Typography variant="bpHeading3" component="h1">
                    <strong>{title}</strong> {"  "}Entity Type
                  </Typography>
                  <Typography
                    variant="bpHeading3"
                    component="span"
                    marginLeft={1}
                  >
                    {isDraft ? (
                      <em>(draft)</em>
                    ) : (
                      <>v{entityType.metadata.recordId.version}</>
                    )}
                  </Typography>
                  {!isLatest && (
                    <Link
                      href={latestVersionUrl}
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
                <Box>
                  {!isDraft && entityType?.schema.$id && (
                    <Tooltip
                      placement="bottom"
                      title={hasCopied ? "Copied!" : "Click to copy."}
                      enterDelay={250}
                      onOpen={handleTooltipOpen}
                    >
                      <Link
                        href="#"
                        onClick={copyEntityTypeId}
                        variant="bpCode"
                        fontSize={10}
                        sx={({ palette }) => ({
                          color: palette.purple[500],
                          "&:hover": {
                            color: palette.purple[600],
                          },
                        })}
                      >
                        {entityType.schema.$id}
                      </Link>
                    </Tooltip>
                  )}
                </Box>
              </Stack>
            </header>

            <Box component="main" sx={{ mt: 6 }}>
              <Box component="section" sx={{ mb: 6 }}>
                <Typography
                  variant="bpHeading5"
                  sx={{ mb: 2, fontWeight: 500 }}
                >
                  Description
                </Typography>
                <Box
                  display="flex"
                  gap={1}
                  onMouseEnter={() => setDescriptionHovered(true)}
                  onMouseLeave={() => setDescriptionHovered(false)}
                >
                  {/* To be replaced with the Editable field once that goes in the blockprotocol's design system */}
                  <Input
                    {...descriptionController.field}
                    autoFocus
                    multiline
                    disableUnderline
                    style={{ whiteSpace: "pre" }}
                    readOnly={!editingDescription}
                    inputRef={descriptionInputRef}
                    onBlur={() => {
                      setEditingDescription(false);
                    }}
                    onKeyDown={({ shiftKey, code }) => {
                      if (!shiftKey && code === "Enter") {
                        descriptionInputRef.current?.blur();
                      }
                    }}
                    onFocus={(event) =>
                      event.currentTarget.setSelectionRange(
                        event.currentTarget.value.length,
                        event.currentTarget.value.length,
                      )
                    }
                    sx={{
                      fontFamily: "Inter",
                      width: 1,
                      p: 0,
                      [`.${inputBaseClasses.root}, .${inputBaseClasses.input}`]:
                        {
                          width: 1,
                          p: 0,
                          color: ({ palette }) => palette.gray[90],
                          fontSize: 16,
                          lineHeight: 1.7,
                        },
                      [`.${outlinedInputClasses.notchedOutline}`]: {
                        display: "none",
                      },
                    }}
                  />

                  <Fade in={!editingDescription && descriptionHovered}>
                    <IconButton
                      onClick={() => {
                        setEditingDescription(true);
                        descriptionInputRef.current?.focus();
                      }}
                      sx={{
                        padding: 0.5,
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </IconButton>
                  </Fade>
                </Box>
              </Box>

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
