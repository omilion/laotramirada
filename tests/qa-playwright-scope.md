# QA Playwright Scope - La Otra Mirada

Fecha: 2026-06-03

## Estado actual

La app frontend todavia no existe en este workspace: no hay `package.json`, `playwright.config.*`, servidor Vite, ni rutas React implementadas. Por eso no se crean specs ejecutables ni configuracion Playwright todavia. Este reporte deja el alcance QA listo para implementar cuando la app este disponible.

## Rutas criticas

Rutas solicitadas para cobertura Playwright:

- `/`
- `/conferencias`
- `/conferencias/:slug`
- `/galeria`
- `/noticias`
- `/contacto`
- `/streaming`

Rutas adicionales recomendadas cuando existan:

- `/noticias/:slug`
- `/nuestra-mirada`
- URLs antiguas con redirecciones 301
- `/robots.txt`
- `/sitemap.xml`

## Criterio para activar Playwright

Implementar `playwright.config.ts` y specs cuando se cumplan estas condiciones:

- Existe `package.json`.
- Existe un comando de servidor local, idealmente `npm run dev`.
- Existe un comando de build, idealmente `npm run build`.
- Las rutas principales responden desde el servidor local.
- Hay al menos un slug real de conferencia generado desde los datos.

## Configuracion recomendada

Archivo: `playwright.config.ts`

- `testDir`: `./tests/e2e`
- `baseURL`: `http://127.0.0.1:5173`
- `webServer.command`: `npm run dev -- --host 127.0.0.1`
- `webServer.url`: `http://127.0.0.1:5173`
- `reuseExistingServer`: `true` en desarrollo local.
- `reporter`: `html`, `list`.
- `trace`: `on-first-retry`.
- `screenshot`: `only-on-failure`.
- Proyectos:
  - Chromium desktop: `1440x1000`
  - Mobile Chrome: pixel 7 o viewport equivalente
  - WebKit mobile si el presupuesto de tiempo lo permite

## Specs recomendadas

### `tests/e2e/routes.spec.ts`

Objetivo: smoke test de navegacion.

Checks:

- Cada ruta critica carga con estado correcto.
- No queda en pantalla un error de router, pagina 404 accidental o error de Vite.
- Header/nav y footer aparecen en rutas publicas.
- El titulo principal visible corresponde a la ruta.
- No hay errores severos de consola del navegador.

### `tests/e2e/conferences.spec.ts`

Objetivo: validar el flujo editorial central.

Checks:

- `/conferencias` muestra una grilla/listado de conferencias.
- Cada card tiene titulo, imagen o thumbnail, y link navegable.
- La primera card abre una URL `/conferencias/:slug`.
- La landing individual muestra titulo, video o iframe, resumen/contenido editorial y participantes cuando existan.
- El usuario puede volver a `/conferencias` desde la landing.
- Busqueda y filtros se validan cuando esten implementados.

### `tests/e2e/responsive.spec.ts`

Objetivo: detectar regresiones visuales y de layout en desktop/mobile.

Checks:

- No hay overflow horizontal en viewport mobile.
- Header mobile permite navegar a rutas clave.
- Textos de botones/cards no se cortan.
- Imagenes, iframes y cards no se solapan.
- Capturas QA para:
  - `/`
  - `/conferencias`
  - primer `/conferencias/:slug`
  - `/galeria`
  - `/contacto`
  - `/streaming`

### `tests/e2e/contact.spec.ts`

Objetivo: validar contacto sin enviar datos reales.

Checks:

- Formulario o datos de contacto visibles.
- Campos requeridos tienen validacion.
- Envio vacio muestra errores accesibles.
- Si existe integracion real, usar ruta/mock de prueba antes de validar envio.

### `tests/e2e/streaming.spec.ts`

Objetivo: validar estados de streaming.

Checks:

- La ruta carga aunque no haya evento live.
- Si hay iframe activo, tiene contenedor responsive.
- Si no hay live, muestra estado claro sin romper layout.

## Checks tecnicos transversales

- Capturar `page.on('console')` y fallar en `error` salvo excepciones conocidas documentadas.
- Validar ausencia de `pageerror`.
- Validar que el body no este vacio.
- Validar landmarks basicos: `banner`, `main`, `contentinfo` cuando la UI los implemente.
- Validar al menos un heading visible por ruta.
- Validar `document.documentElement.scrollWidth <= window.innerWidth` en mobile.

## Datos de prueba

Para `/conferencias/:slug`, no hardcodear un slug hasta que exista el modelo de datos. Preferir descubrirlo desde la primera card/link real en `/conferencias`, asi el test acompana cambios editoriales sin romperse por datos legitimos.

## Reporte QA esperado

Cuando la app exista, generar un reporte en `tests/reports/qa-playwright-report.md` con:

- Fecha y commit probado.
- Comando usado.
- Navegadores/viewport probados.
- Rutas cubiertas.
- Hallazgos por severidad.
- Capturas relevantes si hay defectos visuales.
- Bugs corregidos o pendientes.

## Hallazgos actuales

- No existe app frontend ejecutable en el workspace.
- No existe `package.json`.
- No existe configuracion Playwright.
- No existen rutas implementadas para probar.
- El alcance de rutas y stack objetivo si esta documentado en `plan-stack-proceso-web.md`.
