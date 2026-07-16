(function () {
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

  const ensureSlugs = (items) =>
    items.map((item) =>
      item.get("slug")
        ? item
        : item.set("slug", slugify(item.get("title")))
    );

  CMS.registerEventListener({
    name: "preSave",
    handler: ({ entry }) => {
      if (entry.get("collection") !== "contenido") return;

      const slug = entry.get("slug");
      let data = entry.get("data");
      validateImages(data.toJS());

      if (slug === "divisiones") {
        data = data.update("units", (units) =>
          units.map((unit) =>
            unit
              .update("services", ensureSlugs)
              .update("projects", ensureSlugs)
          )
        );
      }

      if (slug === "servicios_detallados") {
        data = data.update("services", ensureSlugs);
      }

      return data;
    },
  });

  CMS.registerEventListener({
    name: "prePublish",
    handler: () => {
      window.alert(
        "Este contenido no se publicará directamente. Se enviará a revisión y solo aparecerá en la web cuando un administrador apruebe el cambio."
      );
    },
  });
})();
