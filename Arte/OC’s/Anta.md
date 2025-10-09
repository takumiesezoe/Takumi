---
{"dg-publish":true,"dg-permalink":"/oc/tu-oc/","permalink":"/oc/tu-oc/","tags":["OC","personaje"]}
---


# = this.nombre

> [!quote] Frase
> = this.frase

## 📸 Referencia
![[a-striking-portrait-photograph-of-a-youn_Y6DHgR3qTCSWnOr6MmhiFA_xs1odLt4RSiwlha0RQeMRw.jpeg]]

## 🎨 Color
#a37cda

```dataviewjs
// Muestra una banda coloreada con el color del OC
const color = dv.current().color ?? "#999";
const el = dv.el("div", "", { cls: "color-banner" });
el.style.background = color;
dv.paragraph("**Color:** `" + color + "`");
