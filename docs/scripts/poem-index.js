async function loadPoems() {
  const list = document.getElementById("poem-list");
  try {
    const res = await fetch("poems/index.json", { cache: "no-store" });
    if (!res.ok) throw new Error("No hay index.json");
    const files = await res.json(); // ["Borroso.md", "Llanto.md", ...]
    if (!Array.isArray(files) || files.length === 0) {
      list.textContent = "Aún no hay poemas. 🌱";
      return;
    }
    // Orden alfabético, insensible a acentos/mayúsculas
    const collator = new Intl.Collator("es", { sensitivity: "base" });
    files.sort((a, b) => collator.compare(a, b));

    list.innerHTML = files.map(name => {
      const title = name.replace(/\.md$/i, "");
      const url = `viewer.html?file=${encodeURIComponent(name)}`;
      return `<a href="${url}">${title}</a>`;
    }).join("");
  } catch (e) {
    console.error(e);
    list.textContent = "No se pudieron listar los poemas.";
  }
}
loadPoems();
