import { formatDistance } from "date-fns";
import ReactHtmlParser, {
  convertNodeToElement,
  Transform,
} from "react-html-parser";

import { Link } from "../components/link.jsx";

export const parseHTML = (html: string) => {
  const transform: Transform = (node, index) => {
    if (
      node.type === "tag" &&
      node.name === "a" &&
      (node.attribs.href.startsWith("/") ||
        node.attribs.href.startsWith("https://blockprotocol.org/"))
    ) {
      return (
        <Link
          key={index}
          href={
            node.attribs.href.startsWith("https://blockprotocol.org/")
              ? node.attribs.href.replace("https://blockprotocol.org/", "/")
              : node.attribs.href
          }
        >
          {convertNodeToElement(node, index, transform)}
        </Link>
      );
    }
  };
  return (ReactHtmlParser as unknown as typeof ReactHtmlParser.default)(html, {
    transform,
  });
};

export const formatUpdatedAt = (date?: string | null) => {
  return date
    ? `Updated 
  ${formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  })}`
    : "";
};
