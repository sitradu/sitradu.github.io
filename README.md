# Sitio del sindicato — esqueleto Hugo + Sveltia CMS

Estructura mínima con dos colecciones de contenido:

- **`content/noticias/`** — noticias propias, con cuerpo de texto en Markdown, resumen e imagen opcional.
- **`content/enlaces/`** — fichas que apuntan a una nota publicada en otro medio. Se muestran en los listados como tarjetas que abren la URL externa en una pestaña nueva (`target="_blank"`); la página interna de cada enlace existe solo como redirección de respaldo si alguien llega directo a esa ruta.

La portada (`layouts/index.html`) combina ambas colecciones en un único feed ordenado por fecha, distinguiendo "Noticia" de "Enlace externo".

## 1. Poner el repo en marcha

```bash
git init
git add .
git commit -m "Esqueleto inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Editar dos cosas antes de publicar:

- `hugo.toml` → `baseURL` con la URL real del sitio.
- `static/admin/config.yml` → `backend.repo` con `usuario/repo` real.

## 2. Publicar con GitHub Pages

En el repo de GitHub: **Settings → Pages → Source: GitHub Actions**. El workflow en `.github/workflows/deploy.yml` ya está listo: cada push a `main` (incluidos los commits que genere el panel de edición) dispara el build de Hugo y publica `public/` automáticamente. No requiere configuración adicional.

Si preferís Cloudflare Pages en vez de GitHub Pages, conectás el repo desde el dashboard de Cloudflare con build command `hugo --minify` y directorio de salida `public`; no hace falta el workflow de Actions en ese caso.

## 3. Habilitar el panel de edición (`/admin`)

El panel es [Sveltia CMS](https://github.com/sveltia-cms/sveltia-cms), reemplazo directo y activamente mantenido de Decap/Netlify CMS, ya cargado en `static/admin/index.html` y configurado en `static/admin/config.yml` con las colecciones "Noticias" y "Enlaces".

Para el login contra GitHub hay dos caminos, según quién vaya a editar:

**A) Si sos el único editor técnico**
Sveltia CMS admite login con un *personal access token* de GitHub directamente, sin backend intermedio. Es la opción más simple: en `/admin` elegís "iniciar sesión con token" y pegás un PAT con permiso `repo` generado desde GitHub (Settings → Developer settings → Personal access tokens).

**B) Si van a editar varias personas no técnicas**
Conviene una experiencia de login normal (botón "Continuar con GitHub"). Para eso hace falta desplegar una vez un pequeño intermediario OAuth — el proyecto oficial [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth), un script de Cloudflare Workers de instalación gratuita en unos minutos — y agregar la línea `base_url` al backend en `config.yml`:

```yaml
backend:
  name: github
  repo: TU-USUARIO/TU-REPO
  branch: main
  base_url: https://sveltia-cms-auth.TU-SUBDOMINIO.workers.dev
```

Cada persona invitada como colaboradora del repo de GitHub va a poder loguearse en `/admin` y crear/editar noticias y enlaces sin tocar Git.

## 4. Flujo de trabajo diario

1. Alguien entra a `tusitio.com/admin`.
2. Crea una entrada en "Noticias" (texto propio) o en "Enlaces" (título + URL del medio + fuente).
3. Al guardar, Sveltia CMS hace commit directo a `main`.
4. GitHub Actions reconstruye el sitio y lo publica en 1-2 minutos.

## 5. Desarrollo local

```bash
hugo server -D
```

Para editar con el CMS en local, corriendo en paralelo un proxy de Git local (`npx netlify-cms-proxy-server` funciona también con Sveltia) con `local_backend: true` ya seteado en `config.yml`.
