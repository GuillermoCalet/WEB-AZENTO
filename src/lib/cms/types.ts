export type BusinessUnitId = "madera_tecnologica" | "reformas";
export type BusinessTone = "wood" | "reform";

export interface ManagedImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface SeoFields {
  title: string;
  description: string;
}

export interface BusinessService {
  slug: string;
  title: string;
  description: string;
  href?: string;
  visible: boolean;
}

export interface BusinessProject {
  slug: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
  visible: boolean;
  featured: boolean;
}

export interface FormService {
  value: string;
  label: string;
}

export interface BusinessUnitConfig {
  id: BusinessUnitId;
  name: string;
  shortName: string;
  slug: string;
  tone: BusinessTone;
  published: boolean;
  selectorDescription: string;
  selectorImage: string;
  selectorAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroAlt: string;
  seoTitle: string;
  seoDescription: string;
  servicesTitle: string;
  servicesDescription: string;
  services: BusinessService[];
  projectsTitle: string;
  projectsDescription: string;
  projects: BusinessProject[];
  processTitle: string;
  processDescription: string;
  process: Array<{ title: string; description: string }>;
  trustTitle: string;
  trust: Array<{ title: string; description: string }>;
  formTitle: string;
  formDescription: string;
  formServices: FormService[];
}

export interface ServiceFAQ {
  question: string;
  answer: string;
  visible: boolean;
}

export interface ServiceCTA {
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
}

export interface DetailedService {
  slug: string;
  divisionId: BusinessUnitId;
  published: boolean;
  icon: "garden" | "pergola" | "facade" | "interior";
  title: string;
  shortDescription: string;
  longDescription: string[];
  features: string[];
  bullets: string[];
  gallery: ManagedImage[];
  cta: ServiceCTA;
  faq: ServiceFAQ[];
  seo: SeoFields;
}

export interface SiteSettings {
  companyName: string;
  legalName: string;
  siteUrl: string;
  logo: ManagedImage;
  lightLogo: ManagedImage;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  location: string;
  address: string;
  whatsapp?: string;
  instagram: { label: string; url: string };
  hours?: string;
  footerTagline: string;
  legal: { cif: string; registry: string };
  defaultSeo: SeoFields & { image: string; imageAlt: string };
}

export interface HomePage {
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  eyebrow: string;
  title: string;
  intro: string;
  cardEyebrow: string;
  cardCtaPrefix: string;
  contactEyebrow: string;
  contactTitle: string;
}

export interface NavigationCopy {
  servicesLabel: string;
  projectsLabel: string;
  processLabel: string;
  contactLabel: string;
  backHomeLabel: string;
  quoteLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
}

export interface SiteCopy {
  navigation: NavigationCopy;
  home: {
    logoAriaSuffix: string;
    discoverAriaPrefix: string;
    contactPhoneLabel: string;
    contactEmailLabel: string;
    contactInstagramLabel: string;
    contactLocationLabel: string;
    legalNavLabel: string;
  };
  businessPage: {
    heroQuoteLabel: string;
    heroProjectsLabel: string;
    servicesEmptyText: string;
    projectsEmptyText: string;
    serviceMoreInfoAriaPrefix: string;
    galleryOpenImageAriaPrefix: string;
    galleryCloseImageAriaLabel: string;
    galleryPreviousImageAriaLabel: string;
    galleryNextImageAriaLabel: string;
    processEyebrow: string;
    ctaEyebrow: string;
    ctaTitle: string;
  };
  contact: {
    phoneLabel: string;
    emailLabel: string;
    instagramLabel: string;
    locationLabel: string;
    formTitle: string;
    requiredHint: string;
    honeypotLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabelField: string;
    emailPlaceholder: string;
    phoneLabelField: string;
    phonePlaceholder: string;
    serviceLabel: string;
    servicePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    privacyPrefix: string;
    privacyLinkLabel: string;
    privacySuffix: string;
    submitLabel: string;
    submittingLabel: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    fallbackError: string;
    localPhpError: string;
    unavailableError: string;
  };
  footer: {
    divisionHeading: string;
    areasHeading: string;
    legalHeading: string;
    chooseAreaLabel: string;
    privacyLabel: string;
    legalNoticeLabel: string;
    cookiesLabel: string;
    cookieSettingsLabel: string;
    rightsLabel: string;
    backToTopLabel: string;
    instagramAriaSuffix: string;
    areaSelectionAriaSuffix: string;
  };
  cookies: {
    bannerTitle: string;
    bannerDescription: string;
    moreInfoLabel: string;
    settingsLabel: string;
    rejectLabel: string;
    acceptAllLabel: string;
    modalTitle: string;
    modalCloseLabel: string;
    necessaryTitle: string;
    necessaryDescription: string;
    necessaryBadge: string;
    analyticsTitle: string;
    analyticsDescription: string;
    savePreferencesLabel: string;
  };
  serviceDetail: {
    homeBreadcrumbLabel: string;
    servicesBreadcrumbLabel: string;
    heroEyebrow: string;
    includedTitle: string;
    interestTitle: string;
    interestDescription: string;
    directContactTitle: string;
    galleryEyebrow: string;
    galleryTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    backToServicesLabel: string;
    quoteLabel: string;
  };
  legal: {
    updatedPrefix: string;
    backHomeLabel: string;
    contactEmailLabel: string;
    contactPhoneLabel: string;
    cookieConfigButtonLabel: string;
  };
}

export interface LegalListItem {
  label?: string;
  text: string;
  href?: string;
}

export interface LegalSection {
  heading: string;
  level?: "h2" | "h3";
  paragraphs: string[];
  list: LegalListItem[];
}

export interface LegalPageContent {
  seoTitle: string;
  seoDescription: string;
  title: string;
  updatedDate: string;
  actionButtonLabel?: string;
  sections: LegalSection[];
}

export interface LegalPages {
  legalNotice: LegalPageContent;
  privacyPolicy: LegalPageContent;
  cookiePolicy: LegalPageContent;
}
