# blockprotocol.org website

This folder contains the code for [blockprotocol.org](https://blockprotocol.org), including:

- the [Block Protocol specification](https://blockprotocol.org/spec) at [src/\_pages/spec](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/spec)
- the [explanatory documentation](https://blockprotocol.org/docs) at [src/\_pages/docs](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs)

## Local development

### BP Site

The site no longer depends on MongoDB, S3, or any other external data store.
Hub listings are read from the static
[`hub-snapshot.json`](./hub-snapshot.json) snapshot file committed in this
folder, and the entire account system (login, signup, dashboard, API keys,
publishing) is paused while we focus on [HASH](https://hash.ai). As a result,
running the site locally requires **no environment variables, no Docker
containers, and no database**.

Pre-requisites: Node `24.x` (see [`package.json`](./package.json) `engines`)
and Yarn 1 (the repo root pins a compatible version via the workspace setup).

1.  Install dependencies (from the repo root):

    ```sh
    yarn install
    ```

1.  Run the Next.js app:

    ```sh
    yarn workspace @apps/site dev
    ```

    The site is served at <http://localhost:3000>.

#### Optional environment variables

All of the variables below are optional and can be set in
`apps/site/.env.local` if you need them. The site runs without any of them.

- `NEXT_PUBLIC_FRONTEND_URL`: the URL where the frontend is hosted (defaults
  to `http://localhost:3000`). Set this if you're testing against a non-local
  origin.
- `NEXT_PUBLIC_BLOCK_SANDBOX_URL`: the host that serves sandboxed block
  previews (in production, this is a different origin to the main site so
  that block JS can't read main-site cookies). Defaults to the same origin
  in local dev.
- `NEXT_PUBLIC_SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE`:
  client-side Sentry config. See [Sentry](#sentry) below.
- `SENTRY_AUTH_TOKEN`: build-time token used to upload source maps to
  Sentry. When unset, the Sentry webpack plugin runs in dry-run mode.
- `CUSTOMERIO_API_KEY` (and optionally `CUSTOMERIO_REGION=eu`): only needed
  if you want to actually exercise the `/api/signup-notify`,
  `/api/subscribe-email`, or `/api/vote-application` endpoints, which push
  the submitted email into the shared Customer.io workspace as an
  `identify` call followed by a surface-specific `track` event
  (`waitlist_joined`, `wordpress_plugin_interest_recorded`,
  `application_voted`). Without these, those endpoints short-circuit to a
  200 / `{ success: true }` so local dev and preview deployments don't
  break the CTAs.
- `DATA_URL`, `DATA_WRITE_KEY`: server-side telemetry collector used by
  `src/util/usage.ts`. Unset → telemetry is a no-op.
- `VERCEL_AUTOMATION_BYPASS_SECRET`: only relevant for the snapshot script
  when scraping a password-protected Vercel preview deployment.

### Refreshing the Hub snapshot

[`hub-snapshot.json`](./hub-snapshot.json) is the single source of truth for
`/hub`, `/@shortname`, and `/@shortname/blocks/[slug]`. To refresh it from
production:

```sh
yarn workspace @apps/site snapshot-hub-data
```

The script scrapes the live production site's public `/api/users/:shortname`
and `/api/users/:shortname/blocks` endpoints and rewrites the JSON file in
place. Commit the changes when you want them to ship.

## Vercel Deployment

If no build-config is provided to the build-script, it will pick up all build-configs changed by the
last commit. This is part of `yarn build` which is also used by the deployment platform Vercel.

Vercel preserves nextjs' cache `apps/site/.next/cache` between builds. The build script synchronizes its
results with that cache and rebuilds only what has changed to speed up builds.

## API Routes

The Hub publishing API and the account system are paused. The surviving
routes are:

### Static data

- `GET /api/users/[shortname]` — returns the user profile from the static
  snapshot (or 404 if the shortname isn't in the snapshot).
- `GET /api/users/[shortname]/blocks` — returns the user's blocks from the
  static snapshot.
- `GET /api/blocks-by-subcategory` — groups snapshot blocks by Hub category.
- `GET /api/rewrites/block-metadata` and
  `GET /api/rewrites/sandboxed-block-demo` — internal rewrites used by the
  Hub UI to serve block metadata and sandboxed previews.

### Stubs for paused functionality

These routes stay defined so legacy inbound links (e.g. the WordPress
plugin and the BP CLI) don't 404, but they always return a structured
error:

- `GET /api/me` → always `{ "guest": true }`.
- `POST /api/signup`, `POST /api/verify-email`, `POST /api/send-login-code`,
  `POST /api/login-with-login-code` → 401 with
  `{ errors: [{ msg: "Account creation and login are temporarily paused while we focus on HASH." }] }`.
- `GET /api/blocks` → 503 with the same paused-message error.

### Mailing-list integration

All three endpoints push the submitted email into the shared Customer.io
workspace (the same workspace used by `hash.ai`) via `identify` +
surface-specific `track` events. They short-circuit to a success response
when `CUSTOMERIO_API_KEY` is unset, so non-production environments do not
need credentials.

- `POST /api/signup-notify` — captures emails from the `/signup`
  "Notify me" form (`waitlist_joined` event).
- `PUT  /api/subscribe-email` — captures emails from the WordPress plugin
  early-access CTA on `/wordpress`
  (`wordpress_plugin_interest_recorded` event).
- `PUT  /api/vote-application` — captures votes from the WordPress
  application-voting widget (`application_voted` event, with the chosen
  CMS / free-text suggestion as event properties).

## Testing

[blockprotocol.org](https://blockprotocol.org) is covered by browser-based tests written with [Playwright](https://playwright.dev).
These tests are located in the `apps/site/tests` folder.
They are grouped into:

- universal tests, which run against both local and deployed environments
- end-to-end (E2E) tests, which run against Vercel deployments

### Universal tests

These exercise read-only public pages (e.g. the homepage, docs, Hub
listings). They can run against either a local dev server or a Vercel
deployment.

```sh
yarn workspace @apps/site playwright test --project universal-chrome
```

### [E2E tests](https://www.browserstack.com/guide/end-to-end-testing)

End-to-end (E2E) are designed to run against Vercel deployments.
Their goal is to sense-check deployed instances of the website.
E2E tests are read-only, which helps avoid data corruption in production and reduces execution time.
We automatically run E2E tests for all new Vercel deployments and on schedule to spot potential regressions ([site-deployment.yml](https://github.com/blockprotocol/blockprotocol/actions/workflows/site-deployment.yml)).

To run E2E test locally, use this command:

```sh
export PLAYWRIGHT_TEST_BASE_URL=https://blockprotocol.org

yarn workspace @apps/site playwright test --project e2e
```

Omitting `PLAYWRIGHT_TEST_BASE_URL` will launch E2E tests for a locally running Þ instance.
This is helpful for debugging.

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
