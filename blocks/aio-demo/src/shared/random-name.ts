const firstNames = [
  "Trevon",
  "Terry",
  "Tahj",
  "Celia",
  "Brea",
  "Bryon",
  "Jacoby",
  "Kevin",
  "Shaelyn",
  "Hayli",
  "Francisco",
  "Nathaniel",
  "Alfonso",
  "Chaz",
  "Flor",
  "Alexzander",
  "Darrell",
  "Adam",
  "Tyshawn",
  "Jazlyn",
  "Joselyn",
  "Ivy",
  "Allan",
  "Mia",
  "Melisa",
  "Deborah",
  "Drake",
  "Salena",
  "Edmund",
  "Ciera",
] as const;

const lastNames = [
  "Huynh",
  "Burkhart",
  "Wicks",
  "McManus",
  "Ivey",
  "Graham",
  "Hammond",
  "Jeffrey",
  "Duenas",
  "Stein",
  "Cheung",
  "Quintana",
  "Burleson",
  "Dang",
  "Lambert",
  "Vandyke",
  "Stpierre",
  "Courtney",
  "Coffman",
  "Blankenship",
  "Lanning",
  "Kuhn",
  "Copeland",
  "Linder",
  "Sebastian",
  "Hastings",
  "Riley",
  "Morgan",
  "Krieger",
  "Hatfield",
] as const;

export type PersonNameParams = {
  firstName: (typeof firstNames)[number];
  lastName: (typeof lastNames)[number];
};

export const getRandomPersonNameParams = (): PersonNameParams => {
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)]!,
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)]!,
  };
};
