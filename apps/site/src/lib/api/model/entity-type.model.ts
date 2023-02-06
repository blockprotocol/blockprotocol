import { JsonObject } from "@blockprotocol/core";
import { EntityType as BlockProtocolEntityType } from "@blockprotocol/graph";
import escapeRegExp from "lodash/escapeRegExp";
import { Db, DBRef } from "mongodb";
import { v4 as uuid } from "uuid";

import { FRONTEND_URL, isProduction } from "../../config";
import { validateAndCompleteJsonSchema } from "../../json-schema";
import { User } from "./user.model";

type EntityTypeProperties = BlockProtocolEntityType & {
  createdAt: Date;
  updatedAt: Date;
  user: DBRef;
};

/**
 * MongoDB < 5.0 does not allow $ in the initial position in a field name
 *    @todo upgrade db to 5.0 (involves other changes) and remove changing schema to string and back
 */
type EntityTypeDocument = Omit<EntityTypeProperties, "schema"> & {
  schema: string;
};

export class EntityType {
  createdAt: Date;
  updatedAt: Date;
  entityTypeId: string;
  schema: BlockProtocolEntityType["entity"];
  user: DBRef;

  static readonly COLLECTION_NAME = "bp-entity-types";

  static readonly DEFAULT_$ID_ORIGIN = "https://blockprotocol.org";

  private constructor({
    createdAt,
    entityTypeId,
    updatedAt,
    schema,
    user,
  }: EntityTypeProperties) {
    this.createdAt = createdAt;
    this.entityTypeId = entityTypeId;
    this.updatedAt = updatedAt;
    this.user = user;

    if (isProduction) {
      this.schema = schema;
    } else {
      const rewrittenSchema = JSON.stringify(schema).replace(
        new RegExp(`"${escapeRegExp(EntityType.DEFAULT_$ID_ORIGIN)}`),
        `"${FRONTEND_URL}`,
      );
      this.schema = JSON.parse(rewrittenSchema);
    }
  }

  private static async validateAndCompleteSchema(
    db: Db,
    params: {
      author: string;
      entityTypeId: string;
      maybeSchema: unknown;
      user: DBRef;
    },
  ) {
    const { author, entityTypeId, maybeSchema, user } = params;

    const compiledSchema = await validateAndCompleteJsonSchema({
      author,
      entityTypeId,
      maybeSchema,
    });

    const { title } = compiledSchema;

    const schemaWithExistingName = await this.getByUserAndTitle(db, {
      title,
      user,
    });
    if (
      schemaWithExistingName &&
      schemaWithExistingName.entityTypeId !== entityTypeId
    ) {
      throw new Error(`User already has a schema with title ${title}`);
    }

    return compiledSchema;
  }

  static async create(
    db: Db,
    params: {
      schema: JsonObject | string;
      user: User;
    },
  ): Promise<EntityType> {
    const { schema, user } = params;

    const entityTypeId = uuid();

    let checkedSchema;
    try {
      checkedSchema = await this.validateAndCompleteSchema(db, {
        author: user.shortname!,
        entityTypeId,
        maybeSchema: schema,
        user: user.toRef(),
      });
    } catch (err) {
      throw new Error(
        `Invalid schema: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      );
    }

    const now = new Date();
    const entityType = new EntityType({
      createdAt: now,
      updatedAt: now,
      entityTypeId,
      schema: checkedSchema,
      user: user.toRef(),
    });

    await db
      .collection<EntityTypeDocument>(this.COLLECTION_NAME)
      .insertOne({ ...entityType, schema: JSON.stringify(checkedSchema) });

    return new EntityType(entityType);
  }

  static async getAllByUser(
    db: Db,
    params: { user: User },
  ): Promise<EntityType[]> {
    return await db
      .collection<EntityTypeDocument>(this.COLLECTION_NAME)
      .find(
        { user: params.user.toRef() },
        {
          projection: {
            _id: 0,
          },
        },
      )
      .toArray()
      .then((docs) =>
        docs.map(
          (doc) => new EntityType({ ...doc, schema: JSON.parse(doc.schema) }),
        ),
      );
  }

  static async getByUserAndTitle(
    db: Db,
    params: { title?: string | undefined; user: DBRef },
  ): Promise<EntityType | null> {
    const userTypes = await db
      .collection<EntityTypeDocument>(this.COLLECTION_NAME)
      .find(
        { user: params.user },
        {
          projection: {
            _id: 0,
          },
        },
      )
      .toArray();
    const foundType = userTypes.find(
      (type) => JSON.parse(type.schema).title === params.title,
    );

    return foundType
      ? new EntityType({ ...foundType, schema: JSON.parse(foundType.schema) })
      : null;
  }

  static async getById(
    db: Db,
    params: { entityTypeId: string },
  ): Promise<EntityType | null> {
    const { entityTypeId } = params;
    const entityTypeDocument = await db
      .collection<EntityTypeDocument>(this.COLLECTION_NAME)
      .findOne({ entityTypeId });

    return entityTypeDocument
      ? new EntityType({
          ...entityTypeDocument,
          schema: JSON.parse(entityTypeDocument.schema),
        })
      : null;
  }

  async update(
    db: Db,
    params: { schema: JsonObject | string },
  ): Promise<EntityType> {
    const { schema } = params;
    const { entityTypeId } = this;

    let checkedSchema;
    try {
      checkedSchema = await EntityType.validateAndCompleteSchema(db, {
        entityTypeId,
        maybeSchema: schema,
        author:
          typeof this.schema.author === "string"
            ? this.schema.author
            : "unknown",
        user: this.user,
      });
    } catch (err) {
      throw new Error(
        `Could not compile JSON Schema: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      );
    }

    const { value: updatedType } = await db
      .collection<EntityTypeDocument>(EntityType.COLLECTION_NAME)
      .findOneAndUpdate(
        { entityTypeId: this.entityTypeId, user: this.user },
        {
          $set: {
            schema: JSON.stringify(checkedSchema),
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

    if (!updatedType) {
      throw new Error(
        "Critical: could not find record of EntityType instance in database.",
      );
    }

    return new EntityType({
      ...updatedType,
      schema: JSON.parse(updatedType.schema),
    });
  }
}
