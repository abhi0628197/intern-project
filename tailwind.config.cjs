module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-yellow-100', 'text-yellow-800',
    'bg-blue-100', 'text-blue-800',
    'bg-green-100', 'text-green-800',
    'bg-red-100', 'text-red-800',
    'bg-gray-100', 'text-gray-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
