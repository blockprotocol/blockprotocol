// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "unset",
  integrations:
    // @todo Remove when https://github.com/getsentry/sentry-replay/issues/246#issuecomment-1284472286 is resolved
    typeof window === "undefined" ||
    // @todo Remove when Replay is considered stable
    process.env.NEXT_PUBLIC_FEATURE_SENTRY_REPLAY !== "true"
      ? []
      : [
          new Replay({
            captureOnlyOnError: true,
            // @todo Introduce sampling in production after initial testing
            // replaysSamplingRate:
            //   process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? 0.1 : 1,
            stickySession: true,
          }),
        ],
});
