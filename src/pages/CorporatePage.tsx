import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { useContent } from "../content/ContentProvider";

const services = [
  {
    title: "Эксклюзивные коробки",
    text: "Разрабатываем конструкцию и оформление коробки под ваш бренд: размер, цвет, тиснение, ленты и вкладыши.",
    image: "/images/about-packing.jpg",
  },
  {
    title: "Логотип на наборе",
    text: "Наносим логотип компании на упаковку, открытку или стикер — аккуратно и в едином стиле с вашим гайдлайном.",
    image: "/images/hero-corporate.jpg",
  },
  {
    title: "Кастомизация состава",
    text: "Собираем набор под задачу: новогодний комплимент, онбординг, день компании или клиентский подарок.",
    image: "/catalog/posylka-iz-90h/01.png",
  },
];

const steps = [
  "Бриф и бюджет на одного получателя",
  "Подбор состава и макет упаковки",
  "Согласование образца",
  "Производство и доставка транспортными компаниями",
];

export function CorporatePage() {
  const { content } = useContent();
  const { brand } = content;

  return (
    <main className="corp-page">
      <section className="corp-hero">
        <div className="container corp-hero-grid">
          <div>
            <p className="cfg-eyebrow">Корпоративным клиентам</p>
            <h1>Подарки, которые хочется открывать</h1>
            <p className="corp-lead">
              Делаем корпоративные наборы со сладостями из 90-х под ваш бренд:
              эксклюзивные коробки, логотип и персональная кастомизация каждого
              набора.
            </p>
            <div className="corp-actions">
              <Link className="pill pill-accent" to="/configurator">
                Подобрать набор
              </Link>
              <a className="pill pill-outline corp-outline" href="/#corporate">
                Оставить заявку
              </a>
            </div>
          </div>
          <div className="corp-hero-media">
            <img src="/images/hero-corporate.jpg" alt="Корпоративные наборы" />
          </div>
        </div>
      </section>

      <Reveal>
        <section className="section section-light">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Что делаем</div>
                <h2 className="corp-h2">Для команд и клиентов</h2>
              </div>
            </div>
            <div className="corp-services">
              {services.map((item) => (
                <article className="corp-service" key={item.title}>
                  <div className="corp-service-media">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section section-catalog">
          <div className="container corp-split">
            <div>
              <div className="eyebrow">Процесс</div>
              <h2 className="corp-h2">Как запускаем заказ</h2>
              <ol className="corp-steps">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="corp-note">
                Самовывоз: Санкт-Петербург, Шуваловский парк, 1Г. Доставка —
                транспортными компаниями по всей России. От 50 000 ₽ доставка
                бесплатно.
              </p>
            </div>
            <div className="corp-gallery">
              <img src="/catalog/privet-iz-90h/01.png" alt="Набор Привет из 90-х" />
              <img src="/images/hero-man.jpg" alt="Подарок с хитами 90-х" />
              <img src="/catalog/tamagochi/01.png" alt="Набор Тамагочи" />
              <img src="/images/about-packing.jpg" alt="Сборка набора" />
            </div>
          </div>
        </section>
      </Reveal>

      <section className="section section-dark">
        <div className="container corp-cta">
          <h2 className="corp-h2">Готовы обсудить ваш тираж?</h2>
          <p>
            Напишите на {brand.email} или оставьте заявку — подготовим
            коммерческое предложение под ваш бюджет и сроки.
          </p>
          <div className="corp-actions">
            <a className="pill pill-accent" href="/#corporate">
              Отправить заявку
            </a>
            <Link className="pill pill-outline corp-outline" to="/catalog">
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
