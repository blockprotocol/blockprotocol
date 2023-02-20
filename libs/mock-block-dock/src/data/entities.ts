import { Entity, extractBaseUri } from "@blockprotocol/graph";
import {
  Entity as EntityTemporal,
  EntityTemporalVersioningMetadata,
  QueryTemporalAxes,
} from "@blockprotocol/graph/temporal";

import { entityTypes } from "./entity-types";
import { propertyTypes } from "./property-types";
import { companyNames, personNames } from "./words";

const createPerson = <Temporal extends boolean>(
  entityId: number,
  temporalVersioningMetadata: Temporal extends true
    ? EntityTemporalVersioningMetadata
    : undefined,
): Temporal extends true ? EntityTemporal : Entity => {
  const name = personNames[entityId] ?? "Unknown Person";
  return {
    metadata: {
      recordId: {
        entityId: `person-${entityId.toString()}`,
        editionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.person.$id,
      ...(temporalVersioningMetadata !== undefined
        ? { temporalVersioning: temporalVersioningMetadata }
        : {}),
    },
    properties: {
      [extractBaseUri(propertyTypes.age.$id)]: Math.ceil(Math.random() * 100),
      [extractBaseUri(propertyTypes.email.$id)]: `${name}@example.com`,
      [extractBaseUri(propertyTypes.name.$id)]: name,
      [extractBaseUri(propertyTypes.username.$id)]: name.toLowerCase(),
    },
  } as Temporal extends true ? EntityTemporal : Entity;
};

const createCompany = <Temporal extends boolean>(
  entityId: number,
  temporalVersioningMetadata: Temporal extends true
    ? EntityTemporalVersioningMetadata
    : undefined,
): Temporal extends true ? EntityTemporal : Entity => {
  const name = companyNames[entityId] ?? "Unknown Company";
  return {
    metadata: {
      recordId: {
        entityId: `company-${entityId.toString()}`,
        editionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.company.$id,
      ...(temporalVersioningMetadata !== undefined
        ? { temporalVersioning: temporalVersioningMetadata }
        : {}),
    },
    properties: {
      [extractBaseUri(propertyTypes.numberOfEmployees.$id)]: Math.ceil(
        Math.random() * 10_000,
      ),
      [extractBaseUri(propertyTypes.name.$id)]: name,
    },
  } as Temporal extends true ? EntityTemporal : Entity;
};

const createWorksForLink = <Temporal extends boolean>(
  sourceEntityId: string,
  destinationEntityId: string,
  temporalVersioningMetadata: Temporal extends true
    ? EntityTemporalVersioningMetadata
    : undefined,
): Temporal extends true ? EntityTemporal : Entity => {
  return {
    metadata: {
      recordId: {
        entityId: `${sourceEntityId}-works-for-${destinationEntityId}`,
        editionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.worksFor.$id,
      ...(temporalVersioningMetadata !== undefined
        ? { temporalVersioning: temporalVersioningMetadata }
        : {}),
    },
    properties: {},
    linkData: {
      leftEntityId: sourceEntityId,
      rightEntityId: destinationEntityId,
    },
  } as Temporal extends true ? EntityTemporal : Entity;
};

const createFounderOfLink = <Temporal extends boolean>(
  sourceEntityId: string,
  destinationEntityId: string,
  temporalVersioningMetadata: Temporal extends true
    ? EntityTemporalVersioningMetadata
    : undefined,
): Temporal extends true ? EntityTemporal : Entity => {
  return {
    metadata: {
      recordId: {
        entityId: `${sourceEntityId}-founder-of-${destinationEntityId}`,
        editionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.founderOf.$id,
      temporalVersioning: temporalVersioningMetadata,
    },
    properties: {},
    linkData: {
      leftEntityId: sourceEntityId,
      rightEntityId: destinationEntityId,
    },
  } as Temporal extends true ? EntityTemporal : Entity;
};

const createEntities = <Temporal extends boolean>(
  temporalAxes: Temporal extends true ? QueryTemporalAxes : undefined,
): (Temporal extends true ? EntityTemporal : Entity)[] => {
  // First create people and companies in separate lists
  const people = [];
  const companies = [];

  let temporalVersioningMetadata: EntityTemporalVersioningMetadata | undefined =
    undefined;

  if (temporalAxes !== undefined) {
    const interval = {
      start: {
        kind: "inclusive",
        limit:
          temporalAxes.variable.interval.start.kind === "unbounded"
            ? new Date(0).toISOString()
            : temporalAxes.variable.interval.start.limit,
      },
      end: {
        kind: "exclusive",
        limit: temporalAxes.variable.interval.end.limit,
      },
    } as const;

    temporalVersioningMetadata = {
      transactionTime: interval,
      decisionTime: interval,
    };
  }

  for (let idx = 0; idx < personNames.length; idx++) {
    people.push(createPerson(idx, temporalVersioningMetadata));
  }
  for (let idx = 0; idx < companyNames.length; idx++) {
    companies.push(createCompany(idx, temporalVersioningMetadata));
  }

  const entities = [];

  // For each company, `pop` (to avoid double selection in the next step) a person to be the founder, and start building
  // the final entities list
  for (const company of companies) {
    const founder = people.pop();

    if (founder) {
      entities.push(
        createFounderOfLink(
          founder.metadata.recordId.entityId,
          company.metadata.recordId.entityId,
          temporalVersioningMetadata,
        ),
      );
      entities.push(founder);
    }
  }
  for (const person of people) {
    entities.push(
      createWorksForLink(
        person.metadata.recordId.entityId,
        companies[Math.floor(Math.random() * companies.length)]!.metadata
          .recordId.entityId,
        temporalVersioningMetadata,
      ),
    );
  }

  return [...entities, ...people, ...companies] as (Temporal extends true
    ? EntityTemporal
    : Entity)[];
};

export { createEntities };
