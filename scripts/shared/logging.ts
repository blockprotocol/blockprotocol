let currentMarkEndOfStep: (() => void) | undefined = undefined;

export const logStepStart = (phaseName: string) => {
  console.log("");
  console.log("=".repeat(phaseName.length));
  console.log(phaseName);
  console.log("=".repeat(phaseName.length));
  console.log("↓".repeat(phaseName.length));
  console.log("");

  const startTime = Date.now();

  currentMarkEndOfStep = () => {
    const endTime = Date.now();

    const doneMessage = `Done in ${Math.round(
      (endTime - startTime) / 1000,
    )} s.`;
    console.log("");
    console.log("↑".repeat(doneMessage.length));
    console.log("=".repeat(doneMessage.length));
    console.log(doneMessage);
    console.log("=".repeat(doneMessage.length));
    console.log("");
  };
};

export const logStepEnd = () => {
  currentMarkEndOfStep?.();
};
