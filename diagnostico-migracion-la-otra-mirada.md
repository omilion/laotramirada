# Diagnostico y plan de migracion - La Otra Mirada

## Estado del paquete descargado

Ruta revisada:

```text
C:\Users\flipe\Downloads\cgi-bin
```

El paquete contiene una instalacion parcial de WordPress:

- `wp-content/plugins`
- `wp-content/themes`
- `wp-content/uploads`
- algunos archivos raiz como `index.php`, `wp-login.php`, `wp-cron.php`

No se encontro:

- `wp-config.php`
- `wp-admin`
- `wp-includes`
- dump SQL de base de datos
- export XML de WordPress
- backup tipo `.wpress`, Duplicator, Updraft o similar

Conclusion: sirve para identificar tecnologia, plugins y algunos assets, pero no basta por si solo para inventariar paginas, entradas, menus ni contenido Elementor.

## Acceso API WordPress

La API REST de WordPress esta disponible en:

```text
https://laotramirada.cl/wp-json/
```

Desde el entorno sandbox inicial no conectaba a los puertos 80/443, pero fuera del sandbox la API respondio correctamente.

La contrasena de aplicacion permitio consultar endpoints autenticados.

## Inventario detectado por API

Conteos principales:

- 19 paginas
- 21 posts
- 24 categorias
- 15 etiquetas
- 100 medios
- 5 menus
- 13 items de menu
- 6 templates/bloques Elementor Library

Configuracion general:

- Sitio: `La otra mirada`
- URL: `https://laotramirada.cl`
- Idioma configurado: `en_US`
- Front page: pagina ID `46`
- Home actual: `https://laotramirada.cl/`
- Logo/icono del sitio: media ID `192`

Pagina de inicio:

- ID: `46`
- Titulo: `Conferencias 2025 La Otra Mirada`
- Slug interno: `inicio-2023`
- URL publica: `https://laotramirada.cl/`
- Meta Elementor detectada:
  - `_elementor_edit_mode`
  - `_elementor_template_type`
  - `_elementor_data`
  - `_elementor_page_settings`
  - `_elementor_conditions`

Esto confirma que podemos extraer contenido Elementor por API autenticada.

## Paginas detectadas

Publicadas:

- `https://laotramirada.cl/` - Conferencias 2025 La Otra Mirada
- `https://laotramirada.cl/conferencias/` - Conferencias
- `https://laotramirada.cl/quienes-somos/` - Quienes Somos
- `https://laotramirada.cl/nuestro-equipo/` - Nuestro Equipo
- `https://laotramirada.cl/galeria/` - Galeria
- `https://laotramirada.cl/contacto/` - Contacto
- `https://laotramirada.cl/noticias/` - Noticias
- `https://laotramirada.cl/prensa/` - Prensa
- `https://laotramirada.cl/opinion-2/` - Opinion
- `https://laotramirada.cl/streaming/` - streaming
- `https://laotramirada.cl/proximas-conferencias/` - Proximas Conferencias
- `https://laotramirada.cl/jonathan-haidt-y-los-cambios-en-el-mundo-globalizado/` - Jonathan Haidt
- `https://laotramirada.cl/ivan-duque-seguridad-y-democracia-en-latinoamerica/` - Ivan Duque
- `https://laotramirada.cl/una-verdadera-feminista/` - Una verdadera feminista
- `https://laotramirada.cl/elementor-554/` - la otra mirada de la seguridad
- `https://laotramirada.cl/2212-2/` - sin titulo
- `https://laotramirada.cl/elementor-8/` - ya volvemos

Borradores:

- `Guy Sorman`
- `Privacy Policy`

## Posts detectados

Hay 21 posts publicados. Algunos titulos relevantes:

- Jesse Norman, el guru ingles que estara en Enade
- Chile: Capitalismo, virtudes y musica electronica
- El discurso contra el capitalismo se vuelve peor despues de cada crisis
- McCloskey y las predicciones en economia
- Niall Ferguson
- Niall Ferguson: La desigualdad no es una barrera para el desarrollo economico
- La otra mirada de Jesse Norman
- Jesse Norman y el valor de la sociedad civil
- Yoani Sanchez: La Cuba que Camila Vallejo no quiso ver
- Hello world!

## Categorias detectadas

Categorias principales:

- Conferencia
- Proximas Conferencias
- Prensa
- Video
- Slide home
- DESTACADA
- Ayaan Hirsi Ali
- Deirdre McCloskey
- Guy Sorman
- Jesse Norman
- Jonathan Haidt
- Niall Ferguson
- Yoani Sanchez
- Rudolph/Rudy Giuliani
- Luigi Zingales

