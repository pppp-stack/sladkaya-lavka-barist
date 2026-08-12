import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AboutVideo } from "../components/AboutVideo";
import { BrandLogo } from "../components/BrandLogo";
import { ContactsSection } from "../components/ContactsSection";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Reveal } from "../components/Reveal";
import { useContent } from "../content/ContentProvider";
import type { Product } from "../data/products";

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function HomePage() {
  const { content } = useContent();
  const { brand, hero, about, promo, corporate } = content;
  const popular = content.products.filter((p) =>
    content.popularIds.includes(p.id),
  );

  const [activeTab, setActiveTab] = useState(about.tabs[0] ?? "");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cookieOk, setCookieOk] = useState(
    () => localStorage.getItem("sl-cookie") === "1",
  );
  const [sent, setSent] = useState<string | null>(null);

  const review = useMemo(() => {
    const byTab = about.reviews.find((r) => r.tab === activeTab);
    const fallback = about.reviews.find((r) => r.tab === "default");
    return byTab ?? fallback ?? { text: "", author: "" };
  }, [about.reviews, activeTab]);

  function acceptCookies() {
    localStorage.setItem("sl-cookie", "1");
    setCookieOk(true);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>, kind: string) {
    e.preventDefault();
    setSent(kind);
    e.currentTarget.reset();
  }

  return (
    <>
      <section className="hero" id="top">
        <div className="container hero-grid">
          <div>
            <div className="hero-kicker">{hero.kicker}</div>
            <h1>{hero.title}</h1>
            <div className="hero-sub">
              {hero.subLeft} <span className="dot" /> {hero.subRight}
            </div>
            <div className="hero-card">
              <p>{hero.cardText}</p>
            </div>
            <a className="pill pill-accent" href="#corporate">
              {hero.ctaLabel}
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-frame">
              <img className="main" src={hero.mainImage} alt={hero.title} />
            </div>
            <div className="float-badge">{hero.badge}</div>
          </div>

          <aside className="hero-side">
            <div className="side-top">
              <div className="side-photo">
                <img src={hero.sideImage} alt="" />
              </div>
              <div className="side-links">
                <Link className="side-tile" to="/configurator">
                  <span>{hero.tileCatalog}</span>
                  <i aria-hidden="true">↓</i>
                </Link>
                <a className="side-tile" href="#promo">
                  <span>{hero.tilePromo}</span>
                  <i aria-hidden="true">↓</i>
                </a>
              </div>
            </div>
            <div className="feature-list">
              {hero.features.map((f) => (
                <div className="feature-item" key={f.title}>
                  <div className="mark" />
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <Reveal>
        <section className="section section-catalog" id="popular">
          <div className="container">
            <div className="catalog-head">
              <h2>Популярная продукция</h2>
              <Link className="catalog-link" to="/catalog">
                Перейти в каталог <span>→</span>
              </Link>
            </div>
            <div className="product-grid">
              {popular.map((product, i) => (
                <Reveal key={product.id} delay={i * 80}>
                  <ProductCard product={product} onOpen={setSelected} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section section-light" id="about">
          <div className="container about-container">
            <div className="section-head">
              <div>
                <div className="eyebrow">{about.eyebrow}</div>
                <h2 className="about-title">{about.title}</h2>
              </div>
              <Link className="pill pill-outline" to="/catalog">
                Смотреть наборы
              </Link>
            </div>

            <div className="tabs" role="tablist" aria-label="Категории">
              {about.tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`pill pill-outline${activeTab === tab ? " is-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="about-grid">
              <article className="review-card">
                <div className="brand">Sweet me</div>
                <p>{review.text}</p>
                <div className="author">{review.author}</div>
              </article>
              <div className="media-card media-card-stack">
                <img src={about.mediaImage} alt={about.title} />
                <img
                  src={about.mediaImageBottom}
                  alt="Сборка подарочного набора"
                />
              </div>
              <div className="media-card">
                <AboutVideo />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section
          className="section section-light"
          id="promo"
          style={{ paddingTop: 0 }}
        >
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">{promo.eyebrow}</div>
                <h2>{promo.title}</h2>
              </div>
            </div>
            <div className="promo-grid">
              <article className="promo-main">
                <img src={promo.mainImage} alt={promo.mainTitle} />
                <div className="overlay">
                  <h3>{promo.mainTitle}</h3>
                  <p>{promo.mainText}</p>
                  <a className="pill pill-accent" href="#contacts">
                    Узнать подробности
                  </a>
                </div>
              </article>
              <div className="promo-side">
                {promo.items.map((item) => (
                  <article className="promo-item" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                    <a href="#contacts">Узнать подробности</a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <ContactsSection />
      </Reveal>
      <section className="section section-dark" id="corporate">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>
                {corporate.eyebrow}
              </div>
              <h2>{corporate.title}</h2>
            </div>
          </div>
          <div className="forms-grid forms-grid-single">
            <div className="form-card">
              <h3>{corporate.formTitle}</h3>
              <p className="hint">{corporate.formHint}</p>
              <form onSubmit={(e) => onSubmit(e, "corp")}>
                <input name="name" placeholder="Имя" required />
                <input name="phone" placeholder="Телефон" required />
                <input name="company" placeholder="Компания" />
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Сколько наборов и к какой дате"
                />
                <label className="check">
                  <input type="checkbox" required />
                  <span>
                    я принимаю условия политики обработки персональных данных
                  </span>
                </label>
                <button className="pill pill-accent" type="submit">
                  Отправить заявку
                </button>
                {sent === "corp" && (
                  <p className="hint">Спасибо! Менеджер свяжется с вами.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <BrandLogo name={brand.name} />
                <strong>{brand.name}</strong>
              </div>
              <p>
                Подарочные наборы со сладостями из 90-х для сотрудников, клиентов
                и друзей.
              </p>
            </div>
            <div>
              <h4>Меню</h4>
              <ul>
                <li>
                  <Link to="/">Главная</Link>
                </li>
                <li>
                  <Link to="/catalog">Каталог</Link>
                </li>
                <li>
                  <a href="#contacts">Контакты</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Контакты</h4>
              <ul>
                <li>
                  <a href={telHref(brand.phone)}>{brand.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${brand.email}`}>{brand.email}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {brand.name}
            </span>
            <span>Политика конфиденциальности</span>
          </div>
        </div>
      </footer>

      {!cookieOk && (
        <div className="cookie" role="dialog" aria-label="Cookies">
          <p>
            Мы используем cookies, чтобы сайт работал удобнее. Продолжая, вы
            соглашаетесь с условиями обработки данных.
          </p>
          <button
            className="pill pill-accent"
            type="button"
            onClick={acceptCookies}
          >
            OK
          </button>
        </div>
      )}

      <a className="back-top" href="#top" aria-label="Наверх">
        ↑
      </a>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
