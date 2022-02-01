import * as React from "react";
import * as ReactDOM from "react-dom";
import { TestBlock } from "./TestBlock";
import { MockBlockDock } from "../src/MockBlockDock";

const node = document.getElementById("app");

const DevApp = () => {
  const [name, setName] = React.useState("World");

  return (
    <div>
      <button
        onClick={() => {
          if (name === "World") {
            setName("Internet");
          } else {
            setName("World");
          }
        }}
        type="button"
      >
        Switch
      </button>
      <br />
      <MockBlockDock>
        <TestBlock entityId="test-entity-1" name={name} />
      </MockBlockDock>
    </div>
  );
};

ReactDOM.render(<DevApp />, node);
