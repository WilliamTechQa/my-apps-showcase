import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { QuantityControl } from '@/components/QuantityControl';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addItem, getItemCount } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);
  const itemCount = getItemCount();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Produto não encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Product Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <Button
          variant="icon"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => navigate('/menu')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {itemCount > 0 && (
          <Button
            variant="icon"
            size="icon"
            className="absolute top-4 right-4 relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </Button>
        )}
      </div>

      {/* Content Panel */}
      <div className="relative -mt-16 mx-4">
        <div className="bg-card rounded-3xl shadow-elevated p-6">
          <Logo size="sm" showText={true} className="mb-4" />

          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            {product.name}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <p className="font-display font-bold text-3xl text-accent">
              {formatPrice(product.price)}
            </p>
            <QuantityControl
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              size="lg"
            />
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-2">
              Sobre
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Ingredients Section */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  Ingredientes
                </h2>
              </div>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button
          variant="accent"
          size="xl"
          className="w-full"
          onClick={handleAddToCart}
        >
          Quero • {formatPrice(product.price * quantity)}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
