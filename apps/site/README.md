# blockprotocol.org website

This folder contains the code for [blockprotocol.org](https://blockprotocol.org), including:

- the [Block Protocol specification](https://blockprotocol.org/docs/spec) at [src/\_pages/spec](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs/3_spec)
- the [explanatory documentation](https://blockprotocol.org/docs) at [src/\_pages/docs](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs)

## Local development

### BP Site

1.  Add a `apps/site/.env.local` environment variable file with the following environment variables:

    - `HASHING_SECRET`: the secret used to hash API keys
    - `SESSION_SECRET`: the secret used to sign the session ID cookie
    - `MONGODB_URI`: the URL where the mongo developer db instance is hosted (for example at `mongodb://root:password@localhost:27017/`)
    - `MONGODB_DB_NAME`: the name of the database (for example `local`)
    - `MONGODB_USERNAME`: the database username
    - `MONGODB_PASSWORD`: the database password
    - `NEXT_PUBLIC_FRONTEND_URL` (optional): the URL where the frontend is hosted (defaults to `http://localhost:3000`)
    - `NEXT_PUBLIC_BILLING_FEATURE_FLAG` (optional): set to "1" to enable the "billing" feature flag
    - `INTERNAL_API_KEY` (optional): the internal API key, required when the "billing" feature flag is enabled
    - `INTERNAL_API_BASE_URL` (optional): the URL where the internal API is hosted (defaults to `http://localhost:5001`)
    - `NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY` (optional): the stripe public API key, which can be obtained from the developer console at https://dashboard.stripe.com/test/apikeys or https://dashboard.stripe.com/apikeys

    Example minimal file at `apps/site/.env.local` (with **zero** security) to make local development work when following the instructions below:

    ```sh
    SESSION_SECRET=dev-session-secret
    HASHING_SECRET=dev-hashing-secret
    
    MONGODB_URI=mongodb://root:password@localhost:27017/
    MONGODB_DB_NAME=local
    
    S3_API_ENDPOINT=http://localhost:9000
    S3_BASE_URL=http://localhost:9001/dev-bucket
    S3_BUCKET=dev-bucket
    S3_ACCESS_KEY_ID=dev-access-key
    S3_SECRET_ACCESS_KEY=dev-secret-key
    ```

1.  Install dependencies using:

    ```sh
    yarn install
    ```

1.  Run the developer database using:

    ```sh
    yarn dev:db
    ```

1.  **On first run**, or if you want to reset app data, seed the database in a separate terminal using:

    ```sh
    yarn dev:seed-db
    ```

1.  **On first run**, or **if you need to rebuild a block or blocks**, follow the steps to [build Hub blocks](#building-hub-blocks)

1.  Run the Next.js app in a separate terminal using:

    ```sh
    yarn dev
    ```

### API block publishing configuration

If you want to publish blocks via the API, you will need to configure S3 variables:

- `S3_API_ENDPOINT`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_BASE_URL`

API-published blocks are uploaded to S3-compatible storage (e.g. R2). This is not necessary for blocks added to the `hub/` folder in the repo.

During local development, an S3-compatible service (`minio`) is automatically started, and can be used with the environment variables listed in the local [site](#bp-site) instructions. You typically should not need to connect to remote storage during local development.

Avatars are uploaded to the `avatars/(user.id)` folder within the bucket root.
When running in development environments, avatars go to the `dev/avatars/(user.id)` folder of the bucket.

### AWS configuration

If you want to send verification codes to an email address, the following AWS environment variables have to be additionally configured:

- `BP_AWS_REGION`: The region, eg. `us-east-1`
- `BP_AWS_ACCESS_KEY_ID`: The AWS access key
- `BP_AWS_SECRET_ACCESS_KEY`: The AWS secret access key

### Building Hub blocks

Before serving any blocks via the Hub, they need to be prepared (i.e. built in most cases).
Blocks can be registered in the repo's `/hub` with a build-config.
The build-script `yarn workspace @apps/site exe prepare-blocks.ts` prepares blocks.

```sh
# prepare all blocks
yarn workspace @apps/site exe scripts/prepare-blocks.ts

# prepare blocks matching a filter (in this example, any in the `hub/@hash` folder)
BLOCK_FILTER="@hash/*" workspace @apps/site exe scripts/prepare-blocks.ts
```

Once the blocks are built, simply `yarn dev` and head over to
`localhost:3000/hub`.

## Vercel Deployment

If no build-config is provided to the build-script, it will pick up all build-configs changed by the
last commit. This is part of `yarn build` which is also used by the deployment platform Vercel.

Vercel preserves nextjs' cache `apps/site/.next/cache` between builds. The build script synchronizes its
results with that cache and rebuilds only what has changed to speed up builds.

## API Routes

### Unauthenticated (or via code in request body)

#### `POST /api/signup`

Request Body:

- `email`: the email address to associate with the BP account

Response Body:

- `userId`: the id of the created BP user
- `emailVerificationCodeId`: the id of the email verification code

#### `POST /api/verify-email`

Request Body:

- `userId`: the id of the BP user
- `emailVerificationCodeId`: the id of the email verification code
- `code`: the one-time memorable email verification code sent to the user's email

Response Body:

- `user`: the updated BP user

#### `POST /api/login-with-login-code`

Logs in a user using a provide login code.

- Request Body:

  - `userId`: the id of the BP user
  - `loginCodeId`: the id of the login code
  - `code`: the memorable one-time login code sent to the user's email

- Request Response:
  - `user`: the user that is now authenticated with the API

#### `GET /api/is-shortname-taken`

Request Query:

- `shortname`: the shortname that may or may not already be associated with another BP account

Response: `true` or `false`

#### `GET /api/users/[shortname]`

Route Parameter:

- `shortname`: the shortname of the user to retrieve

Response:

- `user`: the user

#### `GET /api/users/[shortname]/blocks`

Route Parameters

- `shortname`: the shortname of the user to retrieve blocks for

Response:

- `blocks` An array of metadata objects for the blocks belonging to the user

#### `GET /api/users/[shortname]/types`

Route Parameters

- `shortname`: the shortname of the user to retrieve types for

Response:

- `entityTypes` An array of entity types belonging to the user

#### `GET /api/users/[shortname]/types/[title]`

Route Parameters

- `shortname`: the shortname of the user to retrieve a type for
- `title`: the title of the type to retrieve

Response:

- `entityType` the entity type with the provided title belonging to the specified user

#### `GET /api/types/[entityTypeId]`

Route Parameters

- `entityTypeId`: the unique id of the entity type

Response:

- `entityType` the entity type with the specified id

### Cookie authentication required

#### `POST /api/types/create` [requires cookie authentication]

Creates an entity type belonging to the requesting user.

Request Body

- `schema`: a valid JSON schema object. Must have a `title` property, unique to the requesting user.

Response:

- `entityType` the created entity type

#### `PUT /api/types/[id]/update` [requires cookie authentication]

Updates an entity type belonging to the requesting user.

Request Body

- `schema`: a valid JSON schema object, which will overwrite the existing one.

Response:

- `entityType` the updated entity type

#### `POST /api/complete-signup` [requires cookie authentication]

Request Body:

- `shortname`: the shortname to associate with the BP account
- `preferredName`: the preferred name of the user associated with the BP account

Response Body:

- `user`: the updated BP user

#### `POST /api/send-login-code` [requires cookie authentication]

Sends a login code to an existing BP user's email.

- Request Body:

  - `email`: the email address associated with the BP user

- Response Body:
  - `userId`: the id of the BP user
  - `loginCodeId`: the id of the login code sent to the user (required for `/api/login-with-login-code`)

#### `GET /api/me` [requires cookie authentication]

Retrieves the user object of the currently logged in user.

- Request Response:
  - `user`: the user currently authenticated with the API

#### `GET /api/me/api-keys` [requires cookie authentication]

Retrieves metadata on the API keys associated with the authenticated user.

- Request Response:
  - `apiKeys`: metadata on API keys (the key itself is only visible at the point of generation)

#### `POST /api/me/generate-api-key` [requires cookie authentication]

Generates a new API key for the authenticated user, and revokes any others.

- Request Body:

  - `displayName`: a display name for the API key

- Request Response:
  - `apiKey`: the key itself, a string.

#### `POST /api/logout` [requires cookie authentication]

Logs out the currently authenticated user.

- Request Response: `SUCCESS`

#### `POST /api/upload-user-avatar` [requires cookie authentication]

Uploads a user avatar and apply it to logged in profile page.

- Multipart Request Body:

  - `image`: The image file to be uploaded, extension must be one of jpg, jpeg, png, gif or svg.

- Response Body:
  - `avatarUrl`: Url pointing to the newly uploaded user avatar.

#### `POST /api/blocks/create`

Creates and mirrors a block published to npm. Only permitted if `process.env.NEXT_PUBLIC_NPM_PUBLISHING` is truthy

Request Body:

- `npmPackageName`: the email address to associate with the BP account
- `blockName`: the name to give the block

Response Body:

- `block` the created block's metadata
-

#### `POST /api/blocks/update`

Updates and mirrors a block published to npm. Only permitted if `process.env.NEXT_PUBLIC_NPM_PUBLISHING` is truthy

Request Body:

- `blockName`: the name of the block, previously created via `/api/blocks/create`

Response Body:

- `block` the created block's metadata

### API key required

The following routes require a valid API key sent in an `x-api-key` header:

#### `GET /api/blocks` [requires API key authentication]

- Request Params

  - `author`: an optional text query to search for blocks with a matching author.
  - `license`: an optional text query to search for blocks with a matching license. Note: The license name needs to be matching.
  - `name`: an optional text query to search for blocks with a matching name.
  - `q`: an optional text query to search for blocks with a matching name or author.
  - `json`: an optional JSON object that filters blocks by schema validity. Preferably URL encoded.

If all of the optional params are missing, the result will contain all of the blocks.

- Request Response:
  - `results`: the results of the search: an array of block metadata JSON files

#### `POST /api/blocks/publish`

Publishes a block or republishes an existing block by providing source files.

Request multi-part form:

- `blockName`: the name to give the block, or the existing block if previously published
- `tarball`: a `File`, in tarball format, containing the block distribution

Response Body:

- `block` the published block's metadata

## Testing

[blockprotocol.org](https://blockprotocol.org) is covered by browser-based tests written with [Playwright](https://playwright.dev).
These tests are located in the `apps/site/tests` folder.
They are grouped into:

- integration tests
- end-to-end (E2E) tests
- universal tests, i.e those that belong to both categories

### [Integration tests](https://en.wikipedia.org/wiki/Integration_testing)

These tests are designed to extensively cover the functionality of the app.
They require a local database and the ability to write data to it.
Integration tests do not depend on any third-party services to avoid performance bottlenecks.
Requests to online resources (except CDNs) should be blocked or mocked.
Integration tests are a part of CI together with other checks ([ci.yml](https://github.com/blockprotocol/blockprotocol/actions/workflows/ci.yml)).

To run integration tests locally, prepare the blocks, launch the database and start the Next.js app as you would do this for local development.
Then run this command in a separate terminal:

```sh
yarn workspace @apps/site playwright test --project integration-chrome
```

You can pick a different [Playwright project](./playwright.config.ts) (e.g. `--project=integration-iphone`) or limit the tests you want to run (e.g. `--grep="My test title"`).

Note that local app data will be modified by the tests.

### [E2E tests](https://www.browserstack.com/guide/end-to-end-testing)

End-to-end (E2E) are designed to run against Vercel deployments.
Their goal is to supplement integration tests to sense-check deployed instances of the website.
E2E tests are read-only, which helps avoid data corruption in production and reduces execution time.
We automatically run E2E tests for all new Vercel deployments and on schedule to spot potential regressions ([site-deployment.yml](https://github.com/blockprotocol/blockprotocol/actions/workflows/site-deployment.yml)).

To run E2E test locally, use this command:

```sh
export PLAYWRIGHT_TEST_BASE_URL=https://blockprotocol.org

yarn workspace @apps/site playwright test --project e2e
```

Omitting `PLAYWRIGHT_TEST_BASE_URL` will launch E2E tests for a locally running Þ instance.
This is helpful for debugging.

### Test coverage

When running site integration tests in CI, we collect test coverage and report it to [codecov.io](https://codecov.io) (https://app.codecov.io/gh/blockprotocol/blockprotocol).
This helps us detect parts of the site that are potentially more prone to bugs.

The resulting coverage report includes source files in the `apps/site` folder.
A statement is marked as covered if it has been invoked during either `next build` or `next start` (both on the Node.js side and in the browser).

E2E tests do not report coverage as they run against a production-like server environment and are designed to only sense-check the deployment.
If we add unit tests in the future, we can generate two or more coverage reports independently and they will be merged by [codecov.io](https://codecov.io).

We use [`babel-plugin-istanbul`](https://www.npmjs.com/package/babel-plugin-istanbul) to instrument source code with coverage reporting.
[`nyc`](https://www.npmjs.com/package/nyc) collects coverage on the Node.js side during `next build` and `next start` phases.
Client-side test coverage is collected via [`playwright-test-coverage`](https://www.npmjs.com/package/playwright-test-coverage) which we import in Playwright tests.

The easiest way to explore test coverage is to submit a pull request and wait for integration tests to complete in CI.
You will then see a PR comment by [**@codecov**](https://github.com/marketplace/codecov) with a coverage summary.

If you want to explore test coverage locally, follow the steps below.
All commands are executed from the repo root dir.

1.  Set `TEST_COVERAGE` environment variable in your terminal:

    ```sh
    ## posix terminals
    export TEST_COVERAGE=true
    
    ## cmd.exe & PowerShell
    set TEST_COVERAGE=true
    ```

1.  Build the site:

    ```sh
    yarn workspace @apps/site build
    ```

1.  Start the site:

    ```sh
    yarn workspace @apps/site start
    ```

1.  Open another terminal and run integration tests, e.g.:

    ```sh
    yarn workspace @apps/site playwright test --project=integration-chrome
    ```

    You can pick a different [Playwright project](./playwright.config.ts) (e.g. `--project=integration-iphone`) or limit the tests you want to run (e.g. `--grep="My test title"`).

1.  Stop the site by pressing `ctrl+c` (`SIGINT`) in the first terminal.

    The above steps will generate raw coverage data in the repo’s `.nyc_output` directory.

1.  Generate coverage report from the raw data:

    ```sh
    yarn nyc report --reporter=lcov --reporter=text
    ```

    This command will show coverage stats in the terminal and also create `coverage/lcov-report/index.html` which you can explore locally.

## Telemetry

### Google Tag Manager

We monitor site usage via [react-gtm-module](https://www.npmjs.com/package/react-gtm-module).
Google Tag Manager is only enabled for production deployments (i.e. when `NEXT_PUBLIC_VERCEL_ENV` is equal to `"production"`).

### Sentry

Runtime errors in Vercel deployments are reported to [sentry.io](https://sentry.io) via [@sentry/nextjs](https://www.npmjs.com/package/@sentry/nextjs).
`NEXT_PUBLIC_VERCEL_ENV` is used internally to distinguish between `"preview"` and `"production"` environments.

Sentry is disabled by default for local development.
To experiment with Sentry events, define `NEXT_PUBLIC_SENTRY_DSN` in your terminal before launching the dev command.
If you are a HASH team member, you will find the value at https://sentry.io/settings/hashintel/projects/blockprotocol-site/keys/.
Otherwise, consider creating your own Sentry project to report the events to.
You should avoid setting `NEXT_PUBLIC_VERCEL_ENV` to `"preview"` or `"production"` as this will clutter the reports.

## Vercel Analytics

We use [Vercel Analytics](https://vercel.com/analytics) to measure [web vitals](https://web.dev/learn-web-vitals/) in production.
It is configured automatically and the dashboard can be accessed internally at https://vercel.com/hashintel/blockprotocol/analytics.
