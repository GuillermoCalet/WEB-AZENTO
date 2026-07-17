import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const linkFields = [
  { type: "string", name: "label", label: "Label" },
  { type: "string", name: "href", label: "Link" },
] as any[];

const sectionHeaderFields = [
  { type: "string", name: "tagline", label: "Tagline" },
  { type: "string", name: "headline", label: "Headline" },
  {
    type: "string",
    name: "description",
    label: "Description",
    ui: {
      component: "textarea",
    },
  },
] as any[];

export default defineConfig({
  branch,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        fields: [
          {
            type: "string",
            name: "title",
            label: "SEO Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "SEO Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "badge",
            label: "Hero Badge",
          },
          {
            type: "string",
            name: "headlinePrefix",
            label: "Hero Headline Prefix",
          },
          {
            type: "string",
            name: "headlineAccent",
            label: "Hero Headline Accent",
          },
          {
            type: "string",
            name: "subheadline",
            label: "Hero Subheadline",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "ctaPrimary",
            label: "Primary Button",
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "Link" },
            ],
          },
          {
            type: "object",
            name: "ctaSecondary",
            label: "Secondary Button",
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "Link" },
            ],
          },
          {
            type: "object",
            name: "backgroundImages",
            label: "Background Images",
            list: true,
            fields: [
              { type: "image", name: "image", label: "Image" },
              { type: "string", name: "alt", label: "Alt Text" },
            ],
          },
          {
            type: "object",
            name: "stats",
            label: "Stats",
            list: true,
            fields: [
              { type: "string", name: "value", label: "Value" },
              { type: "string", name: "label", label: "Label" },
            ],
          },
          {
            type: "object",
            name: "navbar",
            label: "Navbar",
            fields: [
              { type: "image", name: "logoImage", label: "Logo" },
              { type: "string", name: "logoAlt", label: "Logo Alt Text" },
              {
                type: "object",
                name: "navLinks",
                label: "Navigation Links",
                list: true,
                fields: linkFields,
              },
              {
                type: "object",
                name: "ctaButton",
                label: "CTA Button",
                fields: linkFields,
              },
            ],
          },
          {
            type: "object",
            name: "servicesSection",
            label: "Services Section",
            fields: [
              ...sectionHeaderFields,
              {
                type: "object",
                name: "items",
                label: "Service Cards",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  {
                    type: "string",
                    name: "shortDescription",
                    label: "Short Description",
                    ui: {
                      component: "textarea",
                    },
                  },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["garden", "pergola", "facade", "interior"],
                  },
                  { type: "string", name: "href", label: "Card Link" },
                  { type: "string", name: "linkLabel", label: "Link Label" },
                  {
                    type: "string",
                    name: "features",
                    label: "Features",
                    list: true,
                  },
                ],
              },
              {
                type: "string",
                name: "ctaText",
                label: "CTA Text",
              },
              {
                type: "object",
                name: "ctaLink",
                label: "CTA Link",
                fields: linkFields,
              },
            ],
          },
          {
            type: "object",
            name: "gallerySection",
            label: "Gallery Section",
            fields: [
              ...sectionHeaderFields,
              {
                type: "object",
                name: "projects",
                label: "Projects",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "category", label: "Category" },
                  { type: "string", name: "location", label: "Location" },
                  { type: "image", name: "image", label: "Image" },
                  {
                    type: "string",
                    name: "size",
                    label: "Grid Size",
                    options: ["large", "medium", "small"],
                  },
                  { type: "string", name: "objectPosition", label: "Object Position" },
                ],
              },
              {
                type: "object",
                name: "ctaLink",
                label: "CTA Link",
                fields: linkFields,
              },
            ],
          },
          {
            type: "object",
            name: "contactSection",
            label: "Contact Section",
            fields: [
              ...sectionHeaderFields,
              {
                type: "object",
                name: "contactInfo",
                label: "Contact Info",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["phone", "email", "instagram", "location"],
                  },
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "value", label: "Value" },
                  { type: "string", name: "href", label: "Link" },
                ],
              },
              { type: "string", name: "formTitle", label: "Form Title" },
              { type: "string", name: "nameLabel", label: "Name Label" },
              { type: "string", name: "namePlaceholder", label: "Name Placeholder" },
              { type: "string", name: "emailLabel", label: "Email Label" },
              { type: "string", name: "emailPlaceholder", label: "Email Placeholder" },
              { type: "string", name: "phoneLabel", label: "Phone Label" },
              { type: "string", name: "phonePlaceholder", label: "Phone Placeholder" },
              { type: "string", name: "serviceLabel", label: "Service Label" },
              { type: "string", name: "servicePlaceholder", label: "Service Placeholder" },
              {
                type: "object",
                name: "serviceOptions",
                label: "Service Options",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "value", label: "Value" },
                ],
              },
              { type: "string", name: "messageLabel", label: "Message Label" },
              { type: "string", name: "messagePlaceholder", label: "Message Placeholder" },
              {
                type: "string",
                name: "consentText",
                label: "Consent Text",
                ui: {
                  component: "textarea",
                },
              },
              { type: "string", name: "submitLabel", label: "Submit Label" },
              { type: "string", name: "submittingLabel", label: "Submitting Label" },
              { type: "string", name: "successTitle", label: "Success Title" },
              { type: "string", name: "successMessage", label: "Success Message" },
              { type: "string", name: "errorTitle", label: "Error Title" },
              { type: "string", name: "errorMessage", label: "Default Error Message" },
              {
                type: "string",
                name: "localErrorMessage",
                label: "Local Error Message",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "privacyNote",
                label: "Privacy Note",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "image", name: "logoImage", label: "Logo" },
              { type: "string", name: "logoAlt", label: "Logo Alt Text" },
              {
                type: "string",
                name: "tagline",
                label: "Tagline",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "social",
                label: "Social Links",
                list: true,
                fields: [
                  { type: "string", name: "name", label: "Name" },
                  { type: "string", name: "href", label: "Link" },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["instagram", "pinterest", "linkedin"],
                  },
                ],
              },
              {
                type: "object",
                name: "navigation",
                label: "Navigation Columns",
                list: true,
                fields: [
                  { type: "string", name: "title", label: "Column Title" },
                  {
                    type: "object",
                    name: "links",
                    label: "Links",
                    list: true,
                    fields: [
                      ...linkFields,
                      { type: "string", name: "id", label: "HTML ID" },
                    ],
                  },
                ],
              },
              { type: "string", name: "copyright", label: "Copyright" },
              { type: "string", name: "backToTopLabel", label: "Back To Top Label" },
            ],
          },
        ],
        ui: {
          router: () => "/",
        },
      },
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "eyebrow",
            label: "Eyebrow",
          },
          {
            type: "string",
            name: "title",
            label: "Headline",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Tagline",
            isBody: true,
          },
          {
            type: "object",
            name: "ctaPrimary",
            label: "Primary button",
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "Link" },
            ],
          },
          {
            type: "object",
            name: "ctaSecondary",
            label: "Secondary button",
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "Link" },
            ],
          },
        ],
        ui: {
          // Opens the /tinacms-demo page for visual editing. Change or remove to fit your site.
          router: () => "/tinacms-demo",
        },
      },
    ],
  },
});
