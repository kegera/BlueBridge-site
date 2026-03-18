/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: "#1E5EFF", foreground: "#ffffff" },
        navy:     "#0B1B3A",
        teal:     { DEFAULT: "#11B5A4", foreground: "#ffffff" },
        warm:     { DEFAULT: "#FFB020", foreground: "#0B1B3A" },
        bbg:      "#F6F8FF",
        surface:  "#ffffff",
        bborder:  "#E2E9FF",
        muted:    "#5A6A8A",
        background:  "#F6F8FF",
        foreground:  "#0A1020",
        card:        { DEFAULT: "#ffffff", foreground: "#0A1020" },
        popover:     { DEFAULT: "#ffffff", foreground: "#0A1020" },
        secondary:   { DEFAULT: "#E2E9FF", foreground: "#0B1B3A" },
        accent:      { DEFAULT: "#f0f4ff", foreground: "#0B1B3A" },
        destructive: { DEFAULT: "#e53e3e", foreground: "#ffffff" },
        input:       "#E2E9FF",
        ring:        "#1E5EFF",
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body:    ["Plus Jakarta Sans", "sans-serif"],
        sans:    ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        sm:  "12px",
        DEFAULT: "20px",
        md:  "20px",
        lg:  "28px",
        xl:  "36px",
        "2xl": "40px",
        full: "9999px",
      },
      boxShadow: {
        sm:  "0 1px 3px rgba(14,30,80,.06)",
        DEFAULT: "0 4px 16px rgba(14,30,80,.08)",
        lg:  "0 16px 40px rgba(14,30,80,.12)",
        glow: "0 0 40px rgba(30,94,255,.2)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(18px,-22px) scale(1.03)" },
          "66%":     { transform: "translate(-14px,16px) scale(.97)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        drift:            "drift 10s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
