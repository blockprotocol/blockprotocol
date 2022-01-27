/**
 * This is the entry point for developing and debugging.
 * This file is not bundled with the block during the build process.
 */
import React from "react";
import ReactDOM from "react-dom";

// eslint-disable-next-line import/no-extraneous-dependencies -- TODO update config properly
import MockBlockEmbedder from "mock-block-embedder";

import Component from "./index";

const node = document.getElementById("app");

const App = () => (
  <MockBlockEmbedder>
    <Component entityId="test-block-1" name="World" />
  </MockBlockEmbedder>
);

ReactDOM.render(<App />, node);
