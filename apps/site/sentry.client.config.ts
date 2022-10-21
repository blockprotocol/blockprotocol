// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "unset",
  integrations:
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLING_RATE &&
    // @todo Remove when https://github.com/getsentry/sentry-replay/issues/246#issuecomment-1287181345 is resolved
    typeof window !== "undefined"
      ? [
          new Replay({
            captureOnlyOnError: true,
            replaysSamplingRate: parseFloat(
              process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLING_RATE,
            ),
            stickySession: true,
          }),
        ]
      : [],
});
