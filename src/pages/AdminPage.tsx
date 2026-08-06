import { useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider";
import type { Product } from "../data/products";
import type { SiteAddress, SiteContent, SiteFeature, SitePromoItem } from "../content/types";

type Tab =
  | "hero"
  | "about"
  | "promo"
  | "contacts"
  | "corporate"
  | "products"
  | "settings";

const emptyProduct = (): Product => ({
  id: `p-${Date.now()}`,
  slug: `new-${Date.now()}`,
  name: "Новый набор",
  price: 990,
  weight: "200 г",
  nostalgia: 4,
  composition: "",
  roastNote: "",
  description: "",
  stats: { sweetness: 7, nostalgia: 8, variety: 7, wow: 7 },
  images: ["/images/hero-main.png"],
});

export function AdminPage() {
  const {
    content,
    setContent,
    resetContent,
    exportJson,
    importJson,
    isAdmin,
    login,
    logout,
  } = useContent();
  const [tab, setTab] = useState<Tab>("hero");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    content.products[0]?.id ?? null,
  );

  const editing = useMemo(
    () => content.products.find((p) => p.id === editingId) ?? null,
    [content.products, editingId],
  );

  function flash() {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }

  function save(next: SiteContent) {
    setContent(next);
    flash();
  }

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    save({ ...content, [key]: value });
  }

  function updateProduct(id: string, patchProd: Partial<Product>) {
    const products = content.products.map((p) =>
      p.id === id ? { ...p, ...patchProd } : p,
    );
    save({ ...content, products });
  }

  if (!isAdmin) {
    return (
      <div className="admin-login">
        <form
          className="admin-login-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (!login(password)) setError("Неверный пароль");
            else setError("");
          }}
        >
          <h1>Админ-панель</h1>
          <p>Редактирование контента сайта «Сладкая лавка»</p>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="admin-error">{error}</p>}
          <button className="pill pill-accent" type="submit">
            Войти
          </button>
          <Link to="/">← На сайт</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <strong>Админка</strong>
          <span>{content.brand.name}</span>
        </div>
        {(
          [
            ["hero", "Hero"],
            ["about", "О компании"],
            ["promo", "Акции"],
            ["contacts", "Контакты"],
            ["corporate", "Заявка B2B"],
            ["products", "Товары"],
            ["settings", "Настройки"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "is-active" : ""}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
        <div className="admin-side-actions">
          <Link to="/">Открыть сайт</Link>
          <button type="button" onClick={exportJson}>
            Экспорт JSON
          </button>
          <label className="admin-file">
            Импорт JSON
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await importJson(file);
                flash();
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (confirm("Сбросить весь контент к значениям по умолчанию?")) {
                resetContent();
                flash();
              }
            }}
          >
            Сбросить
          </button>
          <button type="button" onClick={logout}>
            Выйти
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <h1>
            {tab === "hero" && "Hero"}
            {tab === "about" && "О компании"}
            {tab === "promo" && "Акции"}
            {tab === "contacts" && "Контакты"}
            {tab === "corporate" && "Заявка B2B"}
            {tab === "products" && "Товары"}
            {tab === "settings" && "Настройки"}
          </h1>
          {savedFlash && <span className="admin-saved">Сохранено</span>}
        </header>

        {tab === "settings" && (
          <div className="admin-grid">
            <Field
              label="Название бренда"
              value={content.brand.name}
              onChange={(v) =>
                patch("brand", { ...content.brand, name: v })
              }
            />
            <Field
              label="Буква логотипа"
              value={content.brand.logoLetter}
              onChange={(v) =>
                patch("brand", { ...content.brand, logoLetter: v.slice(0, 1) })
              }
            />
            <Field
              label="Телефон"
              value={content.brand.phone}
              onChange={(v) =>
                patch("brand", { ...content.brand, phone: v })
              }
            />
            <Field
              label="Email"
              value={content.brand.email}
              onChange={(v) =>
                patch("brand", { ...content.brand, email: v })
              }
            />
            <Field
              label="Текст кнопки звонка"
              value={content.header.callButtonLabel}
              onChange={(v) =>
                patch("header", { ...content.header, callButtonLabel: v })
              }
            />
          </div>
        )}

        {tab === "hero" && (
          <div className="admin-grid">
            <Field label="Kicker" value={content.hero.kicker} onChange={(v) => patch("hero", { ...content.hero, kicker: v })} />
            <Field label="Заголовок" value={content.hero.title} onChange={(v) => patch("hero", { ...content.hero, title: v })} />
            <Field label="Подзаголовок слева" value={content.hero.subLeft} onChange={(v) => patch("hero", { ...content.hero, subLeft: v })} />
            <Field label="Подзаголовок справа" value={content.hero.subRight} onChange={(v) => patch("hero", { ...content.hero, subRight: v })} />
            <Area label="Текст в рамке" value={content.hero.cardText} onChange={(v) => patch("hero", { ...content.hero, cardText: v })} />
            <Field label="Кнопка CTA" value={content.hero.ctaLabel} onChange={(v) => patch("hero", { ...content.hero, ctaLabel: v })} />
            <Field label="Главное изображение (URL)" value={content.hero.mainImage} onChange={(v) => patch("hero", { ...content.hero, mainImage: v })} />
            <Field label="Фото справа (URL)" value={content.hero.sideImage} onChange={(v) => patch("hero", { ...content.hero, sideImage: v })} />
            <Field label="Бейдж" value={content.hero.badge} onChange={(v) => patch("hero", { ...content.hero, badge: v })} />
            <Field label="Плитка 1" value={content.hero.tileCatalog} onChange={(v) => patch("hero", { ...content.hero, tileCatalog: v })} />
            <Field label="Плитка 2" value={content.hero.tilePromo} onChange={(v) => patch("hero", { ...content.hero, tilePromo: v })} />
            <FeaturesEditor
              features={content.hero.features}
              onChange={(features) => patch("hero", { ...content.hero, features })}
            />
          </div>
        )}

        {tab === "about" && (
          <div className="admin-grid">
            <Field label="Eyebrow" value={content.about.eyebrow} onChange={(v) => patch("about", { ...content.about, eyebrow: v })} />
            <Field label="Заголовок" value={content.about.title} onChange={(v) => patch("about", { ...content.about, title: v })} />
            <Field label="Картинка (URL)" value={content.about.mediaImage} onChange={(v) => patch("about", { ...content.about, mediaImage: v })} />
            <Area
              label="Вкладки (по строке)"
              value={content.about.tabs.join("\n")}
              onChange={(v) =>
                patch("about", {
                  ...content.about,
                  tabs: v.split("\n").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Area
              label="Отзыв (обычный)"
              value={content.about.reviews.find((r) => r.tab === "default")?.text ?? ""}
              onChange={(v) => {
                const reviews = [...content.about.reviews];
                const i = reviews.findIndex((r) => r.tab === "default");
                if (i >= 0) reviews[i] = { ...reviews[i], text: v };
                else reviews.push({ tab: "default", text: v, author: "Гость" });
                patch("about", { ...content.about, reviews });
              }}
            />
            <Field
              label="Автор обычного отзыва"
              value={content.about.reviews.find((r) => r.tab === "default")?.author ?? ""}
              onChange={(v) => {
                const reviews = content.about.reviews.map((r) =>
                  r.tab === "default" ? { ...r, author: v } : r,
                );
                patch("about", { ...content.about, reviews });
              }}
            />
            <Area
              label="Отзыв (корпоративный)"
              value={
                content.about.reviews.find((r) => r.tab === "Корпоративные заказы")
                  ?.text ?? ""
              }
              onChange={(v) => {
                const reviews = [...content.about.reviews];
                const i = reviews.findIndex((r) => r.tab === "Корпоративные заказы");
                if (i >= 0) reviews[i] = { ...reviews[i], text: v };
                else
                  reviews.push({
                    tab: "Корпоративные заказы",
                    text: v,
                    author: "Клиент",
                  });
                patch("about", { ...content.about, reviews });
              }}
            />
          </div>
        )}

        {tab === "promo" && (
          <div className="admin-grid">
            <Field label="Eyebrow" value={content.promo.eyebrow} onChange={(v) => patch("promo", { ...content.promo, eyebrow: v })} />
            <Field label="Заголовок" value={content.promo.title} onChange={(v) => patch("promo", { ...content.promo, title: v })} />
            <Field label="Главный заголовок акции" value={content.promo.mainTitle} onChange={(v) => patch("promo", { ...content.promo, mainTitle: v })} />
            <Area label="Текст акции" value={content.promo.mainText} onChange={(v) => patch("promo", { ...content.promo, mainText: v })} />
            <Field label="Картинка акции (URL)" value={content.promo.mainImage} onChange={(v) => patch("promo", { ...content.promo, mainImage: v })} />
            <PromoItemsEditor
              items={content.promo.items}
              onChange={(items) => patch("promo", { ...content.promo, items })}
            />
          </div>
        )}

        {tab === "contacts" && (
          <div className="admin-grid">
            <Field label="Заголовок" value={content.contacts.title} onChange={(v) => patch("contacts", { ...content.contacts, title: v })} />
            <Field label="Блок сотрудничества" value={content.contacts.coopTitle} onChange={(v) => patch("contacts", { ...content.contacts, coopTitle: v })} />
            <Field label="Заголовок соцсетей" value={content.contacts.socialTitle} onChange={(v) => patch("contacts", { ...content.contacts, socialTitle: v })} />
            <Field label="Заголовок мессенджеров" value={content.contacts.messengerTitle} onChange={(v) => patch("contacts", { ...content.contacts, messengerTitle: v })} />
            <Field label="Соцсети (через запятую)" value={content.contacts.socials.join(", ")} onChange={(v) => patch("contacts", { ...content.contacts, socials: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <Field label="Мессенджеры (через запятую)" value={content.contacts.messengers.join(", ")} onChange={(v) => patch("contacts", { ...content.contacts, messengers: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <Field label="Заголовок карты" value={content.contacts.mapTitle} onChange={(v) => patch("contacts", { ...content.contacts, mapTitle: v })} />
            <Field label="Подпись на карте" value={content.contacts.mapNote} onChange={(v) => patch("contacts", { ...content.contacts, mapNote: v })} />
            <Field label="Кнопка отзыва" value={content.contacts.reviewLabel} onChange={(v) => patch("contacts", { ...content.contacts, reviewLabel: v })} />
            <AddressesEditor
              addresses={content.contacts.addresses}
              onChange={(addresses) =>
                patch("contacts", { ...content.contacts, addresses })
              }
            />
          </div>
        )}

        {tab === "corporate" && (
          <div className="admin-grid">
            <Field label="Eyebrow" value={content.corporate.eyebrow} onChange={(v) => patch("corporate", { ...content.corporate, eyebrow: v })} />
            <Field label="Заголовок" value={content.corporate.title} onChange={(v) => patch("corporate", { ...content.corporate, title: v })} />
            <Field label="Заголовок формы" value={content.corporate.formTitle} onChange={(v) => patch("corporate", { ...content.corporate, formTitle: v })} />
            <Area label="Подсказка формы" value={content.corporate.formHint} onChange={(v) => patch("corporate", { ...content.corporate, formHint: v })} />
          </div>
        )}

        {tab === "products" && (
          <div className="admin-products">
            <div className="admin-product-list">
              <button
                type="button"
                className="pill pill-accent"
                onClick={() => {
                  const p = emptyProduct();
                  const products = [...content.products, p];
                  save({ ...content, products });
                  setEditingId(p.id);
                }}
              >
                + Добавить товар
              </button>
              {content.products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={editingId === p.id ? "is-active" : ""}
                  onClick={() => setEditingId(p.id)}
                >
                  <strong>{p.name}</strong>
                  <span>{p.price} ₽</span>
                </button>
              ))}
              <div className="admin-popular">
                <h3>Популярные на главной</h3>
                {content.products.map((p) => {
                  const on = content.popularIds.includes(p.id);
                  return (
                    <label key={p.id}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => {
                          const popularIds = on
                            ? content.popularIds.filter((id) => id !== p.id)
                            : [...content.popularIds, p.id];
                          patch("popularIds", popularIds);
                        }}
                      />
                      {p.name}
                    </label>
                  );
                })}
              </div>
            </div>

            {editing && (
              <div className="admin-product-edit admin-grid">
                <Field
                  label="Название"
                  value={editing.name}
                  onChange={(v) => updateProduct(editing.id, { name: v })}
                />
                <Field
                  label="Slug"
                  value={editing.slug}
                  onChange={(v) => updateProduct(editing.id, { slug: v })}
                />
                <Field
                  label="Цена"
                  value={String(editing.price)}
                  onChange={(v) =>
                    updateProduct(editing.id, { price: Number(v) || 0 })
                  }
                />
                <Field
                  label="Вес / объём"
                  value={editing.weight}
                  onChange={(v) => updateProduct(editing.id, { weight: v })}
                />
                <Field
                  label="Ностальгия (1-5)"
                  value={String(editing.nostalgia)}
                  onChange={(v) =>
                    updateProduct(editing.id, {
                      nostalgia: Math.min(5, Math.max(1, Number(v) || 1)),
                    })
                  }
                />
                <Field
                  label="Сладость"
                  value={String(editing.stats.sweetness)}
                  onChange={(v) =>
                    updateProduct(editing.id, {
                      stats: { ...editing.stats, sweetness: Number(v) || 0 },
                    })
                  }
                />
                <Field
                  label="Ностальгия (балл)"
                  value={String(editing.stats.nostalgia)}
                  onChange={(v) =>
                    updateProduct(editing.id, {
                      stats: { ...editing.stats, nostalgia: Number(v) || 0 },
                    })
                  }
                />
                <Field
                  label="Разнообразие"
                  value={String(editing.stats.variety)}
                  onChange={(v) =>
                    updateProduct(editing.id, {
                      stats: { ...editing.stats, variety: Number(v) || 0 },
                    })
                  }
                />
                <Field
                  label="WOW"
                  value={String(editing.stats.wow)}
                  onChange={(v) =>
                    updateProduct(editing.id, {
                      stats: { ...editing.stats, wow: Number(v) || 0 },
                    })
                  }
                />
                <Area
                  label="Состав"
                  value={editing.composition}
                  onChange={(v) => updateProduct(editing.id, { composition: v })}
                />
                <Field
                  label="Формат"
                  value={editing.roastNote}
                  onChange={(v) => updateProduct(editing.id, { roastNote: v })}
                />
                <Area
                  label="Описание"
                  value={editing.description}
                  onChange={(v) => updateProduct(editing.id, { description: v })}
                />
                <Area
                  label="Изображения (URL по строке)"
                  value={editing.images.join("\n")}
                  onChange={(v) =>
                    updateProduct(editing.id, {
                      images: v
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <button
                  type="button"
                  className="pill"
                  onClick={() => {
                    if (!confirm(`Удалить «${editing.name}»?`)) return;
                    const products = content.products.filter(
                      (p) => p.id !== editing.id,
                    );
                    save({
                      ...content,
                      products,
                      popularIds: content.popularIds.filter(
                        (id) => id !== editing.id,
                      ),
                    });
                    setEditingId(products[0]?.id ?? null);
                  }}
                >
                  Удалить товар
                </button>
              </div>
            )}
          </div>
            )}
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="admin-field admin-field-wide">
      <span>{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />
    </label>
  );
}

function FeaturesEditor({
  features,
  onChange,
}: {
  features: SiteFeature[];
  onChange: (v: SiteFeature[]) => void;
}) {
  return (
    <div className="admin-field-wide">
      <h3>Преимущества</h3>
      {features.map((f, i) => (
        <div className="admin-mini-card" key={i}>
          <Field
            label="Заголовок"
            value={f.title}
            onChange={(v) => {
              const next = [...features];
              next[i] = { ...next[i], title: v };
              onChange(next);
            }}
          />
          <Area
            label="Текст"
            value={f.text}
            onChange={(v) => {
              const next = [...features];
              next[i] = { ...next[i], text: v };
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function PromoItemsEditor({
  items,
  onChange,
}: {
  items: SitePromoItem[];
  onChange: (v: SitePromoItem[]) => void;
}) {
  return (
    <div className="admin-field-wide">
      <h3>Карточки акций</h3>
      {items.map((item, i) => (
        <div className="admin-mini-card" key={i}>
          <Field
            label="Заголовок"
            value={item.title}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...next[i], title: v };
              onChange(next);
            }}
          />
          <Area
            label="Текст"
            value={item.text}
            onChange={(v) => {
              const next = [...items];
              next[i] = { ...next[i], text: v };
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function AddressesEditor({
  addresses,
  onChange,
}: {
  addresses: SiteAddress[];
  onChange: (v: SiteAddress[]) => void;
}) {
  return (
    <div className="admin-field-wide">
      <h3>Адреса / карточки</h3>
      {addresses.map((a, i) => (
        <div className="admin-mini-card" key={i}>
          <Field
            label="Адрес"
            value={a.address}
            onChange={(v) => {
              const next = [...addresses];
              next[i] = { ...next[i], address: v };
              onChange(next);
            }}
          />
          <Field
            label="Телефоны / контакты (через | )"
            value={a.phones.join(" | ")}
            onChange={(v) => {
              const next = [...addresses];
              next[i] = {
                ...next[i],
                phones: v.split("|").map((s) => s.trim()).filter(Boolean),
              };
              onChange(next);
            }}
          />
          <Field
            label="Часы"
            value={a.hours}
            onChange={(v) => {
              const next = [...addresses];
              next[i] = { ...next[i], hours: v };
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}
