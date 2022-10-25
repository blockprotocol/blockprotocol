import { FunctionComponent, useEffect, useState } from "react";

import { formatUpdatedAt } from "../util/html-utils.jsx";

type ClientOnlyLastUpdatedProps = {
  value: string | undefined | null;
};

/**
 * Renders ‘Updated ... ago’ text. Skips rendering during SSR to avoid hydration
 * issues in statically rendered pages.
 */
export const ClientOnlyLastUpdated: FunctionComponent<
  ClientOnlyLastUpdatedProps
> = ({ value }) => {
  const [ssr, setSsr] = useState(true);

  useEffect(() => {
    setSsr(false);
  }, []);

  if (ssr || !value) {
    return null;
  }

  return <>{formatUpdatedAt(value)}</>;
};
