import {
  ArrowsLeftRightIcon,
  BlockProtocolIcon,
  WordPressIcon,
} from "../../icons";

export const BpWpIcons = () => (
  <>
    <BlockProtocolIcon
      gradient
      sx={{ fontSize: "0.8em", marginBottom: "0.1em" }}
    />
    <ArrowsLeftRightIcon
      sx={{
        color: ({ palette }) => palette.purple[200],
        mx: 0.75,
        fontSize: "0.8em",
      }}
    />
    <WordPressIcon sx={{ fontSize: "0.8em", marginBottom: "0.1em" }} />{" "}
  </>
);
