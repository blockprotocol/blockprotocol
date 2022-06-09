// https://vercel.com/docs/runtimes#advanced-usage/technical-details/including-additional-files
// @todo Explain this hack if it works
const forceFsOnVercel = () => {
  // eslint-disable-next-line global-require
  const fs = require("fs");

  // eslint-disable-next-line no-unused-expressions
  fs.readFile;
};

module.exports = forceFsOnVercel;
