import { useEffect, useState } from "react";
import type { Product } from "../data/products";
import { formatPrice } from "../data/products";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  const images = product.images;
  const main = images[active] ?? images[0];

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          Закрыть <span>×</span>
        </button>

        <div className="product-modal-grid">
          <div className="product-modal-gallery">
            <div className="product-modal-main">
              <img src={main} alt={product.name} />
            </div>
            <div className="product-thumbs">
              <button
                type="button"
                className="thumb-nav"
                onClick={() =>
                  setActive((v) => (v - 1 + images.length) % images.length)
                }
                aria-label="Предыдущее фото"
              >
                ‹
              </button>
              <div className="thumb-list">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`thumb${i === active ? " is-active" : ""}`}
                    onClick={() => setActive(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="thumb-nav"
                onClick={() => setActive((v) => (v + 1) % images.length)}
                aria-label="Следующее фото"
              >
                ›
              </button>
            </div>
          </div>

          <div className="product-modal-info">
            <h2>{product.name}</h2>
            <div className="modal-nostalgia">
              <span>Ностальгия</span>
              <div className="candy-row">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < product.nostalgia ? "candy is-on" : "candy"}
                  />
                ))}
              </div>
            </div>

            <div className="modal-volume">
              <span className="label">Объём</span>
              <div className="modal-volume-row">
                <span>{product.weight}</span>
                <span className="dots" />
                <strong>{formatPrice(product.price)}</strong>
              </div>
            </div>

            <div className="modal-block">
              <h3>Характеристики</h3>
              <ul className="product-stats">
                <li>
                  <span>Сладость</span>
                  <span className="dots" />
                  <strong>{product.stats.sweetness}</strong>
                </li>
                <li>
                  <span>Ностальгия</span>
                  <span className="dots" />
                  <strong>{product.stats.nostalgia}</strong>
                </li>
                <li>
                  <span>Разнообразие</span>
                  <span className="dots" />
                  <strong>{product.stats.variety}</strong>
                </li>
                <li>
                  <span>WOW-эффект</span>
                  <span className="dots" />
                  <strong>{product.stats.wow}</strong>
                </li>
              </ul>
            </div>

            <p className="modal-line">
              <strong>Состав:</strong> {product.composition}
            </p>
            <p className="modal-line">
              <strong>Формат:</strong> {product.roastNote}
            </p>
            <p className="modal-line">
              <strong>Описание:</strong> {product.description}
            </p>

            <div className="modal-block">
              <a className="pill pill-accent modal-order-btn" href="/#corporate">
                Заказать
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
