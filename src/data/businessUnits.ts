export type BusinessUnitId = "madera_tecnologica" | "reformas";
export type BusinessTone = "wood" | "reform";

export interface BusinessService {
	title: string;
	description: string;
	href?: string;
}

export interface BusinessProject {
	title: string;
	category: string;
	image: string;
	alt: string;
	objectPosition?: string;
}

export interface FormService {
	value: string;
	label: string;
}

export interface BusinessUnitConfig {
	id: BusinessUnitId;
	name: string;
	shortName: string;
	slug: string;
	tone: BusinessTone;
	selectorDescription: string;
	selectorImage: string;
	selectorAlt: string;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroImage: string;
	heroAlt: string;
	seoTitle: string;
	seoDescription: string;
	servicesTitle: string;
	servicesDescription: string;
	services: BusinessService[];
	projectsTitle: string;
	projectsDescription: string;
	projects: BusinessProject[];
	processTitle: string;
	processDescription: string;
	process: Array<{ title: string; description: string }>;
	trustTitle: string;
	trust: Array<{ title: string; description: string }>;
	formTitle: string;
	formDescription: string;
	formServices: FormService[];
}

export const woodUnit: BusinessUnitConfig = {
	id: "madera_tecnologica",
	name: "Madera Tecnológica",
	shortName: "Madera Tecnológica",
	slug: "/madera-tecnologica",
	tone: "wood",
	selectorDescription: "Proyectos de exterior, tarimas, pérgolas, fachadas, cerramientos y soluciones a medida.",
	selectorImage: "/images/jardin_2.png",
	selectorAlt: "Exterior de vivienda con celosías y acabados de madera tecnológica",
	heroEyebrow: "División de AZento Home",
	heroTitle: "Madera tecnológica para espacios exteriores",
	heroDescription: "Diseñamos e instalamos soluciones de exterior que combinan calidez, funcionalidad y una ejecución cuidada para cada espacio.",
	heroImage: "/images/jardin_2.png",
	heroAlt: "Proyecto exterior de AZento Home con celosías de madera tecnológica",
	seoTitle: "Madera Tecnológica | AZento Home",
	seoDescription: "Tarimas, pérgolas, celosías, fachadas, cerramientos y proyectos exteriores a medida con madera tecnológica en Madrid.",
	servicesTitle: "Soluciones para transformar el exterior",
	servicesDescription: "Desde una tarima hasta una envolvente completa, planteamos cada elemento como parte de un mismo proyecto.",
	services: [
		{
			title: "Tarimas de madera tecnológica",
			description: "Tarimas para terrazas, zonas de descanso y espacios junto a piscina, adaptadas a la geometría de cada exterior.",
		},
		{
			title: "Pérgolas y celosías",
			description: "Estructuras y soluciones de sombra o privacidad diseñadas para integrarse con la arquitectura existente.",
			href: "/servicios/pergolas-celosias",
		},
		{
			title: "Fachadas y revestimientos",
			description: "Revestimientos de madera tecnológica para renovar volúmenes, entradas y fachadas con un acabado continuo.",
			href: "/servicios/fachadas-revestimientos",
		},
		{
			title: "Cerramientos y separadores",
			description: "Elementos de ocultación y delimitación que aportan privacidad sin perder coherencia visual.",
		},
		{
			title: "Jardines y terrazas",
			description: "Diseño de espacios exteriores que integra pavimentos, vegetación, iluminación y zonas de uso.",
			href: "/servicios/jardines-terrazas",
		},
		{
			title: "Instalaciones exteriores a medida",
			description: "Soluciones específicas para encuentros, mobiliario, bancos, jardineras y otros elementos singulares.",
		},
	],
	projectsTitle: "Madera tecnológica aplicada a cada espacio",
	projectsDescription: "Una selección de trabajos de exterior, revestimiento, celosías y cerramientos realizados por AZento Home.",
	projects: [
		{
			title: "Cerramiento integrado en jardín",
			category: "Cerramientos",
			image: "/images/exteriores_1.png",
			alt: "Jardín con cerramiento vertical de madera tecnológica",
		},
		{
			title: "Revestimiento de fachada",
			category: "Fachadas",
			image: "/images/revestimiento_fachadas_3.png",
			alt: "Fachada contemporánea revestida con lamas de madera tecnológica",
		},
		{
			title: "Pérgola y celosía exterior",
			category: "Pérgolas y celosías",
			image: "/images/pergola_1.JPG",
			alt: "Pérgola exterior con techo y celosía de lamas",
		},
		{
			title: "Celosía exterior iluminada",
			category: "Celosías",
			image: "/images/image0.JPEG",
			alt: "Vivienda contemporánea con celosía exterior iluminada",
		},
		{
			title: "Jardín con revestimiento vertical",
			category: "Jardines y terrazas",
			image: "/images/jardin_1.png",
			alt: "Jardín con paneles verticales de madera tecnológica y vegetación",
		},
		{
			title: "Separador y banco de terraza",
			category: "Soluciones a medida",
			image: "/images/madera2_azento.png",
			alt: "Terraza con separador y banco acabado en madera tecnológica",
		},
	],
	processTitle: "Un proceso pensado de principio a fin",
	processDescription: "Estudiamos el espacio, definimos la solución y coordinamos la instalación para que todos los elementos funcionen como un conjunto.",
	process: [
		{ title: "Visita y necesidades", description: "Conocemos el espacio, el uso previsto y las prioridades del proyecto." },
		{ title: "Diseño y materiales", description: "Definimos distribución, encuentros, acabados y soluciones constructivas." },
		{ title: "Planificación", description: "Organizamos mediciones, fabricación, suministros y calendario de instalación." },
		{ title: "Instalación", description: "Ejecutamos y revisamos el conjunto hasta completar los últimos detalles." },
	],
	trustTitle: "Una solución exterior coherente",
	trust: [
		{ title: "Diseño a medida", description: "Cada propuesta se adapta al espacio, al uso y a la arquitectura de la vivienda." },
		{ title: "Materiales para exterior", description: "Seleccionamos sistemas y acabados adecuados para su instalación al aire libre." },
		{ title: "Proyecto coordinado", description: "Integramos revestimientos, iluminación, vegetación y elementos auxiliares cuando el proyecto lo requiere." },
	],
	formTitle: "Cuéntanos tu proyecto de madera tecnológica",
	formDescription: "Explícanos qué espacio quieres transformar y te responderemos lo antes posible.",
	formServices: [
		{ value: "tarima-madera-tecnologica", label: "Tarima de madera tecnológica" },
		{ value: "pergolas-celosias", label: "Pérgolas y celosías" },
		{ value: "fachadas-revestimientos", label: "Fachadas y revestimientos" },
		{ value: "cerramientos-separadores", label: "Cerramientos y separadores" },
		{ value: "jardines-terrazas", label: "Jardines y terrazas" },
		{ value: "otro-madera-tecnologica", label: "Otro proyecto de madera tecnológica" },
	],
};

