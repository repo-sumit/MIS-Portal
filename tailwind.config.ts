import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-noto-sans)",
          "Noto Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        // UX4G violet ramp
        primary: {
          50: "#FAEFFF",
          100: "#F0E1FF",
          200: "#DEC4FF",
          300: "#C19AFC",
          400: "#9B73F8",
          500: "#7E55F7",
          600: "#613AF5",
          700: "#4A2BC2",
          800: "#392095",
          900: "#26165F",
          DEFAULT: "#613AF5"
        },
        // Neutral grey-violet
        ink: {
          DEFAULT: "#1C1D1F",
          muted: "#5B6075",
          subtle: "#7B7F92",
          disabled: "#A4A8B7"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F4F3F9",
          muted: "#FAFAFC"
        },
        line: {
          DEFAULT: "#DEDBEC",
          subtle: "#ECEAF5",
          strong: "#B5B0CC"
        },
        success: {
          50: "#E3F2D9",
          400: "#5CB42A",
          DEFAULT: "#3C9718",
          600: "#2C7A0E",
          ink: "#005A00"
        },
        warning: {
          50: "#FFF3E0",
          400: "#D8923C",
          DEFAULT: "#BB772B",
          600: "#9A5F1F",
          ink: "#8B5000"
        },
        danger: {
          50: "#FFCDC0",
          400: "#D8262D",
          DEFAULT: "#B7131A",
          600: "#8E0E14",
          ink: "#741010"
        },
        info: {
          50: "#E0E7FF",
          400: "#84A2F4",
          DEFAULT: "#5478D8",
          600: "#345CCC",
          ink: "#1F3F99"
        },
        gov: {
          saffron: "#FF9933",
          green: "#138808",
          navy: "#000080"
        }
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        pill: "9999px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.06), 0 1px 3px 1px rgba(0,0,0,.04)",
        elevated:
          "0 1px 2px rgba(0,0,0,.10), 0 4px 12px 1px rgba(0,0,0,.08)",
        focus: "0 0 0 4px rgba(97, 58, 245, 0.30)"
      },
      maxWidth: {
        shell: "1320px"
      }
    }
  },
  plugins: []
};

export default config;
