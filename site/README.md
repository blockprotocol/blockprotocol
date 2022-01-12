# blockprotocol.org website

The public-facing [blockprotocol.org](https://blockprotocol.org) website serves the following endpoints:

- `/gallery` shows the catalog of available blocks
- `/api/blocks` returns a JSON response w/ a list of available blocks
- `/blocks/<organisation>/<blockname>` is the CDN base-URL of an individual block (e.g. `/blocks/@hash/code`)
- `/partners` provides a temporary signup form to collect pre-release registrations of interest from potential adopters

## Local development

### BP Site

1.  Add a `site/.env.local` environment variable file with the following environment variables:

    - `SESSION_SECRET`: the secret used to sign the session ID cookie
    - `MONGODB_URI`: the URL where the mongo developer db instance is hosted (for example at `mongodb://root:password@localhost:27017/`)
    - `MONGODB_DB_NAME`: the name of the database (for example `local`)
    - `MONGODB_USERNAME`: the database username
    - `MONGODB_PASSWORD`: the database password
    - `FRONTEND_DOMAIN` (optional): the domain where the frontend is hosted (defaults to `localhost:3000`)

1.  Install dependencies using:

    ```sh
    yarn install
    ```

1.  Run the developer database using:

    ```sh
    yarn dev:db
    ```

1.  **On first run**, or if you want to reset app data, seed the databse in a seperate terminal using:

    ```sh
    yarn dev:seed-db
    ```

1.  Run the Next.js app in a seperate terminal using:

    ```sh
    yarn dev
    ```

### Serving Blocks

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

## API Routes

### `POST /api/signup`

Request Body:

- `email`: the email address to associate with the BP account

Response Body:

- `userId`: the id of the created BP user
- `emailVerificationCodeId`: the id of the email verification code

### `POST /api/verifyEmail`

Request Body:

- `userId`: the id of the BP user
- `emailVerificationCodeId`: the id of the email verification code
- `code`: the one-time memorable email verification code sent to the user's email

Response Body:

- `user`: the updated BP user

### `GET /api/isShortnameTaken`

Request Query:

- `shortname`: the shortname that may or may not already be associated with another BP account

Response: `true` or `false`

### `POST /api/completeSignup` [authenticated]

Request Body:

- `shortname`: the shortname to associate with the BP account
- `preferredName`: the preferred name of the user associated with the BP account

Response Body:

- `user`: the updated BP user

### `POST /api/sendLoginCode`

Sends a login code to an existing BP user's email.

- Request Body:

  - `email`: the email address associated with the BP user

- Response Body:
  - `userId`: the id of the BP user
  - `loginCodeId`: the id of the login code sent to the user (required for `/api/loginWithLoginCode`)

### `POST /api/loginWithLoginCode`

Logs in a user using a provide login code.

- Request Body:

  - `userId`: the id of the BP user
  - `loginCodeId`: the id of the login code
  - `code`: the memorable one-time login code sent to the user's email

- Request Response:
  - `user`: the user that is now authenticated with the API

### `GET /api/me` [authenticated]

Retrieves the user object of the currently logged in user.

- Request Response:
  - `user`: the user currently authenticated with the API

### `POST /api/logout` [authenticated]

Logs out the currently authenticated user.

- Request Response: `SUCCESS`
