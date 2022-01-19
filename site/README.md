# blockprotocol.org website

The public-facing [blockprotocol.org](https://blockprotocol.org) website serves the following endpoints:

- `/gallery` shows the catalog of available blocks
- `/api/blocks` returns a JSON response w/ a list of available blocks
- `/blocks/<organisation>/<blockname>` is the CDN base-URL of an individual block (e.g. `/blocks/@hash/code`)
- `/partners` provides a temporary signup form to collect pre-release registrations of interest from potential adopters

## Local development

Before serving any blocks, they need to be built. Blocks can be registered in the repo's `/hub`
with a build-config. The build-script `/site/scripts/build-blocks.sh` allows to build blocks
individually. It requires the commandline tool:

- `curl`
- `jq`
- `md5sha1sum`
- `rsync`

These can be installed by your cli pkg mngr of choice (use `brew` on macOS).

```sh
# build one or more blocks
yarn build-block ./hub/@hash/paragraph.json
# build all blocks
yarn build-blocks
```

Once the blocks are built, simply `yarn dev [--cwd ./site] [--port 3001]` and head over to
`localhost:3001/gallery`.

## Vercel Deployment

If no build-config is provided to the build-script, it will pick up all build-configs changed by the
last commit. This is part of `yarn build` which is also used by the deployment platform Vercel.

Vercel preserves nextjs' cache `/site/.next/cache` between builds. The build script synchronizes its
results with that cache and rebuilds only what has changed to speed up builds.
