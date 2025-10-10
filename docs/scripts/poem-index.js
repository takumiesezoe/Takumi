async function renderPoemIndex({
  listId = "poem-list",
  statusId = "status",
  folderListId,
  folderStatusId,
  indexPath = "./poems/index.json"
} = {}) {
  const list = document.getElementById(listId);
  if (!list) {
    console.warn("[poem-index] No se encontró el contenedor", listId);
    return;
  }
  const status = statusId ? document.getElementById(statusId) : null;
  const folderList = folderListId ? document.getElementById(folderListId) : null;
  const folderStatus = folderStatusId ? document.getElementById(folderStatusId) : null;

  const querySep = indexPath.includes("?") ? "&" : "?";
  const url = `${indexPath}${querySep}ts=${Date.now()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const entries = await res.json();
    if (!Array.isArray(entries)) throw new Error("Formato de index.json no válido");

    let poemCount = 0;
    let folderCount = 0;

    const poemFragment = document.createDocumentFragment();
    const folderFragment = folderList ? document.createDocumentFragment() : null;
    const itemTag = list.tagName === "UL" ? "li" : "div";

    const makeItem = (text, href, extraClass) => {
      const item = document.createElement(itemTag);
      if (extraClass) item.classList.add(extraClass);
      const link = document.createElement("a");
      link.href = href;
      link.textContent = text;
      item.appendChild(link);
      return item;
    };

    for (const entry of entries) {
      if (entry && typeof entry === "object" && entry.type === "folder" && entry.path && entry.index) {
        const displayName = entry.name || entry.path;
        const href = entry.url || `./collection.html?folder=${encodeURIComponent(entry.path)}`;
        const item = makeItem(`📁 ${displayName}`, href, "folder");
        if (entry.description) {
          const desc = document.createElement("small");
          desc.textContent = entry.description;
          desc.style.display = "block";
          desc.style.opacity = "0.75";
          desc.style.marginTop = "0.1rem";
          item.appendChild(desc);
        }
        if (folderFragment) {
          folderFragment.appendChild(item);
        } else {
          poemFragment.appendChild(item);
        }
        folderCount += 1;
      } else if (
        typeof entry === "string" ||
        (entry && typeof entry === "object" && (typeof entry.file === "string" || typeof entry.path === "string"))
      ) {
        const file = typeof entry === "string" ? entry : entry.file || entry.path;
        const safeFile = typeof file === "string" ? file : String(file);
        const display = (entry && typeof entry === "object" && (entry.title || entry.name)) || file;
        const title = display.replace ? display.replace(/\.md$/i, "") : String(display);
        const href = (entry && typeof entry === "object" && entry.url)
          ? entry.url
          : `./viewer.html?poem=${encodeURIComponent(safeFile)}`;
        poemFragment.appendChild(makeItem(title, href, "poem"));
        poemCount += 1;
      } else {
        console.warn("[poem-index] Entrada ignorada", entry);
      }
    }

    list.innerHTML = "";
    list.appendChild(poemFragment);

    if (folderFragment && folderList) {
      folderList.innerHTML = "";
      if (folderCount) {
        folderList.appendChild(folderFragment);
        if (folderStatus) {
          folderStatus.textContent = `${folderCount} ${folderCount === 1 ? "colección" : "colecciones"}`;
        }
      } else {
        if (folderStatus) folderStatus.textContent = "No hay colecciones.";
      }
    } else if (folderStatus) {
      folderStatus.textContent = "";
    }

    if (status) {
      const parts = [];
      parts.push(`${poemCount} ${poemCount === 1 ? "poema" : "poemas"}`);
      if (folderCount && !(folderFragment && folderList)) {
        parts.push(`${folderCount} ${folderCount === 1 ? "carpeta" : "carpetas"}`);
      }
      status.textContent = parts.join(" · ");
    }
  } catch (error) {
    console.error("[poem-index]", error);
    if (status) status.textContent = "No se pudieron listar los poemas: " + error.message;
  }
}

if (typeof window !== "undefined") {
  window.renderPoemIndex = renderPoemIndex;
  window.addEventListener("DOMContentLoaded", () => {
    const options = window.POEM_INDEX_OPTIONS || {};
    renderPoemIndex(options).catch((error) => {
      console.error("[poem-index]", error);
    });
  });
}
