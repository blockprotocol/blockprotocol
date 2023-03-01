# Block Protocol template: HTML

## Step one: copy this template

See [https://blockprotocol.org/docs/developing-blocks](https://blockprotocol.org/docs/developing-blocks)

**TL;DR:** Run `npx create-block-app@latest [your-block-name] --template=html`

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
- optionally update additional fields which will be used to identify and describe the block when published:
  - `displayName`: a friendly display name
  - `examples`: an array of example data structures your block would accept and use
  - `image`: a preview image showing your block in action (in place of `public/block-preview.png`)
  - `icon`: an icon to be associated with your block (in place of `public/omega.svg`)
  - `name`: a slugified name for your block (which may differ to the package `name` in package.json)
    - this may either be in the format `slug` or `@namespace/slug` where `namespace` is your blockprotocol.org username

## Step four: implement your block's logic and UI

1.  Write your block starting in `app.html`. To test it during development:

    - edit `dev/index.html` to give your block starting properties

    - run the dev server with `yarn dev` (or `npm run dev`)

1.  When finished, run `yarn build` (or `npm run build`), which:

    - Bundles the component into a single source file
    - Once uploaded to a remote folder, embedding applications can access `block-metadata.json`. This file is documented in full [here](https://blockprotocol.org/docs/spec).

Please see [the Block Protocol docs](https://blockprotocol.org/docs/developing-blocks)
for a fuller explanation of querying, creating and updating entity data from your block.
You can format your code using `yarn format` (or `npm run format`).

## Step three: publish your block

Head over to [blockprotocol.org](https://blockprotocol.org/docs/developing-blocks#publish) to read instructions on publishing your block.

## External Dependencies

This template assumes there is no bundling process. You will need to reference external dependencies using ES Modules. Tools like [esm.sh](https://esm.sh) or [unpkg.com](https://unpkg.com) can make this much easier.

## Debugging

The component can be debugged locally by first starting `yarn dev`.

Now (using VS Code), go to the Debug tab, select "Launch Chrome" and start the debugger (F5).

You should now be able to set breakpoints and step through the code.
