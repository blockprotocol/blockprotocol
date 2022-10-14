import fs from "fs-extra";

const dummyEmailsFilePath = "../../var/site/dummy-emails.log";

export const readValueFromRecentDummyEmail = async (
  prefix: string,
): Promise<string> => {
  const recentEmail = (await fs.readFile(dummyEmailsFilePath, "utf8"))
    .trim()
    .split("\n\n")
    .at(-1);

  if (!recentEmail) {
    throw new Error(
      "Unable to find recent email. Looks like readValueFromRecentDummyEmail() in tests was called before sendDummyEmail() in app",
    );
  }

  const lastEmailRows = recentEmail.split("\n");
  for (const row of lastEmailRows) {
    if (row.startsWith(prefix)) {
      return row.substring(prefix.length);
    }
  }

  throw new Error(
    `Unable to find row with prefix "${prefix}" in last email:\n${recentEmail}`,
  );
};
