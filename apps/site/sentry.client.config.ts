// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

import { sharedSentryConfig } from "./src/lib/shared-sentry-config";

Sentry.init({
  ...sharedSentryConfig,
  integrations: [
    // @ts-expect-error -- refactor after upgrading to TypeScript 4.3, use `satisfies` in sharedSentryConfig
    ...sharedSentryConfig.integrations,
    new Replay({
      captureOnlyOnError: true,
      // @todo Introduce sampling in production after initial testing
      // replaysSamplingRate:
      //   process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? 0.1 : 1,
      stickySession: true,
    }),
  ],
});
