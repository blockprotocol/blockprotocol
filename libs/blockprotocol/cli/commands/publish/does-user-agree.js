import chalk from "chalk";
import prompt from "prompt";

/**
 * Prompts a user to confirm or deny an action
 * @param {string} message The yes/no question to ask the user
 * @returns {Promise<boolean>}
 */
export const doesUserAgree = async (message) => {
  prompt.colors = false;
  prompt.message = "";
  prompt.start();

  const { response } = await prompt.get({
    properties: {
      response: {
        description: chalk.blue(`${message} [Y/n]`),
        default: "y",
        required: true,
        before: (value) => value.trim().slice(0, 1).toLowerCase(),
      },
    },
  });

  return response === "y";
};
