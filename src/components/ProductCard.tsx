import type { Product } from "../data/products";
import { formatPrice } from "../data/products";

type Props = {
  product: Product;
  onOpen: (product: Product) => void;
};

export function ProductCard({ product, onOpen }: Props) {
  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card-hit"
        onClick={() => onOpen(product)}
      >
        <div className="product-card-media">
          <img src={product.images[0]} alt={product.name} />
        </div>
        <h3>{product.name}</h3>
        <ul className="product-stats">
          <li>
            <span>Сладость</span>
            <span className="dots" aria-hidden="true" />
            <strong>{product.stats.sweetness}</strong>
          </li>
          <li>
            <span>Разнообразие</span>
            <span className="dots" aria-hidden="true" />
            <strong>{product.stats.variety}</strong>
          </li>
          <li>
            <span>WOW-эффект</span>
            <span className="dots" aria-hidden="true" />
            <strong>{product.stats.wow}</strong>
          </li>
        </ul>
        <div className="product-meta">
          <span>{product.weight}</span>
          <strong>{formatPrice(product.price)}</strong>
        </div>
      </button>
    </article>
  );
}
