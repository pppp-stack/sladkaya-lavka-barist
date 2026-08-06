import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { useContent } from "../content/ContentProvider";
import type { Product } from "../data/products";

export function CatalogPage() {
  const { content } = useContent();
  const [visible, setVisible] = useState(8);
  const [selected, setSelected] = useState<Product | null>(null);
  const products = content.products;
  const list = products.slice(0, visible);

  return (
    <main className="section section-catalog catalog-page">
      <div className="container">
        <div className="catalog-crumbs">
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Каталог</span>
        </div>
        <h1 className="catalog-title">Каталог наборов</h1>
        <div className="product-grid">
          {list.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={setSelected}
            />
          ))}
        </div>
        {visible < products.length && (
          <div className="catalog-more">
            <button
              type="button"
              className="pill pill-more"
              onClick={() => setVisible(products.length)}
            >
              Показать ещё
            </button>
          </div>
        )}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <Link className="back-top" to="/" aria-label="На главную">
        ↑
      </Link>
    </main>
  );
}
