import { PropertyTypeWithMetadata } from "@blockprotocol/graph";
import { ObjectId } from "mongodb";

export type PropertyTypeWithUserId = PropertyTypeWithMetadata & {
  userId: ObjectId;
};
