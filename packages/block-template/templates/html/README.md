# Block Protocol template: HTML

## Step one: copy this template

See [https://blockprotocol.org/docs/developing-blocks](https://blockprotocol.org/docs/developing-blocks)

**TL;DR:** Run `npx create-block-app [your-block-name] --template=html`

Other templates are available. See `npx create-block-app --help`

## Step two: write and build a component

1.  Change into the folder: `cd path/to/your-block-name`

1.  Update `block-metadata.json` and `block-schema.json` to define your block's metadata and the properties it takes.

1.  Write your block starting in `app.html`. To test it during development:

    - edit `dev.js` to give your block starting properties

    - run the dev server with `yarn dev`

1.  When finished, run `yarn build`, which:

    - Bundles the component into a single source file
    - Once uploaded to a remote folder, embedding applications can access `block-metadata.json` to load a block and its schema. This file is documented in full [here](https://blockprotocol.org/docs/spec).

Please see [the Block Protocol docs](https://blockprotocol.org/docs/developing-blocks)
for help in creating and updating data from your block.

N.B.

- JSON schema offers more [validations](https://json-schema.org/draft/2019-09/json-schema-validation.html) than TypeScript.

## Step three: publish your block

Head over to [blockprotocol.org](https://blockprotocol.org/docs/developing-blocks#publish) to read instructions on publishing your block.

## External Dependencies

The Block Component is self contained with all of its dependencies bundled with webpack. Any dependencies that will be provided by the embedding app should be added to `devDependencies` in package.json so they're available during development, and in `peerDependencies` if the component is to be made available as a library for importing via npm.

## Debugging

The component can be debugged locally by first starting `yarn dev`.

Now (using VS Code), go to the Debug tab, select "Launch Chrome" and start the debugger (F5).

You should now be able to set breakpoints and step through the code.
