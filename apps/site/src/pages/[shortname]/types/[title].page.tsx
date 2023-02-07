import {
  EmbedderGraphMessageCallbacks,
  EntityTypeWithMetadata,
} from "@blockprotocol/graph";
import { Container, Typography } from "@mui/material";
import { NextPage } from "next";
import NextError from "next/error";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { tw } from "twind";

import { Link } from "../../../components/link";
import { useUser } from "../../../context/user-context";
import { EntityType } from "../../../lib/api/model/entity-type.model";
import { apiClient } from "../../../lib/api-client";

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

  const _aggregateEntityTypes: EmbedderGraphMessageCallbacks<false>["aggregateEntityTypes"] =
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
            data: data as any, // @todo fix this when introducing new type editor
          };
        });
    };

  const _updateEntityType: EmbedderGraphMessageCallbacks<false>["updateEntityType"] =
    (args) => {
      if (!args.data) {
        throw new Error("No data supplied to updateEntityType request");
      }
      const { entityTypeId, entityType: newEntityType } = args.data;

      return apiClient
        .updateEntityType({ entityType: newEntityType }, entityTypeId)
        .then(({ data }) => {
          if (data) {
            return {
              data,
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

  const _userCanEdit =
    user !== "loading" && user?.shortname === shortnameWithoutLeadingAt;

  const _uri = entityType.schema.$id;

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
          <h2>New type editor coming soon</h2>
        </main>
      </Container>
    </>
  );
};

export default EntityTypePage;
