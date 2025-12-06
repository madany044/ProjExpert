module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'proj-purple': '#6A5AE0',
        'proj-blue': '#3A8DFF'
      },
      backgroundImage: {
        'gradient-p': 'linear-gradient(135deg, #6A5AE0 0%, #3A8DFF 100%)'
      }
    }
  },
  plugins: []
};
