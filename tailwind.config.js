/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html", "./static/js/**/*.js", "./portfolio/**/*.py"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E6",
        surface: "#FFFDF8",
        ink: "#1B2438",
        "ink-soft": "#4A5368", // ink tint for secondary text; 6.8:1 on paper
        vermilion: "#C2411F",
        "wash-blue": "#9DB4C8",
        sage: "#7F9477",
        ochre: "#D9A441",
        dusk: "#232C4A",
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        hero: ["clamp(3.4rem, 10.5vw, 10rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        h2: ["clamp(2.4rem, 6vw, 5.2rem)", { lineHeight: "0.98", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.7rem, 3vw, 2.6rem)", { lineHeight: "1.05" }],
        lead: ["clamp(1.05rem, 1.4vw, 1.3rem)", { lineHeight: "1.6" }],
      },
      maxWidth: { page: "88rem" },
    },
  },
  plugins: [],
};
