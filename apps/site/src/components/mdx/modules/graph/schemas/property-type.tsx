import { FunctionComponent } from "react";

import propertyTypeMetaSchema from "../../../../../../public/types/modules/graph/property-type.json";
import { mdxComponents } from "../../../mdx-components";

export const PropertyTypeMetaSchema: FunctionComponent = () => {
  const MdxPre = mdxComponents.pre!;
  const MdxCode = mdxComponents.code!;

  return (
    <MdxPre>
      <MdxCode className="language-json">
        {JSON.stringify(propertyTypeMetaSchema, null, 2)}
      </MdxCode>
    </MdxPre>
  );
};
