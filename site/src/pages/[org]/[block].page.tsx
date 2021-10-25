import { Validator } from "jsonschema";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useState } from "react";
import { tw } from "twind";
import Navbar from "../../components/Navbar";
import { Snippet } from "../../components/Snippet";
import type { BlockMetadata } from "../api/blocks.api";

const validator = new Validator();

const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
  twind: require("twind"),
};

type BlockExports = { default: React.FC };
type BlockSchema = Record<string, any>;
type BlockDependency = keyof typeof blockDependencies;

const blockRequire = (name: BlockDependency) => {
  if (!(name in blockDependencies)) throw new Error(`missing dependency ${name}`);
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

const Block: NextPage = () => {
  const { org, block } = useRouter().query;

  const [text, setText] = useState("{}");
  const [schema, setSchema] = useState<BlockSchema | null>(null);
  const [metadata, setMetadata] = useState<BlockMetadata | null>(null);
  const [blockModule, setBlockModule] = useState<BlockExports | null>(null);

  useEffect(() => {
    if (!org || !block) return;
    fetch(`/blocks/${org}/${block}/metadata.json`)
      .then((response) => response.json())
      .then(setMetadata);
  }, [org, block]);

  useEffect(() => {
    if (!metadata) return;
    fetch(`/blocks/${org}/${block}/${metadata.schema}`)
      .then((response) => response.json())
      .then(setSchema);
  }, [metadata]);

  useEffect(() => {
    if (!metadata) return;
    fetch(`/blocks/${org}/${block}/${metadata.source}`)
      .then((response) => response.text())
      .then(blockEval)
      .then(setBlockModule);
  }, [metadata]);

  /** strictly speaking there's no need to cache results */
  const [props, errors] = useMemo<[object | undefined, string[]]>(() => {
    let props = undefined;

    try {
      props = JSON.parse(text);
    } catch (err) {
      return [props, [(err as Error).message]];
    }

    const errors = validator.validate(props, schema ?? {}).errors;
    return [props, errors.map((err) => `ValidationError: ${err.stack}`)];
  }, [text, schema]);

  if (!metadata || !schema) return null;

  return (
    <div
      className={tw`mx-auto px-4 mt-5 md:px-0 lg:max-w-4xl md:max-w-2xl`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar className={tw`mt-14`} />

      <main className={tw`mt-20 mb-10`}>
        <h1 className={tw`text-6xl font-black`}>
          {metadata.displayName}{" "}
          <img
            className={tw`inline-block`}
            width="32px"
            height="32px"
            src={`/blocks/${org}/${block}/${metadata.icon}`}
          />
        </h1>
        <p className={tw`text-lg font-bold mb-10`}>
          block from{" "}
          <a className={tw`text-blue-300 font-bold`} href="#">
            {org}
          </a>
        </p>
        <div className="flex flex-row mb-10">
          <div className={tw`w-3/5 pr-5`}>
            <h3 className={tw`mb-4`}>Input Data</h3>
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
              ></textarea>
            </div>
          </div>
          <div className={tw`w-2/5`}>
            <h3 className={tw`mb-4`}>Input Schema</h3>
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
          </div>
        </div>
        <div>
          <h3 className={tw`mb-2`}>Block Stage</h3>
          {errors.length ? (
            <p className={tw`mb-2`}>The provided input raised the following errors:</p>
          ) : (
            <p className={tw`mb-2`}>
              The provided input is schema conform. See below the rendered output.
            </p>
          )}
          {errors.length > 0 && (
            <ul className={tw`rounded-2xl list-square mb-2 px-8 py-4 bg-red-200`}>
              {errors.map((err) => (
                <li>{err}</li>
              ))}
            </ul>
          )}
          <div style={{ height: 320 }} className={tw`bg-white rounded-2xl w-full p-4`}>
            {blockModule && <blockModule.default {...props} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Block;
