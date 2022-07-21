export const sleep = (ms: number) =>
  new Promise<"TIMEOUT">((resolve) => {
    setTimeout(() => resolve("TIMEOUT"), ms);
  });
