import {
  Breadcrumbs,
  Container,
  Typography,
  Icon,
  Box,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
} from "@mui/material";
import { Validator } from "jsonschema";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, {
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent,
} from "react";
import { tw } from "twind";

import { Link, LinkProps } from "../../components/Link";
import { BlocksSlider } from "../../components/pages/home/BlocksSlider";
import { Snippet } from "../../components/Snippet";
import { BlockMetadata } from "../api/blocks.api";

const ChevronRight: React.VFC = () => (
  <Icon sx={{ fontSize: "0.8rem" }} className="fas fa-chevron-right" />
);

const BreadcrumbLink: React.FC<LinkProps> = ({ children, ...props }) => (
  <Link style={{ textDecoration: "none" }} {...props}>
    <Typography variant="bpSmallCopy">{children}</Typography>
  </Link>
);

const validator = new Validator();

/* eslint-disable global-require */
const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
  twind: require("twind"),
};

type BlockExports = { default: React.FC };
/** @sync @hashintel/block-protocol */
type BlockSchema = Record<string, any>;
type BlockDependency = keyof typeof blockDependencies;

interface PageState {
  schema?: BlockSchema;
  metadata?: BlockMetadata;
  blockModule?: BlockExports;
}

const blockRequire = (name: BlockDependency) => {
  if (!(name in blockDependencies)) {
    throw new Error(`missing dependency ${name}`);
  }

  return blockDependencies[name];
};

const blockEval = (source: string): BlockExports => {
  const exports_ = {};
  const module_ = { exports: exports_ };

  // eslint-disable-next-line no-new-func
  const moduleFactory = new Function("require", "module", "exports", source);
  moduleFactory(blockRequire, module_, exports_);

  return module_.exports as BlockExports;
};

const Bullet: VoidFunctionComponent = () => {
  return (
    <span style={{ color: "#DDE7F0", marginLeft: 5, marginRight: 5 }}>•</span>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Block: NextPage = () => {
  const org = "@hash";
  const { block } = useRouter().query;

  const [text, setText] = useState("{}");
  const [{ metadata, schema, blockModule }, setPageState] = useState<PageState>(
    {},
  );

  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));
  const isDesktopSize = md;

  // console.log({ metadata, schema, blockModule });

  useEffect(() => {
    if (!org || !block) return;
    void fetch(`/blocks/${org}/${block}/metadata.json`)
      .then((res) => res.json())
      .then((metadata_) =>
        Promise.all([
          metadata_,
          fetch(`/blocks/${org}/${block}/${metadata_.schema}`).then((res) =>
            res.json(),
          ),
          fetch(`/blocks/${org}/${block}/${metadata_.source}`).then((res) =>
            res.text(),
          ),
        ]),
      )
      .then(([metadata_, schema_, source]) => {
        setPageState({
          metadata: metadata_,
          schema: schema_,
          blockModule: blockEval(source),
        });
      });
  }, [org, block]);

  /** used to recompute props and errors on dep changes (caching has no benefit here) */
  const [props, errors] = useMemo<[object | undefined, string[]]>(() => {
    let result;

    try {
      result = JSON.parse(text);
    } catch (err) {
      return [result, [(err as Error).message]];
    }

    const errorMessages = validator
      .validate(result, schema ?? {})
      .errors.map((err) => `ValidationError: ${err.stack}`);

    return [result, errorMessages];
  }, [text, schema]);

  const [currentTab, setCurrentTab] = useState(0);

  if (!metadata || !schema) return null;

  return (
    <Container sx={{ marginTop: 5, marginBottom: 10 }}>
      {!isDesktopSize && (
        <Breadcrumbs separator={<ChevronRight />}>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbLink href="/hub">Block Hub</BreadcrumbLink>
          <BreadcrumbLink href={`/hub/${block}`}>
            {metadata.displayName}
          </BreadcrumbLink>
        </Breadcrumbs>
      )}

      <Box sx={{ display: "flex" }}>
        <Typography variant="bpHeading1">
          <Box
            sx={{ display: "inline-block", height: "2em", width: "2em" }}
            component="img"
            src={`/blocks/@hash/video/${metadata.icon}`}
          />
        </Typography>
        <div>
          <Typography variant="bpHeading1" mt={4}>
            {metadata.displayName}
          </Typography>
          <div>{metadata.description}</div>
          <div>
            By <Link href="https://hash.ai/@hash">{org}</Link> <Bullet /> V
            {metadata.version} <Bullet /> Updated Recently
          </div>
        </div>
      </Box>

      <div className="flex flex-row mb-10">
        <div className={tw`w-3/5 pr-5`}>
          <div
            style={{ height: 320 }}
            className={tw`bg-white rounded-2xl w-full p-4`}
          >
            {blockModule && <blockModule.default {...props} />}
          </div>
        </div>
        <div className={tw`w-2/5`}>
          <Tabs
            value={currentTab}
            onChange={(_event, newValue: number) => setCurrentTab(newValue)}
          >
            <Tab label="Input Schema" />
            <Tab label="Input Data" />
          </Tabs>
          <TabPanel value={currentTab} index={0}>
            <div
              style={{ height: 320, fontSize: 14 }}
              className={tw`rounded-2xl bg-gray-800 p-3 w-full`}
            >
              <Snippet
                className={tw`font-mono overflow-scroll h-full`}
                source={JSON.stringify(schema, null, 2)}
                language="json"
              />
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <div
              style={{ height: 320, fontSize: 14 }}
              className={tw`rounded-2xl bg-white p-3 w-full`}
            >
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                style={{ minHeight: "100%" }}
                className={tw`font-mono resize-none bg-white w-full overflow-scroll`}
                placeholder="Your block input goes here..."
              />
            </div>
          </TabPanel>
        </div>
      </div>

      <div className="flex flex-row mb-10">
        <div className={tw`w-3/5 pr-5`}>
          <b>About</b>
          <p>
            Store information in rows and columns in a classic table layout.
            Longer description talking about parameters and how to use like a
            readme goes in here. Tables have filters, search, ability to add and
            remove columns and rows, multiple views. Tables have filters,
            search, ability to add and remove columns and rows, multiple views.
            Tables have filters, search, ability to add and remove columns and
            rows, multiple views. Tables have filters, search, ability to add
            and remove columns and rows, multiple views.
          </p>
        </div>
        <div className={tw`w-2/5`}>
          <b>Repository</b>
          <Box sx={{ display: "flex" }}>
            <img
              alt="GitHub Link"
              style={{ marginRight: 5 }}
              src="/assets/link.svg"
            />{" "}
            <Link href="https://github.com/hash/video">
              github.com/hash/video
            </Link>
          </Box>
        </div>
      </div>
      <div>
        {errors.length ? (
          <p className={tw`mb-2`}>
            The provided input raised the following errors:
          </p>
        ) : (
          <p className={tw`mb-2`}>
            The provided input is schema conform. See below the rendered output.
          </p>
        )}
        {errors.length > 0 && (
          <ul className={tw`rounded-2xl list-square mb-2 px-8 py-4 bg-red-200`}>
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      <Typography variant="bpHeading2" mb={3}>
        Explore more blocks
      </Typography>

      <BlocksSlider />
    </Container>
  );
};

export default Block;
