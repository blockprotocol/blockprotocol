import { VFC } from "react";
import { Typography, Box, Paper, useMediaQuery, useTheme } from "@mui/material";

export type SpecPageSubSection = {
  title: string;
  anchor: string;
  Content: VFC;
};

export type SpecPageSection = {
  title: string;
  anchor: string;
  Content?: VFC;
  subSections?: SpecPageSubSection[];
};

export type SpecPage = {
  href: string;
  title: string;
  Content?: VFC;
  sections?: SpecPageSection[];
  isAppendix?: boolean;
};

const WhatIsSpecificationInfoCard = (
  <Paper
    variant="purple"
    sx={{
      padding: {
        xs: 2,
        sm: 3,
      },
    }}
  >
    <Typography
      variant="bpLargeText"
      sx={{ fontWeight: 600, color: ({ palette }) => palette.purple[600] }}
      marginBottom={1}
    >
      What's a specification?
    </Typography>
    <Typography sx={{ color: ({ palette }) => palette.purple[600] }}>
      A specification is a document that outlines how a system should be built.
      They help make applications and websites interoperable.
    </Typography>
  </Paper>
);

export const SPECIFICATION_PAGES: SpecPage[] = [
  {
    href: "/spec",
    title: "Introduction",
    Content: () => (
      <>
        <a href="#">
          <Typography variant="bpHeading2">Introduction</Typography>
        </a>
        <Typography variant="bpBodyCopy">
          This document specifies a protocol for defining web “blocks” -
          discrete components displayed on a web page or other application - and
          how they communicate with any application embedding them.
        </Typography>
        <Typography variant="bpBodyCopy">
          It defines how structured data is passed between blocks and embedding
          applications, enabling any protocol-compliant application to use any
          protocol-compliant block to make structured data viewable and editable
          by users.
        </Typography>
      </>
    ),
    sections: [
      {
        title: "Overview",
        anchor: "overview",
        Content: () => (
          <>
            <a href="#overview">
              <Typography id="overview" variant="bpHeading2">
                Overview
              </Typography>
            </a>
            <Typography variant="bpBodyCopy">
              Note: this section is narrative and guidance which will form part
              of explanatory material rather than the specification itself. It
              is included in this preliminary document to aid the reader in
              understanding the full context, but will be published outside the
              spec in its final form.
            </Typography>
            <Typography variant="bpBodyCopy">
              Many modern content creation systems, such as WordPress and
              Notion, use a concept of ‘blocks’ to build content pages from.
              Users typically click on a big + button which allows them to
              insert one of any number of blocks of different types (e.g.
              paragraph, list, table, video). Pages built in this modular
              fashion can be as varied and interactive as the repertoire of
              available blocks. But these block systems are generally closed
              ecosystems. It is either (a) impossible for users to create new
              block types, or (b) impossible to use any block types created in
              one of these applications in another.
            </Typography>
            ...
          </>
        ),
      },
      {
        title: "Terminology",
        anchor: "terminology",
        Content: () => (
          <>
            <a href="#terminology">
              <Typography id="terminology" variant="bpHeading2">
                Terminology
              </Typography>
            </a>
            <Typography variant="bpBodyCopy">
              Entity: an instance of data conforming to a schema, typically with
              a unique identifier.
            </Typography>
            ...
          </>
        ),
      },
    ],
  },
  {
    href: "/spec/block-types",
    title: "Block Types",
    Content: () => (
      <>
        <Typography id="" variant="bpHeading1">
          Block Types
        </Typography>
        <Typography variant="bpBodyCopy">
          A block type should be packaged and distributed in a form which
          embedding applications can easily insert into a web page, and
          accompanied by metadata files describing the structure of data that
          the block accepts. A block package might be made available via a URL,
          package manager, or catalog of block types.
        </Typography>
      </>
    ),
    sections: [
      {
        title: "Requesting, creating, and updating data",
        anchor: "requesting-creating-and-updating-data",
        Content: () => (
          <a href="#requesting-creating-and-updating-data">
            <Typography
              id="requesting-creating-and-updating-data"
              variant="bpHeading2"
            >
              Requesting, creating, and updating data
            </Typography>
          </a>
        ),
        subSections: [
          {
            title: "Data provided to blocks",
            anchor: "data-provided-to-blocks",
            Content: () => (
              <>
                <a href="#data-provided-to-blocks">
                  <Typography id="data-provided-to-blocks" variant="bpHeading3">
                    Data provided to blocks
                  </Typography>
                </a>
                <Typography variant="bpBodyCopy">
                  Blocks MUST use the data properties specified in their schema,
                  if any. They can expect these properties to be made available
                  to them by the embedding application, exactly how depending on
                  rendering context. For example, for a React component block
                  they would be passed as “props”. In a block with an HTML
                  entrypoint, appropriately sandboxed by the embedding
                  application, the properties would be in the global scope (of
                  the sandbox).
                </Typography>
              </>
            ),
          },
          {
            title: "Functions provided to blocks",
            anchor: "functions-provided-to-blocks",
            Content: () => (
              <>
                <a href="#functions-provided-to-blocks">
                  <Typography
                    id="functions-provided-to-blocks"
                    variant="bpHeading3"
                  >
                    Functions provided to blocks
                  </Typography>
                </a>
                <Typography variant="bpBodyCopy">
                  Subject to the permissions granted to them by the embedding
                  application, blocks can expect functions with the names and
                  signatures listed below to be made available to them, i.e. to
                  be passed in along with the properties defined in their
                  schema, or to be otherwise made available in their scope
                  depending on their implementation:
                </Typography>
              </>
            ),
          },
          {
            title: "Linking entities to other entities",
            anchor: "linking-entities-to-other-entities",
            Content: () => (
              <>
                <a href="#linking-entities-to-other-entities">
                  <Typography
                    id="linking-entities-to-other-entities"
                    variant="bpHeading3"
                  >
                    Linking entities to other entities
                  </Typography>
                </a>
                <Typography variant="bpBodyCopy">
                  Another special set of functions provided to blocks relate to
                  managing links between entities.
                </Typography>
              </>
            ),
          },
          {
            title: "Putting it all together - the data gets sent to blocks",
            anchor: "putting-it-all-together",
            Content: () => (
              <>
                <a href="#putting-it-all-together">
                  <Typography id="putting-it-all-together" variant="bpHeading3">
                    Putting it all together - the data gets sent to blocks
                  </Typography>
                </a>
                <Typography variant="bpBodyCopy">
                  A block can expect the following fields to be made available
                  to it, whether passed in as props or via another method
                  appropriate to their rendering strategy:
                </Typography>
              </>
            ),
          },
          {
            title: "Working with third-party data stores",
            anchor: "third-party-data-stores",
            Content: () => (
              <>
                <a href="#third-party-data-stores">
                  <Typography id="third-party-data-stores" variant="bpHeading3">
                    Working with third-party data stores
                  </Typography>
                </a>
                <Typography variant="bpBodyCopy">
                  Where blocks interact with third-party data stores, i.e. they
                  send data for storage outside the embedding application, they
                  SHOULD where possible keep the entity data in the embedding
                  application in sync, for example by:
                </Typography>
              </>
            ),
          },
        ],
      },
      {
        title: "Tracking user action",
        anchor: "tracking-user-action",
        Content: () => (
          <>
            <a href="#tracking-user-action">
              <Typography id="tracking-user-action" variant="bpHeading3">
                Tracking user action
              </Typography>
            </a>
            <Typography variant="bpBodyCopy">
              We are considering options for blocks reporting on user actions
              within them, both to allow the embedding application to track
              activity, and to be able to indicate user focus to other users
              where the application implements collaborative/multiplayer
              editing.
            </Typography>
          </>
        ),
      },
      {
        title: "Edit history",
        anchor: "editing-history",
        Content: () => (
          <>
            <a href="#editing-history">
              <Typography id="editing-history" variant="bpHeading3">
                Edit history
              </Typography>
            </a>
            <Typography variant="bpBodyCopy">
              While embedding applications can handle displaying an interface
              for reloading blocks at particular earlier versions, we will
              specify a way of communicating to blocks that (a) an earlier
              version is being displayed, and (b) the difference with the
              current version would allow blocks to implement visual diffs and
              so on.
            </Typography>
          </>
        ),
      },
      {
        title: "Comments",
        anchor: "comments",
        Content: () => (
          <>
            <a href="#comments">
              <Typography id="comments" variant="bpHeading3">
                Comments
              </Typography>
            </a>
            <Typography variant="bpBodyCopy">
              We want to facilitate users leaving comments on elements within
              blocks.
            </Typography>
          </>
        ),
      },
      {
        title: "Styling",
        anchor: "styling",
        Content: () => (
          <>
            <a href="#styling">
              <Typography id="styling" variant="bpHeading3">
                Styling
              </Typography>
            </a>
            <Typography variant="bpBodyCopy">
              Blocks SHOULD provide at least basic visual styling to allow them
              to be embedded and used without modification by any web
              application.
            </Typography>
          </>
        ),
      },
    ],
  },
  {
    href: "/spec/embedding-applications",
    title: "Embedding applications",
    Content: () => {
      const theme = useTheme();
      const areInlineInfoCardsHidden = useMediaQuery(
        theme.breakpoints.down(650),
      );

      return (
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="bpHeading3">
              Embedding application implementation
            </Typography>
            <Typography variant="bpBodyCopy">
              An embedding application is any app that renders blocks conforming
              to this protocol, by:
            </Typography>
            <ol>
              <li>
                <Typography variant="bpBodyCopy">
                  importing the source code for the blocks it wants to display
                  (whether at runtime or compiled along with its own source)
                </Typography>
              </li>
              <li>
                <Typography variant="bpBodyCopy">
                  combining the source with the data properties the block
                  requires (how exactly this works depends on the rendering
                  context)
                </Typography>
              </li>
              <li>
                <Typography variant="bpBodyCopy">
                  rendering the block on a webpage (or other application)
                </Typography>
              </li>
              <li>
                <Typography variant="bpBodyCopy">
                  providing any external dependencies the block requires
                </Typography>
              </li>
            </ol>
            {Array.from(Array(1000).keys()).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Typography key={i}>Block #{i}</Typography>
            ))}
          </Box>
          {areInlineInfoCardsHidden ? null : (
            <Box pl={3} width={250}>
              {WhatIsSpecificationInfoCard}
            </Box>
          )}
        </Box>
      );
    },
    sections: [
      {
        title: "Rendering blocks",
        anchor: "rendering-blocks",
        Content: () => <>rendering blocks</>,
      },
      {
        title: "Data validation",
        anchor: "data-validation",
        Content: () => <>data validation</>,
      },
      {
        title: "Styling",
        anchor: "styling",
        Content: () => <>styling</>,
      },
    ],
  },
  {
    title: "Appendix A: Block protocol CSS variables",
    href: "/spec/appendix-a",
    sections: [],
    isAppendix: true,
  },
  {
    title: "Appendix B: Accessibility (a11y)",
    href: "/spec/appendix-b",
    sections: [],
    isAppendix: true,
  },
  {
    title: "Appendix C: Internationalization (i18n)",
    href: "/spec/appendix-c",
    sections: [],
    isAppendix: true,
  },
];
