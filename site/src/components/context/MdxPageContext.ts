import { createContext, Dispatch, SetStateAction } from "react";

export type Heading = {
  anchor: string;
  element: HTMLAnchorElement;
};

type MdxPageContextProps = {
  headings: Heading[];
  setHeadings: Dispatch<SetStateAction<Heading[]>>;
};

const MdxPageContext = createContext<MdxPageContextProps>({
  headings: [],
  setHeadings: () => undefined,
});

export default MdxPageContext;
