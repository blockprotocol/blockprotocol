import { FunctionComponent } from "react";

import entityMetaSchema from "../../../../../../public/types/modules/graph/0.3/schema/entity.json";
import { mdxComponents } from "../../../mdx-components";

export const EntityMetaSchema: FunctionComponent = () => {
  const MdxPre = mdxComponents.pre!;
  const MdxCode = mdxComponents.code!;

  return (
    <MdxPre>
      <MdxCode className="language-json">
        {JSON.stringify(entityMetaSchema, null, 2)}
      </MdxCode>
    </MdxPre>
  );
};
