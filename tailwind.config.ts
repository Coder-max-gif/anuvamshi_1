import type { Config } from "tailwindcss";
// Palette sampled from the footage: studio black, dusk navy, ember horizon, sweater sand, lamp amber.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#06080c", deep: "#0a1222", navy: "#14264a", ember: "#d9703c", amber: "#f0a45d", sand: "#d8c4a8", bone: "#efe7da" },
      fontFamily: { display: ["var(--font-display)", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
