;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    root.initPoemIndex = exports.initPoemIndex;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const LINK_RE = /\[\[([^\]|#]+?)(?:\|([^\]]+))?\]\]/g;

  function buildItems(markdown) {
    const items = [];
    if (!markdown) {
      return items;
    }

    let match;
    while ((match = LINK_RE.exec(markdown)) !== null) {
      const rawTarget = (match[1] || '').trim();
      if (!rawTarget) continue;
      const target = rawTarget.endsWith('\\') ? rawTarget.slice(0, -1) : rawTarget;
      const label = (match[2] || target).trim();
      const baseName = target.replace(/\.md$/i, '');
      const fileName = `${baseName}.md`;
      items.push({ label, fileName });
    }
    return items;
  }

  function normalizeBase(base) {
    if (!base) return '';
    return base.endsWith('/') ? base : `${base}/`;
  }

  function encodePathSegments(path) {
    if (!path) return '';
    return path
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
  }

  function clearList(listEl) {
    while (listEl.firstChild) {
      listEl.removeChild(listEl.firstChild);
    }
  }

  function ensureTrailingSlash(value) {
    if (!value) return '';
    return value.endsWith('/') ? value : `${value}/`;
  }

  function initPoemIndex(options = {}) {
    const {
      listSelector = '#poem-list',
      statusSelector = '#status',
      hintSelector = '#hint',
      indexPath = 'index.md',
      viewerBase = 'viewer.html',
      fileBase = '',
      pathPrefix = '',
      limit = null,
      fallbackMarkdown = null,
    } = options;

    const listEl = document.querySelector(listSelector);
    if (!listEl) {
      console.warn(`initPoemIndex: no encontré el elemento '${listSelector}'.`);
      return;
    }

    const statusEl = statusSelector ? document.querySelector(statusSelector) : null;
    const hintEl = hintSelector ? document.querySelector(hintSelector) : null;

    const setStatus = (text) => {
      if (statusEl) {
        statusEl.textContent = text;
      }
    };

    function setHintVisible(visible) {
      if (hintEl) {
        hintEl.hidden = !visible;
      }
    }

    const fileBasePath = normalizeBase(fileBase);
    const normalizedPrefix = ensureTrailingSlash(pathPrefix);
    const limited = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : null;
    const isFileProtocol =
      typeof window !== 'undefined' &&
      window.location &&
      window.location.protocol === 'file:';

    const renderItems = (items) => {
      clearList(listEl);

      if (!items.length) {
        setStatus('No hay poemas listados en index.md.');
        return;
      }

      const visibleItems = limited ? items.slice(0, limited) : items;
      setStatus('Lista preparada.');
      setHintVisible(false);

      visibleItems.forEach(({ label, fileName }) => {
        const targetFileName =
          normalizedPrefix && fileName && !fileName.includes('/')
            ? `${normalizedPrefix}${fileName}`
            : fileName;
        const li = document.createElement('li');
        const link = document.createElement('a');
<<<<<<< HEAD
        const encoded = encodeURIComponent(targetFileName);
        const encodedPath = encodePathSegments(targetFileName);
=======
        const encoded = encodeURIComponent(fileName);
        const encodedPath = encodePathSegments(fileName);
>>>>>>> main
        link.href = `${viewerBase}?file=${encoded}`;
        link.textContent = label;
        li.appendChild(link);
        listEl.appendChild(li);

        if (!isFileProtocol) {
          fetch(`${fileBasePath}${encodedPath}`, { method: 'HEAD' })
            .then((response) => {
              if (!response.ok) {
                throw new Error('missing');
              }
            })
            .catch(() => {
              li.classList.add('missing');
              link.removeAttribute('href');
              const warning = document.createElement('span');
              warning.textContent = '(archivo faltante)';
              li.appendChild(warning);
              setHintVisible(true);
              setStatus('Hay poemas pendientes por subir.');
            });
        }
      });

      if (limited && items.length > visibleItems.length) {
        const moreLi = document.createElement('li');
        moreLi.classList.add('more-items', 'muted');
        const remaining = items.length - visibleItems.length;
        moreLi.textContent = `… y ${remaining} poema${remaining === 1 ? '' : 's'} más en el índice completo.`;
        listEl.appendChild(moreLi);
      }
    };

    const renderFromMarkdown = (markdown) => {
      const items = buildItems(markdown);
      renderItems(items);
      return items.length;
    };

    if (fallbackMarkdown) {
      try {
        const count = renderFromMarkdown(fallbackMarkdown);
        if (count) {
          setStatus('Lista precargada. Verificando actualizaciones…');
        }
      } catch (error) {
        console.error('No se pudo renderizar el índice precargado:', error);
      }
    }

    fetch(indexPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar index.md (HTTP ${response.status})`);
        }
        return response.text();
      })
      .then((markdown) => {
        renderFromMarkdown(markdown);
      })
      .catch((error) => {
        console.error(error);
        if (!listEl.childElementCount) {
          setStatus('No se pudo preparar el índice.');
        } else {
          setStatus('Mostrando la copia precargada del índice.');
        }
      });
  }

  return { initPoemIndex };
});
