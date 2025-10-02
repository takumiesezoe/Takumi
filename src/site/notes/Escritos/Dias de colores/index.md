---
{"dg-publish":true,"dg-permalink":"/escritos/dias-de-colores/","title":"Días de colores"}

---

> [!summary] Paleta sentimental
> Miniaturas con colores que guardan recuerdos. Cada nota es una semilla cromática lista para crecer en futuras historias.

<style>
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.palette-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.35rem;
  border-radius: 1.15rem;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 35px rgba(5, 1, 10, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.palette-card:hover,
.palette-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 28px 48px rgba(5, 1, 10, 0.45);
}

.palette-card .swatch {
  width: 100%;
  aspect-ratio: 5 / 2;
  border-radius: 0.9rem;
  background: var(--tone);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.palette-card .tone-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.palette-card .tone-meta {
  font-family: "Fira Code", "SFMono-Regular", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  letter-spacing: 0.06em;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.palette-card .tone-quote {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.78);
}
</style>

<div class="palette-grid">
  <a class="palette-card" href="/escritos/dias-de-colores/blanco-de-nuevos-comienzos/">

    <span class="swatch" style="--tone:#F4F4F4;"></span>
    <span class="tone-name">Blanco de nuevos comienzos 🤍</span>
    <span class="tone-meta">#F4F4F4</span>
    <span class="tone-quote">
      &ldquo;Blanco que guarda la respiración antes del salto.&rdquo;
    </span>
  </a>
  <a class="palette-card" href="/escritos/dias-de-colores/naranja-en-espera/">

    <span class="swatch" style="--tone:#DC7630;"></span>
    <span class="tone-name">Naranja en espera 🟧</span>
    <span class="tone-meta">#DC7630</span>
    <span class="tone-quote">
      &ldquo;Estoy en la sala de espera, he visto a Paula, con Lorena ha ido bien.&rdquo;
    </span>
  </a>
  <a class="palette-card" href="/escritos/dias-de-colores/verde-melancolico/">

    <span class="swatch" style="--tone:#93997B;"></span>
    <span class="tone-name">Verde melancólico 🌱</span>
    <span class="tone-meta">#93997B</span>
    <span class="tone-quote">
      &ldquo;Verde que trae recuerdos y no de los buenos, verde del que dan ganas de lanzarse...&rdquo;
    </span>
  </a>
</div>
