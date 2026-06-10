# Stack y proceso de construccion - La Otra Mirada

## Objetivo

Reconstruir `laotramirada.cl` como una web moderna en Cloudflare Pages, con React, Tailwind y una experiencia editorial fuerte para conferencias.

La nueva web debe:

- Mantener la identidad visual: negro, blanco, rojo, logo fuerte, fotografia editorial y tono institucional.
- Mejorar radicalmente la experiencia de navegacion.
- Crear una grilla de conferencias mas potente que la actual.
- Generar pagina individual solo para videos de conferencias.
- Usar el inventario editorial de `conferencias/inventario_conferencias.md` como fuente inicial de landings.
- Publicar en Cloudflare Pages gratuito.

## Stack definitivo

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- MDX para landings editoriales
- Lucide React para iconos

### Contenido

- `conferencias/inventario_conferencias.md` como fuente editorial inicial.
- Parser propio para convertir el MD en datos estructurados.
- Archivos generados por conferencia:
  - slug
  - titulo
  - fecha
  - participantes
  - biografia
  - resumen
  - youtubeId
  - thumbnail
  - url canonica

### SEO / GEO

- HTML por ruta publica importante.
- Metadata por pagina.
- Open Graph por conferencia.
- JSON-LD:
  - `Organization`
  - `VideoObject`
  - `Event`
  - `BreadcrumbList`
- Sitemap generado.
- `robots.txt`.
- Redirecciones 301 desde URLs antiguas.

### Hosting

- Cloudflare Pages Free.
- Build command: `npm run build`.
- Output: `dist`.
- Dominio: `laotramirada.cl`.
- SSL automatico.

### Testing

- TypeScript strict.
- ESLint.
- Build test.
- Playwright para pruebas visuales y navegacion.
- Screenshot QA en desktop y mobile.
- Auditoria manual de contenido editorial.

## Arquitectura de rutas

```text
/
/conferencias
/conferencias/:slug
/galeria
/noticias
/noticias/:slug
/nuestra-mirada
/contacto
/streaming
```

Regla editorial:

- Solo los videos de la pagina `Conferencias` generan landing individual.
- Otros videos del sitio pueden aparecer embebidos, pero no generan pagina editorial propia.

## Direccion visual

### Lo que se conserva

- Fondo oscuro.
- Logo blanco como ancla de marca.
- Uso fuerte de imagenes reales.
- Rojo como color de accion y enfasis.
- Estetica sobria, intelectual e institucional.
- Grilla visual de conferencias como pieza central.

### Lo que se mejora

- Navegacion mas clara y responsive.
- Tipografia mas consistente.
- Cards de conferencia sin depender del embed de YouTube.
- Miniaturas propias, limpias y clickeables.
- Filtros por expositor, tema y ano.
- Busqueda instantanea.
- Landings con estructura editorial, no solo video.
- Mejor lectura mobile.
- Footer mas compacto y util.

## Proceso multiagente

### Agente 1: Arquitectura y datos

Responsabilidades:

- Parsear `inventario_conferencias.md`.
- Generar modelo de datos de conferencias.
- Definir slugs estables.
- Mapear YouTube IDs y thumbnails.
- Detectar placeholders o campos incompletos.
- Preparar sitemap y redirecciones.

Entregables:

- `src/data/conferences.ts` o JSON equivalente.
- Reporte de campos faltantes.
- Lista de URLs canonicas.

### Agente 2: Direccion de arte y sistema visual

Responsabilidades:

- Traducir las capturas actuales a un sistema visual moderno.
- Definir tokens Tailwind:
  - colores
  - tipografias
  - espacios
  - sombras
  - estados hover/focus
- Disenar header, footer, hero, cards, filtros y landing.

Entregables:

- Layout base.
- Componentes visuales.
- Guia de estilos en codigo.

### Agente 3: Implementacion frontend

Responsabilidades:

- Crear app React + Vite + Tailwind.
- Implementar rutas.
- Implementar grilla de conferencias.
- Implementar pagina individual de conferencia.
- Implementar galeria, noticias, contacto y streaming.
- Integrar contenido.

Entregables:

- Web navegable completa.
- Componentes reutilizables.
- Estado responsive.

### Agente 4: SEO / GEO / performance

Responsabilidades:

- Metadata por pagina.
- Open Graph por conferencia.
- JSON-LD.
- Sitemap.
- `robots.txt`.
- Redirecciones.
- Revision de accesibilidad basica.
- Optimizacion de imagenes y carga.

Entregables:

- SEO tecnico listo para publicacion.
- Checklist de indexacion.

### Agente 5: QA visual y pruebas

Responsabilidades:

- Levantar servidor local.
- Probar rutas principales.
- Capturas Playwright:
  - desktop
  - tablet
  - mobile
- Revisar que no existan textos cortados.
- Revisar que cards, botones e imagenes no se solapen.
- Verificar navegacion entre grilla y landing.
- Verificar build.

Entregables:

- Reporte de QA.
- Screenshots.
- Lista de bugs corregidos.

## Flujo de trabajo

### Fase 1: Preparacion

1. Congelar alcance.
2. Confirmar videos de conferencias.
3. Parsear inventario editorial.
4. Marcar pendientes editoriales.
5. Crear estructura del proyecto.

### Fase 2: Base visual

1. Header responsive.
2. Footer.
3. Home.
4. Sistema de cards.
5. Layout de pagina interna.

### Fase 3: Conferencias

1. Grilla editorial con miniaturas.
2. Busqueda.
3. Filtros.
4. Landing por conferencia.
5. Video embebido.
6. Resumen, participantes, biografia y contenido editorial.
7. Compartir.
8. Relacionadas.

### Fase 4: Resto del sitio

1. Nuestra Mirada.
2. Galeria.
3. Noticias.
4. Contacto.
5. Streaming.

### Fase 5: SEO y deploy

1. Metadata.
2. Sitemap.
3. Robots.
4. Redirecciones.
5. Build.
6. Cloudflare Pages.
7. Dominio.
8. Search Console.

### Fase 6: QA final

1. Playwright desktop/mobile.
2. Revision visual.
3. Revision contenido.
4. Revision performance.
5. Correcciones.
6. Entrega.

## Criterios de aceptacion

- La web compila sin errores.
- Todas las rutas principales cargan.
- `/conferencias` muestra solo conferencias.
- Cada conferencia tiene landing propia.
- Las miniaturas se ven correctamente.
- Las landings muestran video, resumen, participantes y contenido editorial.
- La web es usable en mobile.
- No hay textos cortados ni elementos superpuestos.
- Metadata y Open Graph funcionan.
- Sitemap y robots existen.
- El deploy en Cloudflare Pages funciona con dominio propio.

## Riesgos

- Algunos videos tienen contenido editorial incompleto.
- El MD puede necesitar limpieza de encoding o acentos si viene desde fuentes externas.
- Las miniaturas de YouTube pueden variar en calidad.
- Algunas afirmaciones editoriales generadas por IA deben revisarse antes de publicar.

## Decision final

El proyecto se construira con React + Vite + TypeScript + Tailwind, alimentado por contenido estructurado derivado del inventario editorial. La prioridad visual sera una experiencia de conferencias premium, oscura, editorial, rapida y con landings individuales para cada conferencia.