export const reformsUnit: BusinessUnitConfig = {
	id: "reformas",
	name: "Reformas",
	shortName: "Reformas",
	slug: "/reformas",
	tone: "reform",
	selectorDescription: "Reformas integrales, interiores, cocinas, baños, iluminación y mobiliario a medida.",
	selectorImage: "/images/cocina_1.png",
	selectorAlt: "Cocina contemporánea reformada por AZento Home",
	heroEyebrow: "División de AZento Home",
	heroTitle: "Reformas que ordenan y renuevan tu hogar",
	heroDescription: "Planificamos y ejecutamos reformas integrales o parciales con una visión común de distribución, materiales, iluminación y mobiliario.",
	heroImage: "/images/cocina_1.png",
	heroAlt: "Interior de cocina contemporánea proyectada por AZento Home",
	seoTitle: "Reformas Integrales e Interiores | AZento Home",
	seoDescription: "Reformas integrales, cocinas, baños, iluminación, mobiliario a medida y renovación de espacios interiores y exteriores en Madrid.",
	servicesTitle: "Reformas para vivir mejor cada espacio",
	servicesDescription: "Coordinamos decisiones, materiales y oficios para que el resultado responda al conjunto de la vivienda.",
	services: [
		{
			title: "Reformas integrales",
			description: "Renovación completa de la vivienda, desde la redistribución inicial hasta los acabados finales.",
		},
		{
			title: "Reformas interiores",
			description: "Actualización de estancias y zonas de paso con una lectura conjunta de distribución, materiales e instalaciones.",
			href: "/servicios/reformas-interiores",
		},
		{
			title: "Cocinas",
			description: "Diseño y reforma de cocinas atendiendo al uso diario, el almacenamiento, la iluminación y los acabados.",
		},
		{
			title: "Baños",
			description: "Reformas de baño que integran distribución, revestimientos, sanitarios, grifería e iluminación.",
		},
		{
			title: "Iluminación",
			description: "Planificación de luz general, ambiental y funcional para reforzar el carácter de cada estancia.",
		},
		{
			title: "Mobiliario a medida",
			description: "Soluciones de almacenaje y mobiliario pensadas para aprovechar mejor el espacio disponible.",
		},
		{
			title: "Redistribución de espacios",
			description: "Reorganización de circulaciones y estancias para adaptar la vivienda a nuevas necesidades.",
		},
		{
			title: "Renovación de exteriores",
			description: "Actualización de pavimentos, revestimientos, iluminación y zonas de uso exterior.",
		},
	],
	projectsTitle: "Interiores y exteriores renovados",
	projectsDescription: "Cocinas, espacios interiores y actuaciones exteriores que muestran distintas maneras de actualizar una vivienda.",
	projects: [
		{
			title: "Cocina de líneas contemporáneas",
			category: "Cocinas",
			image: "/images/cocina_1.png",
			alt: "Cocina contemporánea con isla central e iluminación suspendida",
		},
		{
			title: "Iluminación y mobiliario de cocina",
			category: "Cocinas e iluminación",
			image: "/images/cocina_2.png",
			alt: "Zona de cocina con mobiliario oscuro e iluminación cálida",
			objectPosition: "center 42%",
		},
		{
			title: "Renovación exterior con porcelánico",
			category: "Reforma exterior",
			image: "/images/revestimiento_fachada_porcelanic.JPG",
			alt: "Fachada exterior renovada con revestimiento porcelánico",
		},
		{
			title: "Cocina exterior",
			category: "Reforma exterior",
			image: "/images/cocina_exterior_premium.jpeg",
			alt: "Cocina exterior integrada en una terraza",
		},
		{
			title: "Zona de descanso exterior",
			category: "Exterior",
			image: "/images/jacuzzi_exterior.jpeg",
			alt: "Terraza renovada con zona de descanso exterior",
			objectPosition: "center 40%",
		},
		{
			title: "Composición y decoración exterior",
			category: "Acabados",
			image: "/images/decoracion_2.JPG",
			alt: "Detalle de composición y decoración en un espacio exterior",
		},
	],
	processTitle: "Una reforma con decisiones ordenadas",
	processDescription: "Definimos el alcance, proyectamos cada intervención y coordinamos la ejecución para mantener una visión común durante toda la obra.",
	process: [
		{ title: "Escucha y visita", description: "Revisamos la vivienda, las necesidades y las prioridades de la reforma." },
		{ title: "Propuesta", description: "Trabajamos distribución, materiales, iluminación y soluciones de mobiliario." },
		{ title: "Planificación", description: "Coordinamos oficios, suministros y fases antes de iniciar los trabajos." },
		{ title: "Obra y entrega", description: "Seguimos la ejecución y revisamos los acabados hasta completar la reforma." },
	],
	trustTitle: "Un único proyecto, todas las decisiones conectadas",
	trust: [
		{ title: "Visión de conjunto", description: "Distribución, materiales e iluminación se plantean como partes del mismo espacio." },
		{ title: "Coordinación de oficios", description: "Organizamos las distintas intervenciones necesarias durante la reforma." },
		{ title: "Acompañamiento", description: "Te ayudamos a tomar decisiones y mantenemos el seguimiento durante la ejecución." },
	],
	formTitle: "Cuéntanos la reforma que tienes en mente",
	formDescription: "Indícanos el tipo de espacio y el alcance aproximado. Te responderemos lo antes posible.",
	formServices: [
		{ value: "reforma-integral", label: "Reforma integral" },
		{ value: "cocina", label: "Cocina" },
		{ value: "bano", label: "Baño" },
		{ value: "reforma-interior", label: "Reforma interior" },
		{ value: "iluminacion", label: "Iluminación" },
		{ value: "mobiliario-medida", label: "Mobiliario a medida" },
		{ value: "reforma-exterior", label: "Reforma exterior" },
		{ value: "otro-reforma", label: "Otro proyecto de reforma" },
	],
};

export const businessUnits = [woodUnit, reformsUnit];
