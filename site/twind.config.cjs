/** @type {import('twind').Configuration} */
module.exports = {
  theme: {
    extend: {
      colors: {},
      screens: {
        standalone: { raw: "(display-mode:standalone)" },
      },
    },
  },
  variants: {
    extend: {
      borderTopLeftRadius: ["first"],
      borderTopRightRadius: ["last"],
      backgroundColor: ["odd", "even"],
    },
  },
};
