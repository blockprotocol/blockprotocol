import { formatDistance } from "date-fns";
import _ReactHtmlParser, {
  convertNodeToElement,
  Transform,
} from "react-html-parser";

import { Link } from "../components/link.jsx";

const ReactHtmlParser =
  _ReactHtmlParser as unknown as typeof _ReactHtmlParser.default;

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
  return ReactHtmlParser(html, { transform });
};

export const formatUpdatedAt = (date?: string | null) => {
  return date
    ? `Updated 
  ${formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  })}`
    : "";
};
