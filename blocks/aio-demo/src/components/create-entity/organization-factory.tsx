import { GraphBlockHandler } from "@blockprotocol/graph";
import { FunctionComponent } from "react";

import { useCreateOrganization } from "../../hooks/use-create-organization";
import { getRandomOrganizationName } from "../../shared/random-name";
import { propertyTypeBaseUrls } from "../../types/property-types";

type OrganizationFactoryProps = {
  graphModule: GraphBlockHandler;
};

export const OrganizationFactory: FunctionComponent<
  OrganizationFactoryProps
> = ({ graphModule }) => {
  const { createOrganization, previousCreatedOrganization } =
    useCreateOrganization(graphModule);

  const previousCreatedOrganizationName =
    previousCreatedOrganization?.properties[propertyTypeBaseUrls.name] ?? null;

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const randomName = getRandomOrganizationName();
          await createOrganization(randomName);
        }}
      >
        Create Organization
      </button>
      <div>
        {previousCreatedOrganizationName
          ? `Created: ${previousCreatedOrganizationName}`
          : "No organization created yet."}
      </div>
    </div>
  );
};
