/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			// Paleta de colores personalizada para AZento Home
			colors: {
				// Verde bosque profundo - Color principal
				forest: {
					50: '#f0f7f2',
					100: '#dceee2',
					200: '#bbdcc7',
					300: '#8ec4a5',
					400: '#5ea67e',
					500: '#3d8a5f',
					600: '#2c6f4a',
					700: '#1A4D2E', // Color principal
					800: '#1a4430',
					900: '#163828',
					950: '#0b1f16',
				},
				// Tonos tierra suaves - Color secundario/fondo
				sand: {
					50: '#fdfcfa',
					100: '#f9f6f0',
					200: '#E8DFCA', // Color principal
					300: '#ddd0b3',
					400: '#cdb889',
					500: '#c0a066',
					600: '#b08a4f',
					700: '#937142',
					800: '#785c3b',
					900: '#624c33',
					950: '#35281a',
				},
				// Acentos dorados/bronce
				gold: {
					50: '#fbf9eb',
					100: '#f5f0cc',
					200: '#ece09c',
					300: '#dfc863',
					400: '#d4b03a',
					500: '#C5A028', // Color principal dorado
					600: '#a67b1f',
					700: '#855a1c',
					800: '#6f491e',
					900: '#5f3d1f',
					950: '#371f0e',
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
