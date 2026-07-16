import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ProductCard } from '@/components/ProductCard';
import { CartBar } from '@/components/CartBar';
import { products } from '@/data/products';
import { Category } from '@/types/menu';

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('lanches');

  const filteredProducts = products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Image */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Hamburgers"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <Button
          variant="icon"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content Panel */}
      <div className="relative -mt-16 mx-4">
        <div className="bg-card rounded-3xl shadow-elevated p-6">
          {/* Restaurant Info */}
          <div className="flex items-center gap-3 mb-4">
            <Logo size="sm" showText={true} />
          </div>
          
          <p className="text-muted-foreground mb-4">
            O fast food favorito da comunidade de QAs 🐛
          </p>

          <div className="flex items-center gap-2 text-success">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <Clock className="h-4 w-4" />
            <span className="font-semibold">Aberto!</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-6">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Products Grid */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </div>

      <CartBar />
    </div>
  );
};

export default Menu;
