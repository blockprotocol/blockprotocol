import { GraphBlockHandler } from "@blockprotocol/graph";
import { FunctionComponent } from "react";

import { useCreatePerson } from "../../hooks/use-create-person";
import { getRandomPersonNameParams } from "../../shared/random-name";
import { propertyTypeBaseUrls } from "../../types/property-types";

type PersonFactoryProps = {
  graphModule: GraphBlockHandler;
};

export const PersonFactory: FunctionComponent<PersonFactoryProps> = ({
  graphModule,
}) => {
  const { createPerson, previousCreatedPerson } = useCreatePerson(graphModule);

  const previousCreatedPersonName =
    previousCreatedPerson?.properties[propertyTypeBaseUrls.name] ?? null;
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const randomPersonNameParams = getRandomPersonNameParams();

          await createPerson(randomPersonNameParams);
        }}
      >
        Create Person
      </button>
      <div>
        {previousCreatedPersonName
          ? `Created: ${previousCreatedPersonName}`
          : "No person created yet."}
      </div>
    </div>
  );
};
