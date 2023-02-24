import { FunctionComponent } from "react";

import dataTypeMetaSchema from "../../../../../../public/types/modules/graph/data-type.json";
import { mdxComponents } from "../../../mdx-components";

export const DataTypeMetaSchema: FunctionComponent = () => {
  const MdxPre = mdxComponents.pre!;
  const MdxCode = mdxComponents.code!;

  return (
    <MdxPre>
      <MdxCode className="language-json">
        {JSON.stringify(dataTypeMetaSchema, null, 2)}
      </MdxCode>
    </MdxPre>
  );
};
