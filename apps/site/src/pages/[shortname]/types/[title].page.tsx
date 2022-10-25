import { EmbedderGraphMessageCallbacks } from "@blockprotocol/graph";
import { Box, Container, Typography } from "@mui/material";
import { NextPage } from "next";
import RawNextError from "next/error.js";
import { useRouter } from "next/router.js";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { tw } from "twind";

import { SchemaEditor } from "../../../components/entity-types/schema-editor/schema-editor.jsx";
import { Link } from "../../../components/link.jsx";
import { useUser } from "../../../context/user-context.js";
import { EntityType } from "../../../lib/api/model/entity-type.model.js";
import { apiClient } from "../../../lib/api-client.js";

const NextError = RawNextError as unknown as typeof RawNextError.default;

type EntityTypePageQueryParams = {
  shortname?: string;
  title?: string;
};

const EntityTypePage: NextPage = () => {
  const router = useRouter();

  const { user } = useUser();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [entityType, setEntityType] = useState<EntityType | undefined>();

  // shortname and title will be undefined until useRouter populates them
  const { shortname, title } = router.query as EntityTypePageQueryParams;

  const shortnameWithoutLeadingAt = shortname?.replace(/^@/, "");

  useEffect(() => {
    if (!shortnameWithoutLeadingAt || !title) {
      return;
    }
    apiClient
      .getEntityTypeByUserAndTitle({
        shortname: shortnameWithoutLeadingAt,
        title,
      })
      .then(({ data }) => setEntityType(data?.entityType))
      .catch((err) => {
        // eslint-disable-next-line no-console -- @todo handle 404s and show to user
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [shortnameWithoutLeadingAt, title, setEntityType]);

  const aggregateEntityTypes: EmbedderGraphMessageCallbacks["aggregateEntityTypes"] =
    () => {
      if (!shortnameWithoutLeadingAt) {
        throw new Error(
          "Aggregate entity types called before shortname available from query.",
        );
      }
      return apiClient
        .getUserEntityTypes({ shortname: shortnameWithoutLeadingAt })
        .then(({ data }) => {
          return {
            data: {
              results: data?.entityTypes ?? [],
              operation: {
                pageNumber: 1,
                itemsPerPage: 100,
              },
            },
          };
        });
    };

  const updateEntityType: EmbedderGraphMessageCallbacks["updateEntityType"] = (
    args,
  ) => {
    if (!args.data) {
      throw new Error("No data supplied to updateEntityType request");
    }
    const { entityTypeId, schema } = args.data;

    return apiClient
      .updateEntityType({ schema: JSON.stringify(schema) }, entityTypeId)
      .then(({ data }) => {
        if (data) {
          return {
            data: data.entityType,
          };
        }
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "Could not update entity type",
            },
          ],
        };
      });
  };

  if (isLoading) {
    // @todo proper loading state
    return null;
  }

  if (!entityType) {
    return <NextError statusCode={404} />;
  }

  const userCanEdit =
    user !== "loading" && user?.shortname === shortnameWithoutLeadingAt;

  const uri = entityType.schema.$id;

  return (
    <>
      <NextSeo title={`Block Protocol – ${shortname}/${title} Schema`} />
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
          <Typography variant="bpHeading3" component="h1">
            <strong>{title ?? "Unnamed"}</strong> Schema
          </Typography>
        </header>

        <section>
          <Typography variant="bpBodyCopy" sx={{ mb: 2 }}>
            You can use this editor to build basic schemas, representing types
            of entities.
          </Typography>
          <Typography variant="bpBodyCopy" sx={{ mb: 2 }}>
            You can use these entity types as the expected value for a property
            in another schema.
          </Typography>
        </section>

        <main className={tw`pt-8 mb-14 w-auto`}>
          <SchemaEditor
            aggregateEntityTypes={aggregateEntityTypes}
            entityTypeId={entityType.entityTypeId}
            schema={entityType.schema}
            updateEntityType={userCanEdit ? updateEntityType : undefined}
          />
        </main>

        <Box sx={{ mb: 2 }}>
          <Typography variant="bpSmallCopy" sx={{ maxWidth: "100%" }}>
            Link properties to schema.org or other equivalents — e.g.{" "}
            <Link href="https://schema.org/givenName">
              https://schema.org/givenName
            </Link>{" "}
            — to make them interpretable as RDF or JSON-LD.
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="bpSmallCopy" sx={{ maxWidth: "100%" }}>
            This schema will always be available at{" "}
            <Link href={uri}>{uri}</Link> - this is its <strong>$id</strong>.
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="bpSmallCopy">
            Looking for the raw JSON? Visit{" "}
            <Link href={`${uri}?json`} target="_blank">
              this link
            </Link>{" "}
            or request the $id with "application/json" in an "Accept" HTTP
            header.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default EntityTypePage;
