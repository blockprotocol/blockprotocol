import chalk from "chalk";
import prompt from "prompt";

/**
 * Prompts a user to confirm or deny an action
 * @param message The yes/no question to ask the user
 * @returns {Promise<boolean>}
 */
export const doesUserAgree = async (message) => {
  prompt.colors = "";
  prompt.message = "";
  prompt.start();

  const { response } = await prompt.get({
    properties: {
      response: {
        description: chalk.blue(`${message} [Y/n]`),
        default: "y",
        required: true,
        before: (value) => value.trim()[0].toLowerCase(),
      },
    },
  });

  return response === "y";
};
