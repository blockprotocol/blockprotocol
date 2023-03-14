import { randomNumberFromRange } from "../../util";

export const waitForRandomLatency = async (simulateDatastoreLatency?: {
  min: number;
  max: number;
}): Promise<void> => {
  if (simulateDatastoreLatency) {
    const waitFor = randomNumberFromRange(
      simulateDatastoreLatency.min,
      simulateDatastoreLatency.max,
    );
    await new Promise((resolve) => {
      setTimeout(resolve, waitFor);
    });
  }
};
