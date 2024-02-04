/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',
        bluegray: {
          500: '#64748b'
        },
        blue: {
          600: '#326fd1' 
        },
        800: '#424242',
        red: {
        600: '#d9342b'
        }
      }
    },
  },
  plugins: [],
}

