# Changelog — Frontend SAC Plantillas

## [1.0.4]

> Requiere el backend 1.0.4. Desplegar después del backend.

### Navegación y sesión
- Rutas con `react-router-dom`: `/` (inicio) y `/dashboard` (privada). Cualquier otra ruta lleva al inicio.
- Nueva página de inicio dividida en diagonal, con el mensaje de bienvenida del cliente y el formulario de inicio de sesión / registro; al pasar a registro intercambian lados.
- La sesión se verifica contra el servidor al abrir la app (`/api/users/me`); el rol nunca se toma de `localStorage`.
- Pantalla de carga mientras se verifica la sesión (sin mostrar contenido privado) y pantalla "No se pudo conectar" con **Reintentar** si el servidor no responde.
- Si el token caduca o es inválido, se cierra la sesión y se vuelve al inicio con el aviso "Tu sesión expiró".
- Avisos "¡Bienvenido…!" al entrar y "Sesión cerrada correctamente" al salir.
- Errores de login y registro con el mensaje real del servidor.

### Permisos por rol
- Solo los administradores ven "Nueva Plantilla", "Categorías" y editar/eliminar en las tarjetas. Los usuarios consultan, filtran y copian.

### Marcas y categorías
- Eliminar marcas y categorías con confirmación; sus plantillas se conservan sin ellas.
- Errores visibles en el modal (nombre duplicado, color inválido…) y avisos de éxito.
- Si el filtro activo apunta a una marca o categoría eliminada o renombrada, vuelve a "Todas" y a la página 1.

### Plantillas
- El contador "Usado N veces" es personal de cada usuario y la lista se reordena al copiar, sin recargar.
- Paginación de 12 plantillas, siempre con el total visible ("N plantillas · Página X de Y").
- Al editar, la tarjeta muestra al momento la marca y categoría nuevas.
- Si copiar al portapapeles falla, se avisa en lugar de mostrar un falso "¡Copiado!".

### Formularios y modales
- "Nueva plantilla" y el resto de modales abren siempre limpios.
- Si el guardado falla, el modal sigue abierto con el mensaje de error y lo escrito.
- Los modales ya no se cierran con clic fuera ni con Escape; solo con X, Cancelar o Cerrar.

### Interno
- Fallback SPA para Docker (`nginx.conf`); en Render se usa la regla Rewrite `/* → /index.html`.
- Imagen Docker con Node 22 y `engines.node >= 20.19` (requisito de Vite 8).
- Eliminado código sin uso (`ManageModal`, `BrandManager`, `CategoryManager`, `api/client.ts`, `AuthModal`).
- Versión del proyecto alineada: `1.0.4`.
