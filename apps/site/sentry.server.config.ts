import * as Sentry from "@sentry/nextjs";

import { sharedSentryConfig } from "./src/lib/shared-sentry-config";

Sentry.init(sharedSentryConfig);
