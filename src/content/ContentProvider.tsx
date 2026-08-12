import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultContent } from "./defaults";
import {
  ADMIN_PASSWORD,
  ADMIN_SESSION_KEY,
  STORAGE_KEY,
  type SiteContent,
} from "./types";

type ContentContextValue = {
  content: SiteContent;
  setContent: (next: SiteContent) => void;
  updateContent: (patch: Partial<SiteContent>) => void;
  resetContent: () => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultContent);
    const parsed = JSON.parse(raw) as SiteContent;
    return {
      ...structuredClone(defaultContent),
      ...parsed,
      brand: { ...defaultContent.brand, ...parsed.brand },
      header: { ...defaultContent.header, ...parsed.header },
      hero: {
        ...defaultContent.hero,
        ...parsed.hero,
        features: parsed.hero?.features ?? defaultContent.hero.features,
      },
      about: {
        ...defaultContent.about,
        ...parsed.about,
        tabs: parsed.about?.tabs ?? defaultContent.about.tabs,
        reviews: parsed.about?.reviews ?? defaultContent.about.reviews,
        mediaImageBottom:
          parsed.about?.mediaImageBottom ??
          defaultContent.about.mediaImageBottom,
      },
      promo: {
        ...defaultContent.promo,
        ...parsed.promo,
        items: (() => {
          const items = parsed.promo?.items ?? defaultContent.promo.items;
          const hasFree = items.some((i) =>
            i.title.toLowerCase().includes("бесплатная доставка"),
          );
          if (hasFree) return items;
          return [defaultContent.promo.items[0], ...items];
        })(),
      },
      contacts: {
        ...defaultContent.contacts,
        ...parsed.contacts,
        addresses: (() => {
          const addresses =
            parsed.contacts?.addresses ?? defaultContent.contacts.addresses;
          return addresses.map((a, i) => {
            if (
              i === 0 &&
              /самовывоз по согласованию|по согласованию/i.test(a.address)
            ) {
              return defaultContent.contacts.addresses[0];
            }
            if (i === 1 && /сдэк|доставка сдэк/i.test(a.address)) {
              return defaultContent.contacts.addresses[1];
            }
            return a;
          });
        })(),
        socials: parsed.contacts?.socials ?? defaultContent.contacts.socials,
        messengers:
          parsed.contacts?.messengers ?? defaultContent.contacts.messengers,
        mapNote:
          parsed.contacts?.mapNote &&
          !/по договорённости|по всей россии · самовывоз по/i.test(
            parsed.contacts.mapNote,
          )
            ? parsed.contacts.mapNote
            : defaultContent.contacts.mapNote,
      },
      corporate: { ...defaultContent.corporate, ...parsed.corporate },
      products: parsed.products?.length
        ? parsed.products
        : structuredClone(defaultContent.products),
      popularIds: parsed.popularIds?.length
        ? parsed.popularIds
        : [...defaultContent.popularIds],
    };
  } catch {
    return structuredClone(defaultContent);
  }
}

function persist(content: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => loadContent());
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "1",
  );

  const setContent = useCallback((next: SiteContent) => {
    setContentState(next);
    persist(next);
  }, []);

  const updateContent = useCallback((patch: Partial<SiteContent>) => {
    setContentState((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    const next = structuredClone(defaultContent);
    setContentState(next);
    persist(next);
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sladkaya-lavka-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const importJson = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as SiteContent;
    setContent(parsed);
  }, [setContent]);

  const login = useCallback((password: string) => {
    if (password !== ADMIN_PASSWORD) return false;
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    setIsAdmin(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({
      content,
      setContent,
      updateContent,
      resetContent,
      exportJson,
      importJson,
      isAdmin,
      login,
      logout,
    }),
    [
      content,
      setContent,
      updateContent,
      resetContent,
      exportJson,
      importJson,
      isAdmin,
      login,
      logout,
    ],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