## Menus detectados

Menus:

- HOME
- Luigi Zingale
- Main Menu
- Pre lanzamiento
- Proximas Conferencias

Items de menu detectados:

- Proximas Conferencias
- Nuestra Mirada
- Nosotros
- Conferencias
- Galeria
- Quienes Somos
- Blog
- Noticias
- Contacto
- Una verdadera feminista
- Guy Sorman
- Conferencias 2025 La Otra Mirada

## Elementor Library

Templates/bloques detectados:

- `slider`
- `slide 1`
- `Elementor Header #253`
- `Elementor Footer #189`
- `la otra mirada`
- `Default Kit`

## Videos de YouTube detectados

Extraccion realizada desde:

- `content.raw`
- `content.rendered`
- `_elementor_data`
- metadatos editables de paginas, posts y Elementor Library

Las URLs fueron normalizadas por ID de video para evitar duplicados y enlaces pegados por JSON/Elementor.

### Pagina Conferencias

Fuente:

```text
https://laotramirada.cl/conferencias/
```

Decision de alcance:

- Las landings con informacion editorial se crearan solo para videos de conferencias.
- Los videos de Home, posts sueltos o paginas institucionales pueden existir como embeds o contenido auxiliar, pero no generan pagina editorial individual de conferencia.
- Cada URL de la lista de conferencias debe generar una landing individual con informacion, resumen, participantes y contenido editorial.
- El archivo editorial base para estas landings es `conferencias/inventario_conferencias.md`.

Videos detectados:

- `https://www.youtube.com/watch?v=2pGObT6T-XE`
- `https://www.youtube.com/watch?v=9gTf8H3Ya9k`
- `https://www.youtube.com/watch?v=A0mRUTTPt30`
- `https://www.youtube.com/watch?v=BI2jcDcGq6g`
- `https://www.youtube.com/watch?v=cQ1BB0tOMI0`
- `https://www.youtube.com/watch?v=EDCqWK8h5AE`
- `https://www.youtube.com/watch?v=EeKw2kfwFYA`
- `https://www.youtube.com/watch?v=erbqSsUBK0k`
- `https://www.youtube.com/watch?v=Ey4XuixqdKQ`
- `https://www.youtube.com/watch?v=hL0883CI0BQ`
- `https://www.youtube.com/watch?v=J6plxDBnz5A`
- `https://www.youtube.com/watch?v=jCKWiwdpuuY`
- `https://www.youtube.com/watch?v=l1DbR3EQZtI`
- `https://www.youtube.com/watch?v=Ld8dkr_pnGY`
- `https://www.youtube.com/watch?v=mm8bDMegZik`
- `https://www.youtube.com/watch?v=nB0YeCZMg1E`
- `https://www.youtube.com/watch?v=PiEk7zcpL7I`
- `https://www.youtube.com/watch?v=tlGY6s-ZJug`
- `https://www.youtube.com/watch?v=tm2jCUGG-Lo`
- `https://www.youtube.com/watch?v=TmG5OizxSAo`
- `https://www.youtube.com/watch?v=uGrPdngMZ7A`
- `https://www.youtube.com/watch?v=VN6S-csF8Gk`
- `https://www.youtube.com/watch?v=WDH8JoVU6aU`

### Home

Fuente:

```text
https://laotramirada.cl/
```

Videos detectados:

- `https://www.youtube.com/watch?v=BI2jcDcGq6g`
- `https://www.youtube.com/watch?v=PiEk7zcpL7I`

### Post Niall Ferguson

Fuente:

```text
https://laotramirada.cl/2023/10/24/niall-ferguson-2/
```

Videos detectados:

- `https://www.youtube.com/watch?v=E1wUSUIPYFM`
- `https://www.youtube.com/watch?v=ezmvkG427gc`
- `https://www.youtube.com/watch?v=S_VIF_l4Ulc`
- `https://www.youtube.com/watch?v=TPCLHAtX7e8`
- `https://www.youtube.com/watch?v=wo3Mb0i25YA`
- `https://www.youtube.com/watch?v=yk1gRE1Rv8I`

### Otras paginas con YouTube

Fuente:

```text
https://laotramirada.cl/nuestro-equipo/
```

- `https://www.youtube.com/watch?v=XHOmBV4js_E`

Fuente:

```text
https://laotramirada.cl/quienes-somos/
```

