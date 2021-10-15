const { guessProductionMode } = require("@ngneat/tailwind");

module.exports = {
    corePlugins: {
      // ...
    container: false,
    },
    prefix: '',
    purge: {
      enabled: guessProductionMode(),
      content: [
        './src/**/*.{html,ts}',
      ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
     
      // extend: {
      //   fontFamily: {
      //     Roboto: ['Roboto','Arial', 'sans-serif'],
      //     Stick : ['Stick No Bills','Arial', 'sans-serif'],
      //     Bonheur : ['Bonheur Royale', 'Arial', 'sans-serif'],
      //   },
  
      // },
    },
    variants: {
      extend: {},
    },
    plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
};
