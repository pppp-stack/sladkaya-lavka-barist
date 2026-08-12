import { useContent } from "../content/ContentProvider";

function telHref(phone: string) {
  if (phone.includes("@")) return `mailto:${phone}`;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function ContactsSection() {
  const { content } = useContent();
  const { brand, contacts } = content;

  return (
    <section className="section section-contacts" id="contacts">
      <div className="container">
        <div className="catalog-crumbs">
          <a href="/#top">Главная</a>
          <span>/</span>
          <span>{contacts.title}</span>
        </div>
        <h2 className="contacts-title">{contacts.title}</h2>

        <div className="contact-top-grid">
          <article className="contact-outline-card">
            <h3>{contacts.coopTitle}</h3>
            <a href={telHref(brand.phone)}>{brand.phone}</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </article>
          <article className="contact-outline-card">
            <h3>{contacts.socialTitle}</h3>
            <div className="contact-icons">
              {contacts.socials.map((s) => (
                <a key={s} href="#" aria-label={s}>
                  {s}
                </a>
              ))}
            </div>
          </article>
          <article className="contact-outline-card">
            <h3>{contacts.messengerTitle}</h3>
            <div className="contact-icons">
              {contacts.messengers.map((m) => (
                <a key={m} href="#" aria-label={m}>
                  {m}
                </a>
              ))}
            </div>
          </article>
        </div>

        <div className="contact-address-grid">
          {contacts.addresses.map((item) => (
            <article className="contact-dark-card" key={item.address}>
              <div>
                <span className="label">Адрес</span>
                <strong>{item.address}</strong>
              </div>
              <div>
                <span className="label">Способы связи</span>
                <div className="contact-phones">
                  {item.phones.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="label">Ежедневно с</span>
                <strong>{item.hours}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="contact-map-head">
          <h3>{contacts.mapTitle}</h3>
          <a className="pill pill-outline" href="/corporate">
            {contacts.reviewLabel}
          </a>
        </div>
        <div className="contact-map">
          <iframe
            title="Карта — Шуваловский парк, 1Г"
            src="https://yandex.ru/map-widget/v1/?ll=30.2338%2C60.0435&z=16&pt=30.2338%2C60.0435%2Cpm2rdm&l=map&lang=ru_RU"
            loading="lazy"
            allowFullScreen
          />
          <div className="contact-map-fallback">{contacts.mapNote}</div>
        </div>
      </div>
    </section>
  );
}
