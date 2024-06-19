import commandLineUsage from "command-line-usage";

// ********************* MANUAL ********************* //

/**
 * @type {[{header: string, content: string},{header: string, content: [{summary: string, name: string},{summary: string, name: string}]}]}
 */
const usageGuide = [
  {
    header: "blockprotocol CLI",
    content:
      "CLI for the {magenta Block Protocol} API. See https://blockprotocol.org/docs",
  },
  {
    header: "Commands",
    content: [
      { name: "{bold publish}", summary: "publishes a block on the Hub" },
      { name: "{bold help}", summary: "prints this guide" },
    ],
  },
];

// *********************** RUN *********************** //

/**
 * Print the main help guide
 */
const run = () => {
  const usage = commandLineUsage(usageGuide);

  console.log(usage);
};

export { run };
