---
{"dg-publish":true,"dg-permalink":"/oc/tu-oc/","permalink":"/oc/tu-oc/","tags":["OC","personaje"]}
---


# = this.nombre

> [!quote] Frase
> = this.frase

## 📸 Referencia
![[20251002_0828_Bold Expression Portrait_remix_01k6hsmynqf0x87meyq86zw8a8.png]]
## 🎨 Color
#a37cda

```dataviewjs
// Muestra una banda coloreada con el color del OC
const color = dv.current().color ?? "#999";
const el = dv.el("div", "", { cls: "color-banner" });
el.style.background = color;
dv.paragraph("**Color:** `" + color + "`");
