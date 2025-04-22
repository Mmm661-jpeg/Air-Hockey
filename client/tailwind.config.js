// tailwind.config.js
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}', // Adjust this for your file extensions
    ],
    theme: {
      extend: {
        fontFamily: {
          'press-start': ['"Press Start 2P"', 'cursive'],
        },
      },
    },
    plugins: [],
  }
  