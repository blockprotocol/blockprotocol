// Context: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { sentryConfig } from "./sentry.client.config";

Sentry.init(sentryConfig);
