# Block template: custom element

## Step one: copy this template

See [https://blockprotocol.org/docs/developing-blocks](https://blockprotocol.org/docs/developing-blocks)

**TL;DR:** Run `npx create-block-app@latest [your-block-name] --template=custom-element`

Other templates are available. See `npx create-block-app@latest --help`

## Step two: decide on and build the entity type for your block

A key part of the Block Protocol is the use of types to describe the data your block will work with.

Your block should be associated with an “entity type” which will be used by embedding applications
to understand what sorts of entities can be sent to it (e.g. what properties do they have?).

You can create an entity type on [blockprotocol.org](https://blockprotocol.org) — see [the docs](https://blockprotocol.org/docs/developing-blocks) for a full guide.

Once you have created the type representing the data your block needs, copy its URL for use in the next step.

## Step three: update your block's metadata

1.  Change into the folder: `cd path/to/your-block-name`

1.  Update the `blockprotocol` metadata object in package.json:

- set `schema` to the URL of the entity type you created in the previous step
- change the default `tagName` under `blockType` to the tag for your element
- optionally update additional fields which will be used to identify and describe the block when published:
  - `displayName`: a friendly display name
  - `examples`: an array of example data structures your block would accept and use
  - `image`: a preview image showing your block in action (in place of `public/block-preview.png`)
  - `icon`: an icon to be associated with your block (in place of `public/omega.svg`)
  - `name`: a slugified name for your block (which may differ to the package `name` in package.json)
    - this may either be in the format `slug` or `@namespace/slug` where `namespace` is your blockprotocol.org username

1.  Run `yarn schema` to automatically TypeScript types from your block's entity type / `schema`

## Step four: implement your block's logic and UI

This template uses the Lit custom element framework. Please see [the Lit docs](https://lit.dev/) for general help in defining an element using the framework.

1.  Write your block starting in `app.ts`. To test it during development:

    - edit `dev.tsx` to give your block starting properties

    - run the dev server with `yarn dev` (or `npm run dev`)

1.  When finished, run `yarn build` (or `npm run build`), which:

    - Bundles the component into a single source file
    - Generates a `block-metadata.json` file which:
      - brings in metadata from the `blockprotocol` object in `package.json` you set in step 2
      - defines the `externals` - libraries the block expects the host app to provide and won't bundle with itself – based on your stated `peerDependencies`

Inside your custom element class, the following properties are available:

- `this.blockEntity`: the entity associated with the block, which should comply with the entity type you specified
- `this.linkedEntities`: the link entities attached to the block entity, and the entities they point to
- `this.graph` an object containing the messages passed from the embedding application using the graph module, including `this.graph.blockEntitySubgraph` and `this.graph.readonly`

Please see [the Block Protocol docs](https://blockprotocol.org/docs/developing-blocks)
for a fuller explanation of querying, creating and updating entity data from your block.

You can format your code using `yarn format` (or `npm run format`).

## Step five: publish your block

Head over to [blockprotocol.org](https://blockprotocol.org/docs/developing-blocks#publish) to read instructions on publishing your block.

## Debugging

The component can be debugged locally by first starting `yarn dev`.

Now (using VS Code), go to the Debug tab, select "Launch Chrome" and start the debugger (F5).

You should now be able to set breakpoints and step through the code.
