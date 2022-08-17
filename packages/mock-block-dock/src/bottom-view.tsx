// @todo rename

import { Box } from "@mui/material";
import { useRef, useState } from "react";

import { JsonView } from "./json-view";

// @todo add resize functionality

export const BottomView = ({
  propsToInject,
  datastore,
  readonly,
  setReadonly,
}) => {
  const containerRef = useRef<HTMLElement>();

  return (
    <Box
      ref={containerRef}
      //   height={400}
      sx={{
        position: "fixed",
        height: 300,
        left: 250,
        right: 0,
        bottom: 0,
        zIndex: 10,
        boxShadow: 4,
        backgroundColor: "white",
        overflowY: "scroll",
        p: 4,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/869  */}
      <label style={{ display: "block", marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={readonly}
          onChange={(evt) => setReadonly(evt.target.checked)}
        />
        Read only mode
      </label>
      <Box height={20} />
      Block Properties
      <JsonView collapseKeys={["graph"]} rootName="props" src={propsToInject} />
      {/*  */}
      <Box height={30} />
      Datastore
      <JsonView
        collapseKeys={[
          "entities",
          "entityTypes",
          "links",
          "linkedAggregations",
        ]}
        rootName="datastore"
        src={{
          entities: datastore.entities,
          entityTypes: datastore.entityTypes,
          links: datastore.links,
          linkedAggregations: datastore.linkedAggregationDefinitions,
        }}
      />
    </Box>
  );
};
