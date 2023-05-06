import { GraphBlockHandler } from "@blockprotocol/graph";
import { FunctionComponent } from "react";

import { useCreateCompany } from "../../hooks/use-create-company";
import { getRandomCompanyName } from "../../shared/random-name";
import { propertyTypeBaseUrls } from "../../types/property-types";

type CompanyFactoryProps = {
  graphModule: GraphBlockHandler;
};

export const CompanyFactory: FunctionComponent<CompanyFactoryProps> = ({
  graphModule,
}) => {
  const { createCompany, previousCreatedCompany } =
    useCreateCompany(graphModule);

  const previousCreatedCompanyName =
    previousCreatedCompany?.properties[propertyTypeBaseUrls.name] ?? null;

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const randomName = getRandomCompanyName();
          await createCompany(randomName);
        }}
      >
        Create Company
      </button>
      <div>
        {previousCreatedCompanyName
          ? `Created: ${previousCreatedCompanyName}`
          : "No company created yet."}
      </div>
    </div>
  );
};
