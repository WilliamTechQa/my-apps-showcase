import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { cn } from '@/lib/utils';

export function CartBar() {
  const navigate = useNavigate();
  const { items, getTotal, getItemCount } = useCart();

  if (items.length === 0) return null;

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-card border-t border-border shadow-elevated',
        'animate-slide-up'
      )}
    >
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Total dos pedidos</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-2xl text-foreground">
                {formatPrice(total)}
              </span>
              <span className="text-muted-foreground">/ {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
            </div>
          </div>
          <Button
            variant="accent"
            size="lg"
            onClick={() => navigate('/cart')}
            className="gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Ver pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
