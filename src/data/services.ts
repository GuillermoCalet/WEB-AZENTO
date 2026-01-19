/**
 * services.ts - Fuente de datos única para todos los servicios
 * Contiene información completa para las cards y las páginas de detalle
 */

export interface ServiceFAQ {
	question: string;
	answer: string;
}

export interface ServiceCTA {
	primaryText: string;
	primaryHref: string;
	secondaryText: string;
	secondaryHref: string;
}

export interface Service {
	id: number;
	slug: string;
	icon: string;
	title: string;
	shortDescription: string;
	longDescription: string[];
	features: string[];
	bullets: string[];
	gallery: string[];
	cta: ServiceCTA;
	faq: ServiceFAQ[];
}

// Iconos SVG inline para usar en componentes
export const serviceIcons: Record<string, string> = {
	garden: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"/>`,
	pergola: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>`,
	facade: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>`,
	interior: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"/>`,
};

export const services: Service[] = [
	{
		id: 1,
		slug: "jardines-terrazas",
		icon: "garden",
		title: "Jardines y Terrazas",
		shortDescription: "Diseñamos y ejecutamos jardines y terrazas que transforman tus espacios exteriores. Desde jardines verticales hasta terrazas con zonas chill-out.",
		longDescription: [
			"En AZento Home Solutions, transformamos espacios exteriores en verdaderos oasis de tranquilidad y belleza. Nuestro equipo de paisajistas y diseñadores trabaja contigo para crear jardines y terrazas que reflejen tu estilo de vida y maximicen el potencial de tu espacio.",
			"Utilizamos materiales de primera calidad y técnicas de jardinería sostenible para garantizar que tu jardín no solo sea hermoso desde el primer día, sino que se mantenga así durante años. Desde pequeños patios urbanos hasta amplias terrazas panorámicas, cada proyecto recibe nuestra atención personalizada.",
			"Nuestro enfoque integral incluye el diseño del paisaje, la selección de plantas adaptadas al clima de Madrid, sistemas de riego eficientes y la creación de zonas funcionales para el descanso y el entretenimiento."
		],
		features: ["Jardines verticales", "Césped artificial", "Zonas de relax"],
		bullets: [
			"Diseño paisajístico personalizado",
			"Jardines verticales y muros verdes",
			"Instalación de césped artificial premium",
			"Sistemas de riego automatizado",
			"Iluminación exterior LED",
			"Zonas chill-out con mobiliario",
			"Jardineras y maceteros a medida",
			"Plantas autóctonas de bajo mantenimiento",
			"Fuentes y elementos de agua",
			"Mantenimiento periódico opcional"
		],
		gallery: [
			// Imágenes existentes
			"/images/jardin_1.png",
			"/images/jardin_2.png",
			"/images/jardin_3.png",
			"/images/exteriores_1.png",
			// TODO: Añadir más imágenes cuando estén disponibles
			// "/images/services/jardines-4.jpg",
			// "/images/services/jardines-5.jpg",
		],
		cta: {
			primaryText: "Solicitar Presupuesto",
			primaryHref: "/#contacto",
			secondaryText: "Ver Proyectos",
			secondaryHref: "/#proyectos"
		},
		faq: [
			{
				question: "¿Cuánto tiempo tarda la instalación de un jardín completo?",
				answer: "El tiempo varía según el tamaño y complejidad del proyecto. Un jardín pequeño puede completarse en 1-2 semanas, mientras que proyectos más grandes pueden requerir 4-6 semanas. Siempre proporcionamos un cronograma detallado antes de comenzar."
			},
			{
				question: "¿Ofrecen servicio de mantenimiento después de la instalación?",
				answer: "Sí, ofrecemos planes de mantenimiento periódico que incluyen poda, riego, fertilización y cuidado general de las plantas. Puedes elegir entre planes mensuales, trimestrales o puntuales según tus necesidades."
			},
			{
				question: "¿Qué tipo de césped artificial recomiendan?",
				answer: "Trabajamos exclusivamente con césped artificial de alta gama con memoria de forma, resistente a UV y tacto natural. Recomendamos diferentes alturas y densidades según el uso previsto: zonas de paso, áreas de descanso o espacios infantiles."
			}
		]
	},
	{
		id: 2,
		slug: "pergolas-celosias",
		icon: "pergola",
		title: "Pérgolas y Celosías",
		shortDescription: "Instalación de pérgolas bioclimáticas y celosías de madera tecnológica que aportan elegancia y funcionalidad a cualquier espacio.",
		longDescription: [
			"Las pérgolas y celosías son elementos arquitectónicos que transforman por completo la experiencia de tu espacio exterior. En AZento Home Solutions, nos especializamos en el diseño e instalación de estructuras que combinan funcionalidad, estética y durabilidad.",
			"Nuestras pérgolas bioclimáticas permiten regular la entrada de luz y ventilación mediante lamas orientables, creando el ambiente perfecto en cualquier época del año. Fabricadas en aluminio de alta calidad, son resistentes a la intemperie y prácticamente libres de mantenimiento.",
			"Las celosías de madera tecnológica aportan privacidad y elegancia sin renunciar a la ventilación natural. Este material combina la calidez de la madera con la resistencia del composite, garantizando una durabilidad excepcional sin los inconvenientes del mantenimiento tradicional."
		],
		features: ["Pérgolas bioclimáticas", "Celosías de madera", "Diseño a medida"],
		bullets: [
			"Pérgolas bioclimáticas con lamas orientables",
			"Celosías de madera tecnológica WPC",
			"Estructuras de aluminio lacado",
			"Sistemas motorizados con control remoto",
			"Integración de iluminación LED",
			"Cortinas y estores exteriores",
			"Diseño a medida para cada espacio",
			"Resistencia a viento y lluvia",
			"Garantía de 10 años en estructura",
			"Instalación profesional certificada"
		],
		gallery: [
			"/images/madera1_azento.png",
			"/images/madera2_azento.png",
			"/images/exteriores_1.png",
			// TODO: Añadir más imágenes específicas de pérgolas
			// "/images/services/pergolas-1.jpg",
			// "/images/services/pergolas-2.jpg",
		],
		cta: {
			primaryText: "Solicitar Presupuesto",
			primaryHref: "/#contacto",
			secondaryText: "Ver Proyectos",
			secondaryHref: "/#proyectos"
		},
		faq: [
			{
				question: "¿Qué diferencia hay entre una pérgola bioclimática y una tradicional?",
				answer: "Una pérgola bioclimática tiene lamas orientables que permiten controlar la entrada de sol, lluvia y ventilación. Puedes abrirlas completamente en días soleados o cerrarlas para protegerte de la lluvia. Las tradicionales tienen una cubierta fija."
			},
			{
				question: "¿Se pueden motorizar las lamas de la pérgola?",
				answer: "Sí, todas nuestras pérgolas bioclimáticas pueden equiparse con motorización. Se controlan mediante mando a distancia o incluso desde tu smartphone. También podemos incluir sensores de lluvia y viento para cierre automático."
			},
			{
				question: "¿Qué mantenimiento requiere la madera tecnológica?",
				answer: "Prácticamente ninguno. La madera tecnológica (WPC) no necesita barnizado ni tratamiento. Basta con una limpieza ocasional con agua y jabón neutro. No se astilla, no se pudre y mantiene su color durante años."
			}
		]
	},
	{
		id: 3,
		slug: "fachadas-revestimientos",
		icon: "facade",
		title: "Fachadas y Revestimientos",
		shortDescription: "Renovamos fachadas con porcelánico de gran formato y revestimientos de alta calidad. Acabados que combinan estética y durabilidad.",
		longDescription: [
			"La fachada es la carta de presentación de tu hogar. En AZento Home Solutions, nos especializamos en la renovación y diseño de fachadas utilizando los materiales más innovadores del mercado, como el porcelánico de gran formato y la madera tecnológica.",
			"El porcelánico exterior ofrece una resistencia excepcional a los cambios de temperatura, humedad y rayos UV, manteniendo su aspecto impecable durante décadas. Disponemos de una amplia gama de acabados que imitan piedra natural, madera, hormigón o superficies minimalistas.",
			"Nuestros revestimientos de fachada ventilada no solo mejoran la estética, sino que también optimizan el aislamiento térmico y acústico de tu vivienda, reduciendo el consumo energético y aumentando el confort interior."
		],
		features: ["Porcelánico exterior", "Madera tecnológica", "Acabados premium"],
		bullets: [
			"Porcelánico de gran formato (hasta 120x240cm)",
			"Fachada ventilada con aislamiento térmico",
			"Revestimiento de madera tecnológica",
			"Paneles composite de aluminio",
			"Acabados imitación piedra y madera",
			"Sistema de anclaje oculto",
			"Mejora de eficiencia energética",
			"Resistencia a heladas y UV",
			"Colores y texturas personalizables",
			"Garantía de 15 años en materiales"
		],
		gallery: [
			"/images/madera1_azento.png",
			"/images/madera2_azento.png",
			"/images/exteriores_1.png",
			// TODO: Añadir más imágenes específicas de fachadas
			// "/images/services/fachadas-1.jpg",
			// "/images/services/fachadas-2.jpg",
		],
		cta: {
			primaryText: "Solicitar Presupuesto",
			primaryHref: "/#contacto",
			secondaryText: "Ver Proyectos",
			secondaryHref: "/#proyectos"
		},
		faq: [
			{
				question: "¿Qué ventajas tiene el porcelánico frente a otros materiales?",
				answer: "El porcelánico ofrece máxima durabilidad, resistencia al agua (absorción <0.5%), no requiere mantenimiento, soporta heladas y rayos UV sin degradarse, y está disponible en infinidad de diseños que imitan piedra, madera o acabados minimalistas."
			},
			{
				question: "¿Cuánto se tarda en renovar una fachada completa?",
				answer: "Depende del tamaño y complejidad. Una vivienda unifamiliar típica puede completarse en 2-4 semanas. Realizamos un estudio previo y te proporcionamos un calendario detallado antes de comenzar los trabajos."
			},
			{
				question: "¿Mejora realmente el aislamiento de la vivienda?",
				answer: "Sí, significativamente. Una fachada ventilada puede reducir hasta un 30% las pérdidas térmicas, mejorando el confort interior y reduciendo el gasto en climatización tanto en verano como en invierno."
			}
		]
	},
	{
		id: 4,
		slug: "reformas-interiores",
		icon: "interior",
		title: "Reformas Interiores",
		shortDescription: "Transformamos espacios interiores con diseño personalizado. Cocinas, salones y estancias que reflejan tu estilo de vida.",
		longDescription: [
			"En AZento Home Solutions, entendemos que tu hogar es mucho más que cuatro paredes. Es el lugar donde creas recuerdos, descansas y disfrutas con los tuyos. Por eso, nuestras reformas interiores van más allá de la simple renovación: creamos espacios que mejoran tu calidad de vida.",
			"Nuestro equipo de diseñadores e interioristas trabaja contigo desde la conceptualización hasta la última pincelada. Especializados en cocinas, baños y zonas de día, combinamos funcionalidad y estética para lograr resultados que superan expectativas.",
			"Utilizamos materiales de primera calidad y colaboramos con los mejores fabricantes de mobiliario, iluminación y acabados. Gestionamos todo el proceso: diseño, licencias, obra, instalaciones y decoración final, para que tú solo tengas que disfrutar del resultado."
		],
		features: ["Diseño de cocinas", "Iluminación", "Mobiliario a medida"],
		bullets: [
			"Diseño integral de cocinas",
			"Reforma completa de baños",
			"Mobiliario a medida",
			"Iluminación arquitectónica LED",
			"Suelos de porcelánico y parquet",
			"Pintura y acabados decorativos",
			"Instalaciones eléctricas y fontanería",
			"Climatización y domótica",
			"Carpintería interior personalizada",
			"Gestión de licencias y permisos"
		],
		gallery: [
			"/images/cocina_1.png",
			"/images/cocina_2.png",
			// TODO: Añadir más imágenes de reformas interiores
			// "/images/services/interiores-1.jpg",
			// "/images/services/interiores-2.jpg",
		],
		cta: {
			primaryText: "Solicitar Presupuesto",
			primaryHref: "/#contacto",
			secondaryText: "Ver Proyectos",
			secondaryHref: "/#proyectos"
		},
		faq: [
			{
				question: "¿Cuánto tiempo dura una reforma integral de cocina?",
				answer: "Una reforma completa de cocina, incluyendo instalaciones, suele durar entre 3 y 5 semanas. Esto incluye demolición, nuevas instalaciones de agua y luz, alicatado, mobiliario y electrodomésticos. Te proporcionamos un planning detallado."
			},
			{
				question: "¿Se puede vivir en casa durante la reforma?",
				answer: "Depende del alcance de la obra. Para reformas parciales, sí es posible con algunas molestias. Para reformas integrales, recomendamos buscar alojamiento alternativo durante las fases más intensivas para mayor comodidad y rapidez de ejecución."
			},
			{
				question: "¿Gestionáis los permisos y licencias necesarios?",
				answer: "Sí, nos encargamos de toda la tramitación con el ayuntamiento. Esto incluye licencias de obra, comunicaciones previas, certificados de fin de obra y cualquier documentación técnica necesaria."
			}
		]
	}
];

/**
 * Función helper para obtener un servicio por su slug
 */
export function getServiceBySlug(slug: string): Service | undefined {
	return services.find(service => service.slug === slug);
}

/**
 * Función helper para obtener todos los slugs (útil para getStaticPaths)
 */
export function getAllServiceSlugs(): string[] {
	return services.map(service => service.slug);
}
