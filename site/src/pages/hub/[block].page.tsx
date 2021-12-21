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
import { BlockDataTabPanels } from "../../components/pages/hub/BlockDataTabPanels";
import { BlockDataTabs } from "../../components/pages/hub/BlockDataTabs";
import {
  blockDependencies,
  BlockDependency,
  BlockSchema,
  disableTabAnimations,
  dummyUploadFile,
  getEmbedBlock,
} from "../../components/pages/hub/HubUtils";
import { TabPanel } from "../../components/pages/hub/TabPanel";
import { BlockMetadata } from "../api/blocks.api";
import { BlockTabsModal } from "../../components/pages/hub/BlockTabsModal";
import { BlockModalButton } from "../../components/pages/hub/BlockModalButton";

const ChevronRight: React.VFC = () => (
  <Icon sx={{ fontSize: "0.8rem" }} className="fas fa-chevron-right" />
);

const BreadcrumbLink: React.FC<LinkProps> = ({ children, ...props }) => (
  <Link style={{ textDecoration: "none" }} {...props}>
    <Typography variant="bpSmallCopy">{children}</Typography>
  </Link>
);

const validator = new Validator();

type BlockExports = {
  default: React.FC;
};

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
      result.accountId = "test-account-id";
      result.entityId = "test-entity-id";
      result.uploadFile = dummyUploadFile;
      result.getEmbedBlock = getEmbedBlock;
    } catch (err) {
      return [result, [(err as Error).message]];
    }

    const errorsToEat = ["uploadFile", "getEmbedBlock"];

    const errorMessages = validator
      .validate(result, schema ?? {})
      .errors.map((err) => `ValidationError: ${err.stack}`)
      .filter(
        (err) => !errorsToEat.some((errorToEat) => err.includes(errorToEat)),
      );

    return [result, errorMessages];
  }, [text, schema]);

  const [blockDataTab, setBlockDataTab] = useState(0);
  const [blockTab, setBlockTab] = useState(0);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

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
            src={`/blocks/${org}/${block}/${metadata.icon}`}
          />
        </Typography>
        <div>
          <Typography variant="bpHeading1" mt={2}>
            {metadata.displayName}
          </Typography>
          <Typography variant="bpBodyCopy">
            <div style={{ color: "#4D5C6C" }}>{metadata.description}</div>
          </Typography>
          <Typography variant="bpSmallCopy">
            <div style={{ color: "#64778C" }}>
              By {org}
              <Bullet /> V{metadata.version} <Bullet /> Updated Recently
            </div>
          </Typography>
        </div>
      </Box>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60% 40%",
          marginTop: 20,
        }}
        className="mb-10"
      >
        <div>
          <div style={{ height: 320 }} className={tw`bg-white`}>
            <Tabs
              disableRipple
              disableTouchRipple
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  color: "#64778C",
                },
                "& .MuiTab-root.Mui-selected": {
                  backgroundColor: "#F7FAFC",
                  color: "#6048E5",
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                },
              }}
              value={blockTab}
              onChange={(_event, newValue: number) => setBlockTab(newValue)}
            >
              <Tab {...disableTabAnimations} label={metadata.displayName} />
            </Tabs>
            <TabPanel value={blockTab} index={0}>
              <div
                style={{
                  backgroundColor: "#F7FAFC",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 30px",
                  overflow: "auto",
                }}
              >
                {blockModule && <blockModule.default {...props} />}
              </div>
            </TabPanel>
          </div>
        </div>
        <div>
          <BlockDataTabs
            blockDataTab={blockDataTab}
            setBlockDataTab={setBlockDataTab}
          />

          <div
            style={{
              position: "relative",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          >
            <BlockDataTabPanels
              blockDataTab={blockDataTab}
              text={text}
              setText={setText}
              schema={schema}
            />

            <div
              style={{
                position: "absolute",
                height: "80px",
                width: "100%",
                bottom: 0,
                background:
                  "linear-gradient(0deg, #39444F 18.14%, rgba(57, 68, 79, 0) 100%)",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                textAlign: "right",
              }}
            >
              <BlockModalButton setBlockModalOpen={setBlockModalOpen} />
              <BlockTabsModal
                open={blockModalOpen}
                setOpen={setBlockModalOpen}
                blockDataTab={blockDataTab}
                setBlockDataTab={setBlockDataTab}
                schema={schema}
                text={text}
                setText={setText}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div
        style={{ display: "grid", gridTemplateColumns: "60% 40%" }}
        className=" mb-10"
      >
        <div>
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
        <div>
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
      </div> */}

      <div style={{ display: "grid", gridTemplateColumns: "60% 40%" }}>
        <div />
        <div>
          {errors.length > 0 && (
            <details className={tw`rounded-2xl mt-2 px-8 py-4 bg-red-200`}>
              <summary style={{ cursor: "pointer" }}>Errors</summary>
              <ul className={tw`list-square px-8 py-4 `}>
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>

      <Typography
        variant="bpHeading2"
        mb={3}
        sx={{ textAlign: "center", marginTop: 10 }}
      >
        Explore more blocks
      </Typography>

      <BlocksSlider />
    </Container>
  );
};

export default Block;
