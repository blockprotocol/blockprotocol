# esm.sh server for Block Protocol

Go to the [original repo](https://github.com/esm-dev/esm.sh) for its docs – this README just explains our usage.

## Where is it used?

We use esm.sh to load dependencies for blocks in the demo sandbox, e.g. the [Code block](https://blockprotocol.org/@hash/blocks/code).

The code that does this is [here](https://github.com/blockprotocol/blockprotocol/blob/main/apps/site/src/pages/api/rewrites/sandboxed-block-demo.api.ts).

## Why self-host?

esm.sh is a great project, but it has some stability issues. Updates occasionally mean that some imports fail, breaking the packages we are using it to import, which means that the block preview fails to load, breaking both user-facing pages and our CI (which test the block pages).

## Deployment

The Dockerfile in this folder builds esm.sh from a specific version and that image is deployed to AWS's ECS.

This process is not automated, instead:

1.  Test the image locally (see below)
1.  Build the image
1.  Tag the image as `latest` for the relevant ECR repository
1.  Push it to the repository
1.  Force a new deployment of the ECS service

To test the Docker image before deploying:

1.  Remove the `origin` key from `config.json` (otherwise some files will be fetched from the deployed server) and build the image (restore the key afterwards)
1.  `docker run -p 80:80 bp-esm` (you can expose a different port but amend the command below)
1.  Visit `localhost` and check you see the homepage
1.  In the `blockprotocol` repo, set `ESM_CDN_URL="http://localhost"` in `.env.local`
1.  Run `yarn dev` in the `blockprotocol` repo to start the site
1.  Visit a block page and check it works, e.g. http://localhost:3000/@hash/blocks/code
