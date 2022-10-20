// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

const replaysSamplingRate = Number.parseInt(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLING_RATE || "0",
  10,
);

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "unset",
  integrations:
    replaysSamplingRate > 0 && replaysSamplingRate <= 1
      ? [
          new Replay({
            captureOnlyOnError: true,
            replaysSamplingRate,
            stickySession: true,
          }),
        ]
      : [],
});
