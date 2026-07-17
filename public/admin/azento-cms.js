(function () {
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
  const MAX_IMAGE_DIMENSION = 8000;
  const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
  const IMAGE_ORDER = ["src", "alt", "caption"];
  const LEGAL_ORDER = ["cif", "registry"];
  const SEO_ORDER = ["title", "description"];
  const DEFAULT_SEO_ORDER = ["title", "description", "image", "imageAlt"];
  const NAVIGATION_ORDER = [
    "servicesLabel",
    "projectsLabel",
    "processLabel",
    "contactLabel",
    "backHomeLabel",
    "quoteLabel",
    "openMenuLabel",
    "closeMenuLabel",
  ];
  const SITE_SETTINGS_ORDER = [
    "companyName",
    "legalName",
    "siteUrl",
    "logo",
    "lightLogo",
    "phoneDisplay",
    "phoneHref",
    "email",
    "location",
    "address",
    "whatsapp",
    "instagram",
    "hours",
    "footerTagline",
    "legal",
    "defaultSeo",
  ];
  const HOME_COPY_ORDER = [
    "logoAriaSuffix",
    "discoverAriaPrefix",
    "contactPhoneLabel",
    "contactEmailLabel",
    "contactInstagramLabel",
    "contactLocationLabel",
    "legalNavLabel",
  ];
  const BUSINESS_COPY_ORDER = [
    "heroQuoteLabel",
    "heroProjectsLabel",
    "servicesEmptyText",
    "projectsEmptyText",
    "serviceMoreInfoAriaPrefix",
    "galleryOpenImageAriaPrefix",
    "galleryCloseImageAriaLabel",
    "galleryPreviousImageAriaLabel",
    "galleryNextImageAriaLabel",
    "processEyebrow",
    "ctaEyebrow",
    "ctaTitle",
  ];
  const CONTACT_COPY_ORDER = [
    "phoneLabel",
    "emailLabel",
    "instagramLabel",
    "locationLabel",
    "formTitle",
    "requiredHint",
    "honeypotLabel",
    "nameLabel",
    "namePlaceholder",
    "emailLabelField",
    "emailPlaceholder",
    "phoneLabelField",
    "phonePlaceholder",
    "serviceLabel",
    "servicePlaceholder",
    "messageLabel",
    "messagePlaceholder",
    "privacyPrefix",
    "privacyLinkLabel",
    "privacySuffix",
    "submitLabel",
    "submittingLabel",
    "successTitle",
    "successMessage",
    "errorTitle",
    "fallbackError",
    "localPhpError",
    "unavailableError",
  ];
  const FOOTER_COPY_ORDER = [
    "divisionHeading",
    "areasHeading",
    "legalHeading",
    "chooseAreaLabel",
    "privacyLabel",
    "legalNoticeLabel",
    "cookiesLabel",
    "cookieSettingsLabel",
    "rightsLabel",
    "backToTopLabel",
    "instagramAriaSuffix",
    "areaSelectionAriaSuffix",
  ];
  const COOKIES_COPY_ORDER = [
    "bannerTitle",
    "bannerDescription",
    "moreInfoLabel",
    "settingsLabel",
    "rejectLabel",
    "acceptAllLabel",
    "modalTitle",
    "modalCloseLabel",
    "necessaryTitle",
    "necessaryDescription",
    "necessaryBadge",
    "analyticsTitle",
    "analyticsDescription",
    "savePreferencesLabel",
  ];
  const SERVICE_DETAIL_COPY_ORDER = [
    "homeBreadcrumbLabel",
    "servicesBreadcrumbLabel",
    "heroEyebrow",
    "includedTitle",
    "interestTitle",
    "interestDescription",
    "directContactTitle",
    "galleryEyebrow",
    "galleryTitle",
    "faqEyebrow",
    "faqTitle",
    "backToServicesLabel",
    "quoteLabel",
  ];
  const LEGAL_COPY_ORDER = [
    "updatedPrefix",
    "backHomeLabel",
    "contactEmailLabel",
    "contactPhoneLabel",
    "cookieConfigButtonLabel",
  ];
  const SITE_COPY_ORDER = [
    "navigation",
    "home",
    "businessPage",
    "contact",
    "footer",
    "cookies",
    "serviceDetail",
    "legal",
  ];
  const LEGAL_PAGES_ORDER = ["legalNotice", "privacyPolicy", "cookiePolicy"];
  const LEGAL_PAGE_ORDER = ["seoTitle", "seoDescription", "title", "updatedDate", "actionButtonLabel", "sections"];
  const LEGAL_SECTION_ORDER = ["heading", "level", "paragraphs", "list"];
  const LEGAL_LIST_ITEM_ORDER = ["label", "text", "href"];
  const HOME_ORDER = [
    "published",
    "seoTitle",
    "seoDescription",
    "seoImage",
    "eyebrow",
    "title",
    "intro",
    "cardEyebrow",
    "cardCtaPrefix",
    "contactEyebrow",
    "contactTitle",
  ];
  const BUSINESS_PAGE_ORDER = [
    "name",
    "shortName",
    "selectorDescription",
    "selectorImage",
    "selectorAlt",
    "heroEyebrow",
    "heroTitle",
    "heroDescription",
    "heroImage",
    "heroAlt",
    "seoTitle",
    "seoDescription",
    "servicesTitle",
    "servicesDescription",
    "services",
    "projectsTitle",
    "projectsDescription",
    "projects",
    "processTitle",
    "processDescription",
    "process",
    "trustTitle",
    "trust",
    "formTitle",
    "formDescription",
    "formServices",
  ];
  const SERVICE_CARD_ORDER = ["slug", "title", "description", "href", "visible"];
  const PROJECT_ORDER = [
    "slug",
    "title",
    "category",
    "image",
    "alt",
    "objectPosition",
    "caption",
    "visible",
    "featured",
  ];
  const TEXT_BLOCK_ORDER = ["title", "description"];
  const FORM_SERVICE_ORDER = ["value", "label"];
  const DETAILED_SERVICES_ORDER = ["services"];
  const DETAILED_SERVICE_ORDER = [
    "slug",
    "published",
    "icon",
    "title",
    "shortDescription",
    "longDescription",
    "features",
    "bullets",
    "gallery",
    "cta",
    "faq",
    "seo",
  ];
  const CTA_ORDER = ["primaryText", "primaryHref", "secondaryText", "secondaryHref"];
  const FAQ_ORDER = ["question", "answer", "visible"];
  const SITE_SETTINGS_TRIM_FIELDS = [
    "companyName",
    "legalName",
    "siteUrl",
    "phoneDisplay",
    "phoneHref",
    "email",
    "location",
    "address",
    "whatsapp",
    "hours",
    "footerTagline",
  ];
  const NAVIGATION_TRIM_FIELDS = NAVIGATION_ORDER;

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

  const ensureSlugs = (items) => {
    if (!items || typeof items.map !== "function") return items;
    return items.map((item) =>
      item.get("slug")
        ? item
        : item.set("slug", slugify(item.get("title")))
    );
  };

  const updateIfPresent = (data, field, transform) => {
    if (!data || typeof data.has !== "function" || typeof data.update !== "function") return data;
    return data.has(field) ? data.update(field, transform) : data;
  };

  const orderFields = (data, order) => {
    if (!data || typeof data.sortBy !== "function") return data;
    const positions = new Map(order.map((field, index) => [field, index]));
    return data.sortBy((_, key) =>
      positions.has(key) ? positions.get(key) : Number.MAX_SAFE_INTEGER
    );
  };

  const orderListItems = (items, order) => {
    if (!items || typeof items.map !== "function") return items;
    return items.map((item) => orderFields(item, order));
  };

  const trimStringFields = (data, fields) =>
    fields.reduce((nextData, field) => {
      const value = nextData.get(field);
      return typeof value === "string" ? nextData.set(field, value.trim()) : nextData;
    }, data);

  const normalizeSiteSettings = (data) => {
    data = trimStringFields(data, SITE_SETTINGS_TRIM_FIELDS);
    data = updateIfPresent(data, "logo", (logo) => orderFields(logo, IMAGE_ORDER));
    data = updateIfPresent(data, "lightLogo", (logo) => orderFields(logo, IMAGE_ORDER));
    data = updateIfPresent(data, "legal", (legal) => orderFields(legal, LEGAL_ORDER));
    data = updateIfPresent(data, "defaultSeo", (seo) => orderFields(seo, DEFAULT_SEO_ORDER));
    return orderFields(data, SITE_SETTINGS_ORDER);
  };

  const normalizeSiteCopy = (data) => {
    data = updateIfPresent(data, "navigation", (navigation) =>
      orderFields(trimStringFields(navigation, NAVIGATION_TRIM_FIELDS), NAVIGATION_ORDER)
    );
    data = updateIfPresent(data, "home", (copy) => orderFields(copy, HOME_COPY_ORDER));
    data = updateIfPresent(data, "businessPage", (copy) => orderFields(copy, BUSINESS_COPY_ORDER));
    data = updateIfPresent(data, "contact", (copy) => orderFields(copy, CONTACT_COPY_ORDER));
    data = updateIfPresent(data, "footer", (copy) => orderFields(copy, FOOTER_COPY_ORDER));
    data = updateIfPresent(data, "cookies", (copy) => orderFields(copy, COOKIES_COPY_ORDER));
    data = updateIfPresent(data, "serviceDetail", (copy) => orderFields(copy, SERVICE_DETAIL_COPY_ORDER));
    data = updateIfPresent(data, "legal", (copy) => orderFields(copy, LEGAL_COPY_ORDER));
    return orderFields(data, SITE_COPY_ORDER);
  };

  const normalizeBusinessPage = (data) => {
    data = updateIfPresent(data, "services", (items) => orderListItems(ensureSlugs(items), SERVICE_CARD_ORDER));
    data = updateIfPresent(data, "projects", (items) => orderListItems(ensureSlugs(items), PROJECT_ORDER));
    data = updateIfPresent(data, "process", (items) => orderListItems(items, TEXT_BLOCK_ORDER));
    data = updateIfPresent(data, "trust", (items) => orderListItems(items, TEXT_BLOCK_ORDER));
    data = updateIfPresent(data, "formServices", (items) => orderListItems(items, FORM_SERVICE_ORDER));
    return orderFields(data, BUSINESS_PAGE_ORDER);
  };

  const normalizeDetailedService = (service) => {
    service = updateIfPresent(service, "gallery", (items) => orderListItems(items, IMAGE_ORDER));
    service = updateIfPresent(service, "cta", (cta) => orderFields(cta, CTA_ORDER));
    service = updateIfPresent(service, "faq", (items) => orderListItems(items, FAQ_ORDER));
    service = updateIfPresent(service, "seo", (seo) => orderFields(seo, SEO_ORDER));
    return orderFields(service, DETAILED_SERVICE_ORDER);
  };

  const normalizeDetailedServices = (data) => {
    data = updateIfPresent(data, "services", (items) => {
      const withSlugs = ensureSlugs(items);
      if (!withSlugs || typeof withSlugs.map !== "function") return withSlugs;
      return withSlugs.map(normalizeDetailedService);
    });
    return orderFields(data, DETAILED_SERVICES_ORDER);
  };

  const normalizeLegalPage = (page) => {
    page = updateIfPresent(page, "sections", (sections) => {
      if (!sections || typeof sections.map !== "function") return sections;
      return sections.map((section) => {
        section = updateIfPresent(section, "list", (items) => orderListItems(items, LEGAL_LIST_ITEM_ORDER));
        return orderFields(section, LEGAL_SECTION_ORDER);
      });
    });
    return orderFields(page, LEGAL_PAGE_ORDER);
  };

  const normalizeLegalPages = (data) => {
    for (const pageKey of LEGAL_PAGES_ORDER) {
      data = updateIfPresent(data, pageKey, normalizeLegalPage);
    }
    return orderFields(data, LEGAL_PAGES_ORDER);
  };

  CMS.registerEventListener({
    name: "preSave",
    handler: ({ entry }) => {
      const collection = entry.get("collection");
      if (!["general", "madera", "reformas"].includes(collection)) return;

      const slug = entry.get("slug");
      let data = entry.get("data");
      validateImages(data.toJS());

      if (slug === "configuracion") {
        data = normalizeSiteSettings(data);
      }

      if (slug === "textos_globales") {
        data = normalizeSiteCopy(data);
      }

      if (slug === "textos_legales") {
        data = normalizeLegalPages(data);
      }

      if (slug === "inicio") {
        data = orderFields(data, HOME_ORDER);
      }

      if (["pagina_madera", "pagina_reformas"].includes(slug)) {
        data = normalizeBusinessPage(data);
      }

      if (["servicios_madera", "servicios_reformas"].includes(slug)) {
        data = normalizeDetailedServices(data);
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
