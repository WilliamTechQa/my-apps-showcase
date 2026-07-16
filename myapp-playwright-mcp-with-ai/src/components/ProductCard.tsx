import { Product } from '@/types/menu';
import { formatPrice } from '@/utils/format';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full bg-card rounded-2xl overflow-hidden shadow-card',
        'transition-all duration-300 hover:shadow-elevated hover:scale-[1.02]',
        'active:scale-[0.98] text-left'
      )}
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <p className="font-display font-bold text-xl text-accent">
          {formatPrice(product.price)}
        </p>
      </div>
    </button>
  );
}
