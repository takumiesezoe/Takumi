async function renderPoemIndex({
  listId = "poem-list",
  statusId = "status",
  folderListId,
  folderStatusId,
  indexPath = "./poems/index.json",
  orderPath
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



  async function loadJson(targetUrl) {
    try {
      const res = await fetch(targetUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (fetchError) {
      const isFile = typeof window !== "undefined" && window.location && window.location.protocol === "file:";
      if (!isFile) throw fetchError;

      console.warn("[poem-index] fetch falló, intentando XMLHttpRequest", fetchError);
      return await new Promise((resolve, reject) => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", targetUrl, true);
          xhr.responseType = "json";
          xhr.onerror = () => {
            reject(new Error("XMLHttpRequest error"));
          };
          xhr.onload = () => {
            if (xhr.status && xhr.status !== 200) {
              reject(new Error(`HTTP ${xhr.status}`));
              return;
            }
            if (xhr.response != null) {
              resolve(xhr.response);
            } else {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (parseError) {
                reject(parseError);
              }
            }
          };
          xhr.send();
        } catch (xhrSetupError) {
          reject(xhrSetupError);
        }
      });
    }

  }

  try {
    const entries = await loadJson(url);

    if (!Array.isArray(entries)) throw new Error("Formato de index.json no válido");

    let orderMap = null;
    if (orderPromise) {
      const orderText = await orderPromise;
      if (orderText) {
        orderMap = new Map();
        const seenKeys = new Set();
        const linkRegex = /\[\[(.+?)\|(.+?)\]\]/g;
        let match;
        let position = 0;
        while ((match = linkRegex.exec(orderText))) {
          const target = match[1].trim();
          const label = match[2].trim();
          if (!label) {
            position += 1;
            continue;
          }
          const variants = [label, target];
          const targetNoExt = target.replace(/\.md$/i, "");
          if (targetNoExt && targetNoExt !== target) variants.push(targetNoExt);
          const targetLast = targetNoExt.split("/").pop();
          if (targetLast && !variants.includes(targetLast)) variants.push(targetLast);

          for (const variant of variants) {
            const key = variant.trim();
            if (!key || seenKeys.has(key)) continue;
            orderMap.set(key, position);
            orderMap.set(key.toLowerCase(), position);
            seenKeys.add(key);
          }
          position += 1;
        }
        if (!orderMap.size) orderMap = null;
      }
    }

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


    const normalizedEntries = entries.map((entry, index) => {

      if (typeof entry === "string") {
        const title = entry.replace(/\.md$/i, "");
        const href = `./viewer.html?poem=${encodeURIComponent(entry)}`;
        return {
          kind: "poem",
          title,
          href,
          description: "",
          keys: [title, entry, title.toLowerCase()],
          originalIndex: index
        };
      }

      if (!entry || typeof entry !== "object") {
        return { kind: "unknown", originalIndex: index, raw: entry };
      }


      if (entry.type === "folder" && entry.path && entry.index) {

        const displayName = entry.name || entry.path;
        const href = entry.url || `./collection.html?folder=${encodeURIComponent(entry.path)}`;
        const keys = [displayName, entry.path];
        if (entry.name && entry.name !== entry.path) keys.push(entry.name);
        return {
          kind: "folder",
          title: displayName,
          href,
          description: entry.description || "",
          keys,
          originalIndex: index
        };
      }

      const file = typeof entry.file === "string" ? entry.file : typeof entry.path === "string" ? entry.path : null;
      if (!file) {
        return { kind: "unknown", originalIndex: index, raw: entry };
      }

      const safeFile = file;
      const display = entry.title || entry.name || safeFile;
      const title = display.replace ? display.replace(/\.md$/i, "") : String(display);
      const href = entry.url ? entry.url : `./viewer.html?poem=${encodeURIComponent(safeFile)}`;
      const baseKeys = [title, safeFile];
      const noExt = safeFile.replace(/\.md$/i, "");
      if (noExt && noExt !== title) baseKeys.push(noExt);
      return {
        kind: "poem",
        title,
        href,
        description: "",
        keys: baseKeys,
        originalIndex: index
      };
    });

    const entriesToRender = orderMap
      ? [...normalizedEntries].sort((a, b) => {
          const rankFor = (item) => {
            if (!orderMap) return Number.POSITIVE_INFINITY;
            if (!item || !item.keys) return Number.POSITIVE_INFINITY;
            for (const key of item.keys) {
              if (typeof key !== "string") continue;
              const trimmed = key.trim();
              if (!trimmed) continue;
              if (orderMap.has(trimmed)) return orderMap.get(trimmed);
              const lower = trimmed.toLowerCase();
              if (orderMap.has(lower)) return orderMap.get(lower);
            }
            return Number.POSITIVE_INFINITY;
          };
          const rankA = rankFor(a);
          const rankB = rankFor(b);
          if (rankA !== rankB) return rankA - rankB;
          return a.originalIndex - b.originalIndex;
        })
      : normalizedEntries;

    for (const entry of entriesToRender) {
      if (!entry || entry.kind === "unknown") {
        console.warn("[poem-index] Entrada ignorada", entry && entry.raw ? entry.raw : entry);
        continue;
      }

      if (entry.kind === "folder") {
        const item = makeItem(`📁 ${entry.title}`, entry.href, "folder");
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

      const poemItem = makeItem(entry.title, entry.href, "poem");
      poemFragment.appendChild(poemItem);
      poemCount += 1;
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
