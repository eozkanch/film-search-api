/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Optimize autoprefixer
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
  },
};

export default config;