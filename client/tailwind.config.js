/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end Beige, Cashmere & Espresso Neutral palette (replaces slate)
        slate: {
          50: '#FAF7F2',   // Warm Pearl Beige canvas
          100: '#F5EEE5',  // Soft Alabaster Linen
          200: '#E7DDCF',  // Warm Champagne Border
          300: '#D5C5B2',  // Muted Cashmere
          400: '#B29F89',  // Warm Sandstone Camel
          500: '#8A7661',  // Antique Umber
          600: '#685644',  // Roasted Walnut
          700: '#4F4031',  // Deep Espresso Cocoa
          800: '#34281E',  // Dark Roasted Espresso
          900: '#1E1610',  // Midnight Obsidian Espresso
          950: '#120C07',  // Deepest Velvet Noir
        },
        // Royal Antique Gold & Burnished Tuscan Bronze (replaces indigo)
        indigo: {
          50: '#FDF9EE',   // Shimmer Champagne Cream
          100: '#F9F0D3',  // Pale Buttercream Gold
          200: '#F4E0A5',  // Sunlit Champagne Gold
          300: '#E7CA70',  // Warm Gilded Brass
          400: '#D7B244',  // Radiant Venetian Gold
          500: '#C39626',  // Pure Imperial Gold
          600: '#A17619',  // Burnished Royal Bronze / Antique Gold
          700: '#835D12',  // Deep Patina Bronze
          800: '#69480E',  // Regal Chestnut Bronze
          900: '#50360B',  // Imperial Umber
          950: '#301F05',  // Midnight Bronze
        },
        primary: {
          50: '#FDF9EE',
          100: '#F9F0D3',
          200: '#F4E0A5',
          300: '#E7CA70',
          400: '#D7B244',
          500: '#C39626',
          600: '#A17619',
          700: '#835D12',
          800: '#69480E',
          900: '#50360B',
          950: '#301F05',
        },
        beige: {
          50: '#FCFAF7',
          100: '#FAF7F2',
          200: '#F5EEE5',
          300: '#E7DDCF',
          400: '#D5C5B2',
          500: '#B29F89',
        },
        gold: {
          50: '#FDF9EE',
          100: '#F9F0D3',
          200: '#F4E0A5',
          300: '#E7CA70',
          400: '#D7B244',
          500: '#C39626',
          600: '#A17619',
          700: '#835D12',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

