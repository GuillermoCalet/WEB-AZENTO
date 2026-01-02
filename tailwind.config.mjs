/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			// Paleta de colores de marca AZento Home Solutions
			colors: {
				// Azul/Gris oscuro - Color principal de marca
				azento: {
					50: '#f4f6f7',
					100: '#e3e8ea',
					200: '#c9d3d7',
					300: '#a3b3ba',
					400: '#768d96',
					500: '#5b727b',
					600: '#435f69', // Color principal de marca
					700: '#3a5159',
					800: '#34454b',
					900: '#2e3c41',
					950: '#1a2528',
				},
				// Grises neutros
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a6a6a6', // Gris de marca
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717',
					950: '#000000', // Negro de marca
				},
				// Acentos cálidos (bronce/beige del logo)
				accent: {
					50: '#faf8f5',
					100: '#f3efe8',
					200: '#e6ddd0',
					300: '#d4c4ae',
					400: '#c4a882', // Beige cálido
					500: '#b8956a',
					600: '#a8815a',
					700: '#8c6a4b',
					800: '#735842',
					900: '#5f4938',
					950: '#33261d',
				},
			},
			// Tipografías personalizadas
			fontFamily: {
				'display': ['Playfair Display', 'Georgia', 'serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
			},
			// Animaciones personalizadas
			animation: {
				'fade-in': 'fadeIn 0.6s ease-out forwards',
				'slide-up': 'slideUp 0.6s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
			},
			// Blur para efecto glassmorphism
			backdropBlur: {
				xs: '2px',
			},
		},
	},
	plugins: [],
}
