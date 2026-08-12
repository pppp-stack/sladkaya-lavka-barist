import { Link } from "react-router-dom";
import { ConfiguratorWizard } from "../components/ConfiguratorWizard";

export function ConfiguratorPage() {
  return (
    <main className="cfg-page">
      <div className="container">
        <div className="catalog-crumbs">
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Конфигуратор</span>
        </div>
        <div className="cfg-intro">
          <p className="cfg-eyebrow">Для бизнеса</p>
          <h1>Конфигуратор корпоративных подарков</h1>
          <p>
            Ответьте на 8 коротких вопросов — подберём наборы и подготовим
            коммерческое предложение.
          </p>
        </div>
        <div className="cfg-wrap">
          <ConfiguratorWizard />
        </div>
      </div>
    </main>
  );
}
