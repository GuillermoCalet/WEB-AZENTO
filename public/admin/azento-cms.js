(function () {
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
  const MAX_IMAGE_DIMENSION = 8000;
  const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

  const slugify = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const validateImages = (value) => {
    if (typeof value === "string" && value.startsWith("/images/")) {
      if (!/\.(?:jpe?g|png|webp)$/i.test(value)) {
        throw new Error("Solo se permiten imágenes JPG, PNG o WebP.");
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(validateImages);
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach(validateImages);
    }
  };

  const showToast = (message) => {
    document.querySelector(".azento-cms-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "azento-cms-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 6500);
  };

  const readImageDimensions = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen."));
      };
      image.src = url;
    });

  const validateSelectedFiles = async (input) => {
    for (const file of input.files || []) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        input.value = "";
        showToast("«" + file.name + "» no es JPG, PNG ni WebP. Convierte la imagen antes de subirla.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        input.value = "";
        showToast("«" + file.name + "» supera el máximo de 3 MB. Reduce su peso antes de subirla.");
        return;
      }
      try {
        const { width, height } = await readImageDimensions(file);
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          input.value = "";
          showToast("«" + file.name + "» supera los 8000 px permitidos. Reduce sus dimensiones.");
          return;
        }
      } catch {
        input.value = "";
        showToast("No se pudo validar «" + file.name + "». Utiliza una imagen JPG, PNG o WebP válida.");
        return;
      }
    }
  };

  const installInterfaceHelpers = () => {
    const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const tools = document.createElement("div");
    const mode = document.createElement("span");
    const help = document.createElement("a");

    tools.className = "azento-cms-tools";
    tools.dataset.local = String(local);
    mode.className = "azento-cms-mode";
    mode.textContent = local
      ? "Modo local · guarda en este equipo"
      : "Con revisión · publicación protegida";
    help.className = "azento-cms-help";
    help.href = "/admin/guia.html";
    help.target = "_blank";
    help.rel = "noopener";
    help.textContent = "Guía de uso";
    tools.append(mode, help);
    document.body.append(tools);

    document.addEventListener("change", (event) => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.type === "file") {
        void validateSelectedFiles(input);
      }
    }, true);

    const loading = document.querySelector("#azento-cms-loading");
    const root = document.querySelector("#nc-root");
    const reveal = () => {
      if (root?.childElementCount) loading?.setAttribute("hidden", "");
    };
    reveal();
    if (root) new MutationObserver(reveal).observe(root, { childList: true, subtree: true });
    window.setTimeout(() => loading?.setAttribute("hidden", ""), 8000);
  };

  const ensureSlugs = (items) =>
    items.map((item) =>
      item.get("slug")
        ? item
        : item.set("slug", slugify(item.get("title")))
    );

  CMS.registerEventListener({
    name: "preSave",
    handler: ({ entry }) => {
      const collection = entry.get("collection");
      if (!["general", "madera", "reformas"].includes(collection)) return;

      const slug = entry.get("slug");
      let data = entry.get("data");
      validateImages(data.toJS());

      if (["pagina_madera", "pagina_reformas"].includes(slug)) {
        data = data.update("units", (units) =>
          units.map((unit) =>
            unit
              .update("services", ensureSlugs)
              .update("projects", ensureSlugs)
          )
        );
      }

      if (["servicios_madera", "servicios_reformas"].includes(slug)) {
        data = data.update("services", ensureSlugs);
      }

      return data;
    },
  });

  CMS.registerEventListener({
    name: "prePublish",
    handler: () => {
      showToast(
        "Cambio enviado. Solo aparecerá en la web cuando un administrador lo revise y apruebe."
      );
    },
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installInterfaceHelpers, { once: true });
  } else {
    installInterfaceHelpers();
  }
})();
