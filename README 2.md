# Takumi's Garden

Takumi's Garden is a small static site that collects poems, songs and other writings. The site is built from the contents under [`src/site`](src/site) and deployed automatically to GitHub Pages via the workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

## Repository layout

```
src/site/                # Source files for the published site
  assets/                # Client-side scripts and shared assets
  notes/                 # Obsidian-style markdown vault with the poems
fix_index_links.py       # Helper script for keeping the poem index tidy
```

Large media assets that do not belong to the public site live at the top level of the repository. They are ignored by the deployment workflow.

## Local preview

The site is static, so you can preview it with any HTTP server. A quick option that ships with Python is:

```bash
python -m http.server --directory src/site 3000
```

Then visit <http://localhost:3000> in your browser.

### ¿Problemas con `fatal: not a git repository`?

Si ves un error como `fatal: not a git repository (or any of the parent directories): .git` al ejecutar comandos de Git, significa que no estás dentro de un repositorio inicializado. Asegúrate de clonar el proyecto en vez de descargarlo como ZIP y de ejecutar los comandos desde la carpeta raíz de `takumi-s-garden`.

```bash
git clone git@github.com:TU-USUARIO/takumi-s-garden.git
cd takumi-s-garden
# ahora sí, por ejemplo:
git status
```

Si ya descargaste los archivos manualmente y perdiste la carpeta `.git`, puedes volver a crearla con `git init` y volver a asociar el remoto (`git remote add origin …`), aunque lo más sencillo suele ser clonar nuevamente el repositorio.

## Maintaining the poem index

The list of poems shown on the home page is generated from [`notes/Escritos/Canciones-poemas-escritos/index.md`](src/site/notes/Escritos/Canciones-poemas-escritos/index.md). Maintaining the hundreds of wiki-style links by hand can be error-prone. The [`fix_index_links.py`](fix_index_links.py) utility checks the links and suggests corrections that match existing Markdown files.

To run the script in dry-run mode:

```bash
python fix_index_links.py --index src/site/notes/Escritos/Canciones-poemas-escritos/index.md
```

Add `--apply` to write the safe corrections back to `index.md` (a `.bak` copy is left alongside the original file). This is handy after adding new poems or renaming files.
