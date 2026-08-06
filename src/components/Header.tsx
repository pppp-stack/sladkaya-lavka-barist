import { Link, NavLink } from "react-router-dom";
import { useContent } from "../content/ContentProvider";

const links = [
  { to: "/", label: "Главная", end: true },
  { to: "/catalog", label: "Каталог" },
  { to: "/#corporate", label: "Корпоративным", featured: true },
  { to: "/#about", label: "О компании" },
  { to: "/#promo", label: "Акции" },
  { to: "/#contacts", label: "Контакты" },
];

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function Header() {
  const { content } = useContent();
  const { brand, header } = content;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" to="/" aria-label={brand.name}>
          {brand.logoLetter}
        </Link>
        <nav className="nav" aria-label="Основное меню">
          {links.map((item) =>
            item.to.startsWith("/#") ? (
              <a
                key={item.to}
                href={item.to}
                className={item.featured ? "is-featured" : undefined}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [item.featured ? "is-featured" : "", isActive ? "is-active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href={telHref(brand.phone)}>
            {brand.phone}
          </a>
          <a className="pill pill-accent header-cta" href="/#corporate">
            {header.callButtonLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
