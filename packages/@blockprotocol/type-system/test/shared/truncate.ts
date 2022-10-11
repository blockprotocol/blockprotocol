const truncateLength = 20;
export const truncate = (input: unknown): string => {
  const result = JSON.stringify(input);

  if (truncateLength < result.length - 3) {
    return `${result.slice(0, truncateLength - 4)}...${result.slice(
      result.length - 1,
      result.length,
    )}`;
  }
  return result;
};
