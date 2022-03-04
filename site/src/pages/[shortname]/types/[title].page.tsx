import Head from "next/head";
import { tw } from "twind";
import { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  BlockProtocolAggregateEntityTypesFunction,
  BlockProtocolUpdateEntityTypesFunction,
} from "blockprotocol";
import { Box, Container, Typography } from "@mui/material";

import { EntityType } from "../../../lib/api/model/entityType.model";
import { SchemaEditor } from "../../../components/entityTypes/SchemaEditor/SchemaEditor";
import { apiClient } from "../../../lib/apiClient";
import { useUser } from "../../../context/UserContext";
import { Link } from "../../../components/Link";

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

  const aggregateEntityTypes: BlockProtocolAggregateEntityTypesFunction =
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
            results: data?.entityTypes.map((type) => type.schema) ?? [],
            operation: {
              pageNumber: 1,
              itemsPerPage: 100,
            },
          };
        });
    };

  const updateEntityTypes: BlockProtocolUpdateEntityTypesFunction = ([
    { entityTypeId, schema },
  ]) =>
    apiClient
      .updateEntityType({ schema: JSON.stringify(schema) }, entityTypeId)
      .then(({ data }) => {
        if (data) {
          return [data.entityType.schema];
        }
        throw new Error("Could not update entity type");
      });

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
      <Head>
        <title>
          Block Protocol - {shortname}/{title} Schema
        </title>
      </Head>
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
            <a>
              {shortname}
              {" >"}
            </a>
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
            updateEntityTypes={userCanEdit ? updateEntityTypes : undefined}
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
