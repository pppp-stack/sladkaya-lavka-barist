import type { Product } from "../data/products";

export type SiteFeature = { title: string; text: string };
export type SitePromoItem = { title: string; text: string };
export type SiteAddress = {
  address: string;
  phones: string[];
  hours: string;
};
export type SiteReview = {
  tab: string;
  text: string;
  author: string;
};

export type SiteContent = {
  brand: {
    name: string;
    phone: string;
    email: string;
    logoLetter: string;
  };
  header: {
    callButtonLabel: string;
  };
  hero: {
    kicker: string;
    title: string;
    subLeft: string;
    subRight: string;
    cardText: string;
    ctaLabel: string;
    mainImage: string;
    sideImage: string;
    badge: string;
    tileCatalog: string;
    tilePromo: string;
    features: SiteFeature[];
  };
  about: {
    eyebrow: string;
    title: string;
    tabs: string[];
    reviews: SiteReview[];
    mediaImage: string;
    mediaImageBottom: string;
  };
  promo: {
    eyebrow: string;
    title: string;
    mainTitle: string;
    mainText: string;
    mainImage: string;
    items: SitePromoItem[];
  };
  contacts: {
    title: string;
    coopTitle: string;
    socialTitle: string;
    messengerTitle: string;
    socials: string[];
    messengers: string[];
    addresses: SiteAddress[];
    mapTitle: string;
    mapNote: string;
    reviewLabel: string;
  };
  corporate: {
    eyebrow: string;
    title: string;
    formTitle: string;
    formHint: string;
  };
  products: Product[];
  popularIds: string[];
};

export const STORAGE_KEY = "sl-barist-site-v1";
export const ADMIN_SESSION_KEY = "sl-barist-admin";
export const ADMIN_PASSWORD = "Admin123!";
