const availableTemplates = ["custom-element", "react", "html"];

const commandLineArguments = [
  {
    name: "name",
    alias: "n",
    type: String,
    defaultOption: true,
    typeLabel: "{underline string}",
    description: "The name to give your block. May be specified without -name",
  },
  {
    name: "path",
    alias: "p",
    type: String,
    typeLabel: "{underline string}",
    description:
      "The path to create the block folder in. Defaults to a new folder with the supplied block name, in the current location",
  },
  {
    name: "template",
    alias: "t",
    defaultValue: "react",
    type: String,
    typeLabel: "{underline string}",
    description: `The type of block to create. Must be one of ${availableTemplates.join(
      ", ",
    )}`,
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Print this usage guide",
  },
];

const helpSections = [
  {
    header: "Create Block App",
    content:
      "Create a {italic Block Protocol} starter template. See https://blockprotocol.org/docs",
  },
  {
    header: "Options",
    optionList: commandLineArguments,
  },
  {
    header: "Examples",
    content: [
      {
        description: "Basic usage",
        example: "$ create-block-app my-block",
      },
      {
        description: "Specify the folder in which to create your block",
        example: "$ create-block-app my-block --path ~/blocks/my-block",
      },
      {
        description: "Use a different template",
        example:
          "$ create-block-app my-element-block --template custom-element",
      },
    ],
  },
  {
    header: "Templates",
    content: [
      {
        description: "custom-element",
        example:
          "Create a block which is defined as a custom element, using the Lit framework",
      },
      {
        description: "react",
        example:
          "Create a block which is defined as a React function component",
      },
      {
        description: "html",
        example: "Create a block which is defined using raw HTML",
      },
    ],
  },
];

module.exports = {
  availableTemplates,
  commandLineArguments,
  helpSections,
};
