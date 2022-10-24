import { execa } from "execa";

export const resetDb = async () => {
  await execa("yarn", ["exe", "scripts/seed-db.ts"]);
};
