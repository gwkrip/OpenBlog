/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#e85d04",
          dark: "#c44d03",
          light: "#fb8c00",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          muted: "#4a4a4a",
          subtle: "#8a8a8a",
        },
        paper: {
          DEFAULT: "#faf9f6",
          warm: "#f5f0e8",
          cold: "#f0f4f8",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme("fontFamily.sans").join(", "),
            color: theme("colors.ink.DEFAULT"),
            "h1, h2, h3, h4": {
              fontFamily: theme("fontFamily.serif").join(", "),
              fontWeight: "700",
            },
            a: {
              color: theme("colors.accent.DEFAULT"),
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            },
            code: {
              fontFamily: theme("fontFamily.mono").join(", "),
              backgroundColor: "#f4f4f4",
              padding: "0.2em 0.4em",
              borderRadius: "4px",
              fontSize: "0.875em",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
