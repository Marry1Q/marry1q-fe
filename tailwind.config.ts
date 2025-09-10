import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Noto Sans KR",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "맑은 고딕",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        noto: ["Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", "sans-serif"],
        gowun: ["Gowun Dodum", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", "sans-serif"],
        bona: ["Bona Nova SC", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        hana: {
          mint: {
            main: "#00C9AB",
            dark: "#00A88C",
            light: "#33D4BC",
          },
          blue: {
            main: "#647FF4",
            dark: "#4A5FD1",
            light: "#8A9FF7",
          },
          red: {
            main: "#F0426B",
            dark: "#D62E55",
            light: "#F36B8A",
          },
          yellow: {
            main: "#FFBC4E",
            dark: "#E6A93F",
            light: "#FFC971",
          },
          purple: {
            main: "#B168E1",
            dark: "#9A4FC8",
            light: "#C189E8",
          },
          brown: {
            main: "#A77458",
            dark: "#8B5F47",
            light: "#B8907A",
          },
          green: {
            main: "#2ECC71",
            dark: "#27AE60",
            light: "#4CDD8C",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
