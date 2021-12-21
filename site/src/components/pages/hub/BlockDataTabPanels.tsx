import { VoidFunctionComponent } from "react";
import { tw } from "twind";

import { Snippet } from "../../Snippet";
import { BlockSchema } from "./HubUtils";
import { TabPanel } from "./TabPanel";

interface BlockDataTabPanelProps {
  modalOpen?: boolean;
  blockDataTab: number;
  schema: BlockSchema;
  text: string;
  setText: (newValue: string) => void;
}

export const BlockDataTabPanels: VoidFunctionComponent<
  BlockDataTabPanelProps
> = ({ blockDataTab, schema, text, setText, modalOpen }) => {
  const modalHeight = modalOpen ? "60vh" : 320;

  return (
    <>
      <TabPanel value={blockDataTab} index={1}>
        <div
          style={{
            height: modalHeight,
            fontSize: 14,
            backgroundColor: "#37434F",
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
          className={tw` p-3 w-full`}
        >
          <Snippet
            className={tw`font-mono overflow-auto h-full whitespace-break-spaces`}
            source={JSON.stringify(schema, null, 2)}
            language="json"
          />
        </div>
      </TabPanel>
      <TabPanel value={blockDataTab} index={0}>
        <div
          style={{ height: modalHeight, fontSize: 14 }}
          className={tw` w-full`}
        >
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            style={{
              minHeight: "100%",
              backgroundColor: "#37434F",
              color: "white",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
            className={tw`font-mono resize-none p-3 w-full overflow-auto`}
            placeholder="Your block input goes here..."
          />
        </div>
      </TabPanel>
    </>
  );
};
