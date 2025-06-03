/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        mainGreen: "#246965",
        subDarkGreen: "#1B4529",
        mainWhite: "#FDF6E5",
        subLightGreen: "#5FB085",
        mainBlack: "#1D1D1D",
        subGreen: "#357A4A",
        subNavy: "#345977",
        subLightNavy: "#6398DA",
        subDarkNavy: "#1B3145",
        subPink: "#C53F8F",
        subLightPink: "#F17FC8",
        subDarkPink: "#410D2F",
      },
    },
  },
  plugins: [],
};
