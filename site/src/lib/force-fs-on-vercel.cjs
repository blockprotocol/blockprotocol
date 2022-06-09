// https://vercel.com/docs/runtimes#advanced-usage/technical-details/including-additional-files
// @todo Explain this hack if it works
const forceFsOnVercel = () => {
  // eslint-disable-next-line global-require,no-unused-vars
  const fs = require("fs");
};

module.exports = forceFsOnVercel;
