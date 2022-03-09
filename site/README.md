# blockprotocol.org website

The public-facing [blockprotocol.org](https://blockprotocol.org) website serves the following endpoints:

- `/gallery` shows the catalog of available blocks
- `/api/blocks` returns a JSON response w/ a list of available blocks
- `/blocks/<organisation>/<blockname>` is the CDN base-URL of an individual block (e.g. `/blocks/@hash/code`)
- `/partners` provides a temporary signup form to collect pre-release registrations of interest from potential adopters

## Local development

### BP Site

1.  Add a `site/.env.local` environment variable file with the following environment variables:

    - `HASHING_SECRET`: the secret used to hash API keys
    - `SESSION_SECRET`: the secret used to sign the session ID cookie
    - `MONGODB_URI`: the URL where the mongo developer db instance is hosted (for example at `mongodb://root:password@localhost:27017/`)
    - `MONGODB_DB_NAME`: the name of the database (for example `local`)
    - `MONGODB_USERNAME`: the database username
    - `MONGODB_PASSWORD`: the database password
    - `NEXT_PUBLIC_FRONTEND_URL` (optional): the URL where the frontend is hosted (defaults to `http://localhost:3000`)

    Example minimal file at `site/.env.local` (with **zero** security) to make local development work when following the instructions below:

    ```sh
    SESSION_SECRET=dev-session-secret
    HASHING_SECRET=dev-hashing-secret
    
    MONGODB_URI=mongodb://root:password@localhost:27017/
    MONGODB_DB_NAME=local
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

1.  Run the Next.js app in a seperate terminal using:

    ```sh
    yarn dev
    ```

### AWS configuration

If you want to send verification codes to an email address, the following AWS environment variables have to be additionally configured:

- `BP_AWS_REGION`: The region, eg. `us-east-1`
- `BP_AWS_ACCESS_KEY_ID`: The AWS access key
- `BP_AWS_SECRET_ACCESS_KEY`: The AWS secret access key

The above environment variables will also be used for S3 access for allowing user avatar uploads.
The default S3 bucket name is `blockprotocol` but can optionally be customized with the following environment variable:

- `BP_AWS_S3_BUCKET_NAME`: The name of the S3 bucket to store files in (e.g. user avatars)

Avatars are uploaded to the `avatars/(user.id)` folder within the bucket root.
When running in development environments, avatars go to the `dev/avatars/(user.id)` folder of the bucket.

### Serving Blocks

Before serving any blocks, they need to be prepared (i.e. built in most cases).
Blocks can be registered in the repo's `/hub` with a build-config.
The build-script `yarn exe site/scripts/prepare-blocks.ts` prepares blocks.

```sh
# prepare all blocks
yarn exe site/scripts/prepare-blocks.ts

# prepare blocks matching a filter (in this example, any in the `hub/@hash` folder)
BLOCK_FILTER="@hash/*" yarn exe site/scripts/prepare-blocks.ts
```

Once the blocks are built, simply `yarn dev` and head over to
`localhost:3000/hub`.

## Vercel Deployment

If no build-config is provided to the build-script, it will pick up all build-configs changed by the
last commit. This is part of `yarn build` which is also used by the deployment platform Vercel.

Vercel preserves nextjs' cache `/site/.next/cache` between builds. The build script synchronizes its
results with that cache and rebuilds only what has changed to speed up builds.

## API Routes

### Unauthenticated (or via code in request body)

#### `POST /api/signup`

Request Body:

- `email`: the email address to associate with the BP account

Response Body:

- `userId`: the id of the created BP user
- `emailVerificationCodeId`: the id of the email verification code

#### `POST /api/verifyEmail`

Request Body:

- `userId`: the id of the BP user
- `emailVerificationCodeId`: the id of the email verification code
- `code`: the one-time memorable email verification code sent to the user's email

Response Body:

- `user`: the updated BP user

#### `POST /api/loginWithLoginCode`

Logs in a user using a provide login code.

- Request Body:

  - `userId`: the id of the BP user
  - `loginCodeId`: the id of the login code
  - `code`: the memorable one-time login code sent to the user's email

- Request Response:
  - `user`: the user that is now authenticated with the API

#### `GET /api/isShortnameTaken`

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

- `schema`: a valid JSON schema object to overwrite the existing one.

Response:

- `entityType` the updated entity type

#### `POST /api/completeSignup` [requires cookie authentication]

Request Body:

- `shortname`: the shortname to associate with the BP account
- `preferredName`: the preferred name of the user associated with the BP account

Response Body:

- `user`: the updated BP user

#### `POST /api/sendLoginCode` [requires cookie authentication]

Sends a login code to an existing BP user's email.

- Request Body:

  - `email`: the email address associated with the BP user

- Response Body:
  - `userId`: the id of the BP user
  - `loginCodeId`: the id of the login code sent to the user (required for `/api/loginWithLoginCode`)

#### `GET /api/me` [requires cookie authentication]

Retrieves the user object of the currently logged in user.

- Request Response:
  - `user`: the user currently authenticated with the API

#### `GET /api/me/apiKeys` [requires cookie authentication]

Retrieves metadata on the API keys associated with the authenticated user.

- Request Response:
  - `apiKeys`: metadata on API keys (the key itself is only visible at the point of generation)

#### `POST /api/me/generateApiKey` [requires cookie authentication]

Generates a new API key for the authenticated user, and revokes any others.

- Request Body:

  - `displayName`: a display name for the API key

- Request Response:
  - `apiKey`: the key itself, a string.

#### `POST /api/logout` [requires cookie authentication]

Logs out the currently authenticated user.

- Request Response: `SUCCESS`

#### `POST /api/uploadUserAvatar` [requires cookie authentication]

Uploads a user avatar and apply it to logged in profile page.

- Multipart Request Body:

  - `image`: The image file to be uploaded, extension must be one of jpg, jpeg, png, gif or svg.

- Response Body:
  - `avatarUrl`: Url pointing to the newly uploaded user avatar.

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
