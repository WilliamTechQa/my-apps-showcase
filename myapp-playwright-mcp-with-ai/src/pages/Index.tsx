import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useCart } from '@/context/CartContext';

const Index = () => {
  const navigate = useNavigate();
  const { setOrderType } = useCart();

  const handleOrderType = (type: 'dine-in' | 'takeaway') => {
    setOrderType(type);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl mx-auto text-center animate-fade-up">
        <Logo size="xl" showText={false} className="justify-center mb-6" />

        <h1 className="font-display font-bold text-5xl md:text-6xl text-foreground mb-2">
          McBugs
        </h1>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
          Seja bem-vindo!
        </h2>

        <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto">
          Escolha como prefere aproveitar sua refeição. Estamos aqui para oferecer praticidade e sabor em cada detalhe!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Botão Para Comer Aqui */}
          <button
            onClick={() => handleOrderType('dine-in')}
            className="bg-card rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group flex flex-col items-center"
          >
            <div className="w-64 h-64 mb-6 flex items-center justify-center">
              <img
                src="/images/dine_in.svg"
                alt="Para comer aqui"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <Button variant="default" size="lg" className="w-full" asChild>
              <span>Para comer aqui</span>
            </Button>
          </button>

          {/* Botão Para Levar */}
          <button
            onClick={() => handleOrderType('takeaway')}
            className="bg-card rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group flex flex-col items-center"
          >
            <div className="w-64 h-64 mb-6 flex items-center justify-center">
              <img
                src="/images/takeaway.svg"
                alt="Para levar"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <Button variant="accent" size="lg" className="w-full" asChild>
              <span>Para levar</span>
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;