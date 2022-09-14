import { createContext, Dispatch, SetStateAction } from "react";

export type Heading = {
  anchor: string;
  element: HTMLHeadingElement;
};

type PageHeadingsContextProps = {
  headings: Heading[];
  setHeadings: Dispatch<SetStateAction<Heading[]>>;
};

const PageHeadingsContext = createContext<PageHeadingsContextProps>({
  headings: [],
  setHeadings: () => undefined,
});

export default PageHeadingsContext;
