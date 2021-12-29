import { createContext, Dispatch, SetStateAction } from "react";

export type Heading = {
  anchor: string;
  element: HTMLHeadingElement;
};

type MDXPageContextProps = {
  headings: Heading[];
  setHeadings: Dispatch<SetStateAction<Heading[]>>;
};

const MDXPageContext = createContext<MDXPageContextProps>({
  headings: [],
  setHeadings: () => undefined,
});

export default MDXPageContext;
