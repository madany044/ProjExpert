module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Brand colors
        'proj-purple': '#6A5AE0',
        'proj-blue': '#3A8DFF',
        // Dark theme
        'dark-bg': '#0F1419',
        'dark-card': '#1A202C',
        'dark-input': '#2D3748',
        'dark-hover': '#374151',
        // Semantic
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6'
      },
      backgroundImage: {
        'gradient-p': 'linear-gradient(135deg, #6A5AE0 0%, #3A8DFF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0F1419 0%, #1A202C 100%)'
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(106, 90, 224, 0.3)'
      }
    }
  },
  plugins: []
};