- `https://www.youtube.com/watch?v=CmJzHrg7ceM`

## Tecnologia actual detectada

Tema probable:

- Hello Elementor `3.4.6`

Plugins detectados:

- Elementor
- Elementor Pro
- Contact Form 7
- BDThemes Element Pack Lite
- WPB Elementor Addons
- MalCare Security
- Regenerate Thumbnails
- GetSocial Share Buttons

Lectura tecnica:

- El sitio fue construido con WordPress + Elementor.
- Las paginas y secciones editadas con Elementor viven principalmente en la base de datos, en `wp_posts` y `wp_postmeta`.
- Los archivos PHP del tema/plugin no contienen el contenido real del cliente.

## Assets encontrados

En `wp-content/uploads` solo aparece contenido de septiembre de 2025:

- `Banner-Web-LOM-2025_Streaming.jpg`
- versiones redimensionadas del banner
- `sds.png`
- versiones redimensionadas de `sds.png`

Esto sugiere que el paquete descargado no trae todo el historial de medios del sitio. La API, en cambio, reporta 100 medios, incluyendo imagenes de 2025 y 2026.

## Lo que falta pedir al cliente/hosting

La API autenticada ya permite inventariar buena parte del sitio. Aun asi, para una migracion completa y verificable conviene pedir al menos una de estas opciones:

1. Dump de base de datos MySQL/MariaDB, idealmente `.sql`.
2. Exportacion WordPress desde `Herramientas > Exportar > Todo el contenido`.
3. Backup completo del hosting con archivos + base de datos.
4. Acceso cPanel/phpMyAdmin para exportar la base.
5. Acceso funcional a `/wp-admin` o `/wp-json/` para extraer contenido por API.

Tablas clave si conseguimos SQL:

- `wp_posts`
- `wp_postmeta`
- `wp_terms`
- `wp_term_taxonomy`
- `wp_term_relationships`
- `wp_options`
- `wp_users`

Metadatos clave de Elementor:

- `_elementor_data`
- `_elementor_page_settings`
- `_elementor_template_type`
- `_thumbnail_id`

## Plan para reconstruir en React + Vite + Tailwind

### 1. Inventario

Extraer desde la base o export:

- Paginas publicadas
- Entradas
- Categorias
- Etiquetas
- Menus
- Imagenes destacadas
- Formularios
- URLs actuales
- Contenido Elementor
- Videos/iframes

Salida esperada:

```text
titulo
slug
tipo
url_actual
url_nueva
estado
fecha
categoria
extracto
contenido
imagen_destacada
galeria
video_iframe
seo_title
seo_description
```

### 2. Nueva app

Stack propuesto:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Cloudflare Pages

Estructura sugerida:

```text
src/
  components/
  data/
  pages/
  routes/
  lib/
public/
  assets/
  uploads/
```

### 3. Hub de conferencias

Crear:

- archivo historico
- filtros por ano, categoria y expositor
- buscador en tiempo real
- tarjetas de conferencias
- pagina individual por conferencia

### 4. Paginas individuales

Cada conferencia/exposicion debe tener:

- URL propia
- titulo optimizado
- resumen ejecutivo
- video responsive
- galeria
- expositor
- fecha
- categoria
- botones de compartir
- Open Graph
- JSON-LD

### 5. Streaming

Primera version gratis:

- configuracion en archivo JSON
- `isLive: true/false`
- `iframeUrl`
- titulo del evento
- banner

Version futura:

- Cloudflare Functions
- Cloudflare D1 o KV
- panel privado para cambiar iframe y activar/desactivar modo live

### 6. SEO / GEO

Implementar:

- sitemap
- robots.txt
- metadatos por pagina
- Open Graph
- Twitter cards
- JSON-LD `Organization`
- JSON-LD `Event`
- JSON-LD `VideoObject`
- redirecciones 301 desde URLs antiguas
- pagina editorial tipo `llms.txt` o equivalente

### 7. Deploy

Flujo:

1. Crear repo GitHub.
2. Crear proyecto Cloudflare Pages.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Conectar dominio `laotramirada.cl`.
6. Configurar `www`.
7. Activar HTTPS.
8. Subir sitemap a Search Console.

## Riesgo principal

Sin base de datos o export WordPress no se puede saber con certeza cuales son las paginas actuales ni recuperar el contenido real hecho en Elementor.

La carpeta descargada permite avanzar en diseno, estructura y rescate de algunos assets, pero no permite una migracion fiel por si sola.
