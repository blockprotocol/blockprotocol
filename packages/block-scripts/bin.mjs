#!/usr/bin/env node
import { URL } from "node:url";

await new Promise((resolve) => {
  setTimeout(resolve, 1000);
});

const knowActions = ["build", "dev", "help", "serve"];

const rawAction = process.argv[2]?.trim();
const action = !rawAction || rawAction === "--help" ? "help" : rawAction;

if (!knowActions.includes(action)) {
  console.log(
    `Unrecognised action ${action}. Please use one of these: ${knowActions.join(
      ", ",
    )}`,
  );
  process.exit(1);
}

const actionModuleUrl = new URL(`./actions/${action}.js`, import.meta.url);
await import(actionModuleUrl);
