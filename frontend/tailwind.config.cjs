const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        playball: ['Playball', 'cursive'],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
  corePlugins: {
    fontSize: false, // ลบออกได้ถ้าไม่ต้องการปิดฟีเจอร์นี้
  },
  plugins: [
    require("tailwindcss-fluid-type"),
    require("daisyui"),
    require("flowbite/plugin"),
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
};
