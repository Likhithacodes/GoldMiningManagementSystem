/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      height: {
        128: "32rem", // Custom height
        160: "40rem", // Larger height
      },
      animation: {
        slide: "slide 10s linear infinite",
      },
      keyframes: {
        slide: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
}

