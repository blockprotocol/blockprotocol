import commandLineUsage from "command-line-usage";

// ********************* MANUAL ********************* //

const usageGuide = [
  {
    header: "blockprotocol CLI",
    content:
      "CLI for the {magenta Block Protocol} API. See https://blockprotocol.org/docs",
  },
  {
    header: "Commands",
    content: [
      { name: "{bold publish}", summary: "publishes a block to the Block Hub" },
      { name: "{bold help}", summary: "prints this guide" },
    ],
  },
];

// ********************* SCRIPT ********************* //

/**
 * Print the main help guide
 */
const script = () => {
  const usage = commandLineUsage(usageGuide);

  console.log(usage);
};

export { script };
