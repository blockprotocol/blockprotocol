// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "unset",
  integrations: process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE
    ? [
        new Sentry.Replay({
          errorSampleRate: 1,
          sessionSampleRate: parseFloat(
            process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE,
          ),
          stickySession: true,
        }),
      ]
    : [],
});
