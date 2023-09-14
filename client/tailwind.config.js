/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width',
        'bottom': 'bottom',
      }
    },
    // width: {
    //   'mobile-width': '360px'
    // },
    // height: {
    //   'mobile-height': '640px'
    // }
  },
  plugins: [],
}
