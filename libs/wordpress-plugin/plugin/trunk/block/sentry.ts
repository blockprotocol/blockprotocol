import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";
import * as Sentry from "@sentry/react";

const hub = Sentry.getCurrentHub();

if (hub.getClient()?.getDsn() == null ?? true) {
  if (window.block_protocol_sentry_config) {
    const { dsn, release, environment, anonymous_id, public_id } =
      window.block_protocol_sentry_config;

    Sentry.init({
      allowUrls: [/plugins\/blockprotocol/],
      dsn,
      environment,
      tracesSampleRate: 1.0,
      release,
      initialScope: {
        tags: {
          anonymous_id,
        },
        user: public_id
          ? {
              id: public_id,
            }
          : undefined,
      },
      integrations: [
        new CaptureConsoleIntegration({
          // array of methods that should be captured
          // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
          levels: ["error", "warn", "assert"],
        }),
      ],
    });
  }
}
