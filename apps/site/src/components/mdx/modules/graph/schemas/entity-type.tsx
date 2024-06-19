import { FunctionComponent } from "react";

import entityTypeMetaSchema from "../../../../../../public/types/modules/graph/0.3/schema/entity-type.json";
import { mdxComponents } from "../../../mdx-components";

export const EntityTypeMetaSchema: FunctionComponent = () => {
  const MdxPre = mdxComponents.pre!;
  const MdxCode = mdxComponents.code!;

  return (
    <MdxPre>
      <MdxCode className="language-json">
        {JSON.stringify(entityTypeMetaSchema, null, 2)}
      </MdxCode>
    </MdxPre>
  );
};
