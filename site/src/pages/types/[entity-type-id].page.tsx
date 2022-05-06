import { GetServerSideProps, NextPage } from "next";

import { EntityType } from "../../lib/api/model/entity-type.model";
import { connectToDatabase } from "../../lib/api/mongodb";

const EntityTypeIdPage: NextPage = () => <div />;

export default EntityTypeIdPage;

export const getServerSideProps: GetServerSideProps<
  {},
  {
    "entity-type-id": string;
  }
> = async (context) => {
  const { req, res } = context;

  const { db } = await connectToDatabase();

  const entityTypeId = context.query["entity-type-id"] as string;
  const entityType = await EntityType.getById(db, { entityTypeId });

  const jsonFlag = Object.prototype.hasOwnProperty.call(context.query, "json");

  if (jsonFlag || req.headers.accept?.includes("application/json")) {
    if (entityType) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify(entityType.schema, undefined, 2));
    } else {
      res.statusCode = 404;
      res.write("Schema not found.");
    }
    res.end();
  } else if (entityType) {
    return {
      redirect: {
        permanent: false,
        destination: `/@${entityType.schema.author}/types/${entityType.schema.title}`,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }

  return { props: {} };
};
