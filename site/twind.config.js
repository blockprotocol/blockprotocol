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
  preflight: (preflight) => ({
    ...preflight,
    h1: {
      "font-size": "2rem",
      "font-weight": "400",
    },
    h2: {
      "font-size": "1.6rem",
      "font-weight": "400",
    },
    h3: {
      "font-size": "1.3rem",
      "font-weight": "400",
    },
    "button:focus": {},
  }),
  variants: {
    extend: {
      borderTopLeftRadius: ["first"],
      borderTopRightRadius: ["last"],
      backgroundColor: ["odd", "even"],
    },
  },
};
