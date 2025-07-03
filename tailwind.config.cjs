/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `index.html`,
    `src/**/*.{js,ts,jsx,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: " #e5f7ec",
          100: " #c2ecd3",
          200: " #9fe0ba",
          300: " #7cd5a0",
          400: " #59c987",
          500: " #009A31", // main green
          600: " #02822b",
          700: " #046a25",
          800: " #05521f",
          900: " #053a19",
        },
        secondary: " #84CF96",   // Lighter green
        accent: " #C6E7CE",      // Soft green
        background: " #CEFFCE",  // Lighter shade for backgrounds
        text: " #333333",        // Dark text color
        border: " #E0E0E0",      // Light border color
        error: " #FF4D4D",       // Error color
        warning: " #FFCC00",     // Warning color
        success: " #28A745",     // Success color
        info: " #17A2B8",        // Info color
        globalPrimary: " #37755C",
        globalSecondary: " #0B1712",
        globalText: " #595959",
        globalAccent: " #B6D73E",
        globalYellow: " #FFC107",
        globalOliveLight: " #DEEDA8",
        globalWhiteTexture: " #F8FBEC",
        globalCreamish: " #FFFFFF",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      scrollBar: ['rounded', 'hover'],
      fontSize: {
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        xxl: "30px"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
