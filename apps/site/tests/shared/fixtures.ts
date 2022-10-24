export const resetDb = async () => {
  // @todo Replace with static import after upgrading tests to ESM
  const { execa } = await import("execa");

  await execa("yarn", ["exe", "scripts/seed-db.ts"]);
};
