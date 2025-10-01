---
{"dg-publish":true,"dg-permalink":"/oc/tu-oc/","permalink":"/oc/tu-oc/","tags":["OC","personaje"]}
---


# = this.nombre

> [!quote] Frase
> = this.frase

## 📸 Referencia
![Pasted image 20251001211203.png](/img/user/Pasted%20image%2020251001211203.png)]]

## 🎨 Color
#a37cda

```dataviewjs
// Muestra una banda coloreada con el color del OC
const color = dv.current().color ?? "#999";
const el = dv.el("div", "", { cls: "color-banner" });
el.style.background = color;
dv.paragraph("**Color:** `" + color + "`");
