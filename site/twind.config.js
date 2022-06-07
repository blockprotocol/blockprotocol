/** @type {import('twind').Configuration} */
export default {
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
