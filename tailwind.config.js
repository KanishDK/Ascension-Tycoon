/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'void-navy': '#01162b',
                'supersaw-cyan': '#59f0ff', // Updated name to match GDD
                'neon-cyan': '#59f0ff', // Alias
                'acid-lime': '#bbd440',
                'euphoria-magenta': '#e7305d',
                'neon-magenta': '#e7305d', // Alias
                'deep-purple': '#471844',
            },
            fontFamily: {
                'orbitron': ['Orbitron', 'sans-serif'],
                'mono': ['Roboto Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
