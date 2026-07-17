# Guía del gestor de contenidos

## Entrar

1. Abre `https://azentohome.com/admin/index.html`.
2. Pulsa «Iniciar sesión con GitHub».
3. Usa la cuenta gratuita de GitHub que el administrador haya autorizado.
4. Acepta el acceso solicitado. No necesitas abrir el repositorio, usar Git ni una terminal.

Si el repositorio es privado, el administrador debe darte permiso **solo de lectura**. Nunca necesitas permiso de escritura.

El botón «Guía de uso», situado abajo a la derecha del panel, abre una ayuda resumida sin salir del gestor.

## Local y producción no son lo mismo

- «Modo local · guarda en este equipo», con punto naranja: guardar modifica los archivos del ordenador de pruebas.
- «Con revisión · publicación protegida», con punto verde: los cambios se guardan en una propuesta y necesitan aprobación.

Las clientas deben utilizar la dirección de producción. El modo local es para pruebas del administrador. Si se ha probado contenido local que no debe conservarse, deja de editar y pide al administrador que restaure los archivos con Git.

## Qué puedes editar

- Configuración general: contacto, logotipos y datos de empresa.
- Página de inicio.
- Madera tecnológica: página, servicios, proyectos, galerías y preguntas frecuentes.
- Reformas: página, servicios, proyectos, galerías y preguntas frecuentes.

No modifiques rutas, identificadores internos, CIF ni datos registrales sin confirmarlo con el administrador. No puedes editar estilos, tamaños, píxeles, código ni la estructura de la web.

## Cambiar un texto

1. Abre «Contenido general», «Madera tecnológica» o «Reformas».
2. Entra en la página correspondiente.
3. Cambia el campo indicado.
4. Pulsa «Guardar». Esto crea o actualiza un borrador; no publica.

## Sustituir una imagen

1. Localiza «Imagen principal», «Imagen» o «Galería».
2. Pulsa la imagen y elige un archivo.
3. Completa el texto alternativo describiendo brevemente lo que se ve.
4. Guarda el borrador.

Usa JPG, PNG o WebP, máximo 3 MB. Recomendación: 1600–2400 px, proporción 4:3 y menos de 1 MB. No renombres HEIC/HEIF como JPG o PNG.

## Añadir un proyecto

1. Entra directamente en «Madera tecnológica» o «Reformas».
2. Abre «Página, proyectos y servicios».
3. En «Proyectos», pulsa «Añadir».
4. Rellena título, tipo, imagen y texto alternativo.
5. Deja «Visible» activado si debe aparecer tras la aprobación.
6. El identificador se genera al guardar si queda vacío.

## Reordenar una galería o proyectos

Usa el asa de arrastre del elemento y muévelo a su nueva posición. En proyectos, el primero ocupa el bloque visual grande. No hace falta numerar títulos.

## Ocultar o eliminar

- Para retirarlo sin perderlo, desactiva «Visible» o «Publicado».
- Elimina solo si estás segura de que no será necesario recuperar el contenido.
- Si una galería queda vacía, la web no falla; simplemente no muestra sus imágenes.

## Guardar y enviar a revisión

1. Pulsa «Guardar» para mantener el trabajo como borrador.
2. Revisa todos los campos obligatorios.
3. Abre «Flujo editorial».
4. Mueve el cambio de «Borrador» a «Lista para revisión».
5. Espera la revisión del administrador.

La clienta no puede publicar. «Lista para revisión» crea una solicitud; no cambia la web pública. El aviso inferior confirma siempre si estás trabajando con revisión.

## Correcciones, aprobación y publicación

- Si el administrador pide cambios, abre el mismo borrador, corrige y vuelve a guardar.
- Si lo rechaza, el cambio se cierra y la web no se modifica.
- Si lo aprueba, GitHub integra el cambio en `main`; después se compila y publica.
- El cambio está publicado cuando ya aparece en `https://azentohome.com` y el administrador confirma el despliegue.

## Hacer varias correcciones

Puedes abrir, guardar y corregir el mismo borrador tantas veces como necesites. Después de una aprobación, una corrección posterior es un cambio nuevo y debe enviarse otra vez a revisión.

En modo local, si el botón de publicación queda desactivado tras una prueba, recarga el panel y vuelve a abrir la entrada. Para comprobar textos y diseño localmente basta con guardar y mirar la web; no necesitas simular una publicación cada vez.

## Si aparece un error

No intentes modificar campos técnicos para solucionarlo. Copia el mensaje, haz una captura y contacta con la persona administradora del sitio indicando qué página y qué cambio estabas haciendo.
