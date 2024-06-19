import path from "node:path";

import fs from "fs-extra";

const dummyEmailsFilePath = "../../var/site/dummy-emails.log";

let firstCall = true;

export const sendDummyEmail = async (rows: string[]) => {
  if (firstCall) {
    await fs.ensureDir(path.dirname(dummyEmailsFilePath));
    await fs.writeFile(dummyEmailsFilePath, "");
    firstCall = false;
  }
  for (const row of rows) {
    // eslint-disable-next-line no-console
    console.log(row);
  }

  await fs.appendFile(
    dummyEmailsFilePath,
    [`Sent at: ${new Date().toString()}`, ...rows, "", ""].join("\n"),
  );
};
