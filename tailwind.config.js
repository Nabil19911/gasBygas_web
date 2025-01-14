/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_color: "#FFAF35",
        secondary_color: '#FFECCE',
        button_color: '#FFBD59',
      },
    },
  },
  plugins: [],
};
