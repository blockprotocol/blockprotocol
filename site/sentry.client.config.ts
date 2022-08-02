// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import type { NextjsOptions } from "@sentry/nextjs/types/utils/nextjsOptions";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryConfig: NextjsOptions = {
  dsn,
  enabled: !!dsn,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "unset",
};

Sentry.init(sentryConfig);
