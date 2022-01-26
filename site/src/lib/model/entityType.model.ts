import { v4 as uuid } from "uuid";
import { Db, DBRef } from "mongodb";
import { JSONObject } from "blockprotocol";
import { escapeRegExp } from "lodash";

import { User } from "./user.model";
import { FRONTEND_URL, isProduction } from "../config";
import { JSONSchema, validateAndCompleteJsonSchema } from "../jsonSchema";

type EntityTypeProperties = {
  createdAt: Date;
  updatedAt: Date;
  entityTypeId: string;
  schema: JSONSchema;
  user: DBRef;
};

type EntityTypeDocument = EntityTypeProperties;

export class EntityType {
  createdAt: Date;
  updatedAt: Date;
  entityTypeId: string;
  schema: JSONSchema;
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
      schema: JSONObject | string;
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
      .insertOne(entityType);

    return new EntityType(entityType);
  }

  static async getAllByUser(
    db: Db,
    params: { user: User },
  ): Promise<EntityType[]> {
    return await db
      .collection<EntityTypeProperties>(this.COLLECTION_NAME)
      .find(
        { user: params.user.toRef() },
        {
          projection: {
            _id: 0,
          },
        },
      )
      .toArray()
      .then((docs) => docs.map((doc) => new EntityType(doc)));
  }

  static async getByUserAndTitle(
    db: Db,
    params: { title?: string | undefined; user: DBRef },
  ): Promise<EntityType | null> {
    return await db
      .collection<EntityTypeProperties>(this.COLLECTION_NAME)
      .findOne(
        { "schema.title": params.title, user: params.user },
        {
          projection: {
            _id: 0,
          },
        },
      )
      .then((type) => (type ? new EntityType(type) : null));
  }

  static async getById(
    db: Db,
    params: { entityTypeId: string },
  ): Promise<EntityType | null> {
    const { entityTypeId } = params;
    const entityTypeDocument = await db
      .collection<EntityTypeDocument>(this.COLLECTION_NAME)
      .findOne({ entityTypeId });

    return entityTypeDocument ? new EntityType(entityTypeDocument) : null;
  }

  async update(
    db: Db,
    params: { schema: JSONObject | string },
  ): Promise<EntityType> {
    const { schema } = params;
    const { entityTypeId } = this;

    let checkedSchema;
    try {
      checkedSchema = await EntityType.validateAndCompleteSchema(db, {
        entityTypeId,
        maybeSchema: schema,
        author: this.schema.author,
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
            schema: checkedSchema,
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

    return new EntityType(updatedType);
  }
}
