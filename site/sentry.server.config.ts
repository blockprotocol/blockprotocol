import * as Sentry from "@sentry/nextjs";

import { sentryConfig } from "./sentry.client.config";

Sentry.init(sentryConfig);
