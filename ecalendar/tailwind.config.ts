import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ['10px', '11.5px'],
      base: ['13px', '14.95px'],
      lg: ['16px', '18.4px'],
      xl: ['56px', '64.39px'],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['var(--font-roc-grotesk)'],
      },
    },
    colors: {
      transparent: "transparent",
      lightGreen: "#1EAA4D",
      green: "#1A8E41",
      darkGreen: "#17863C",
      fade: "#131313",
      white: "#FFFFFF",
      black: "#000000",
      grey: "#101010",
      light: '#B4B4B4',
      'white-rgba': 'rgba(255, 255, 255, 0.24)',
    },
  },
  plugins: [],
};
export default config
