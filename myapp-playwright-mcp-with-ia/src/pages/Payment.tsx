import { useNavigate } from 'react-router-dom';
import { QrCode, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/format';
import { PaymentMethod } from '@/types/menu';
import { cn } from '@/lib/utils';

const paymentOptions = [
  {
    id: 'pix' as PaymentMethod,
    name: 'PIX',
    icon: QrCode,
    description: 'Pagamento no balcão na hora da retirada',
    bgColor: 'bg-green-100',
    iconColor: 'text-info',
  },
  {
    id: 'debit' as PaymentMethod,
    name: 'Cartão de Débito',
    icon: CreditCard,
    description: 'Pagamento no balcão na hora da retirada',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    id: 'credit' as PaymentMethod,
    name: 'Cartão de Crédito',
    icon: CreditCard,
    description: 'Pagamento no balcão na hora da retirada',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
];

const Payment = () => {
  const navigate = useNavigate();
  const { currentOrder, cancelOrder, updatePaymentMethod } = useCart();

  if (!currentOrder) {
    navigate('/');
    return null;
  }

  const handlePaymentSelect = async (method: PaymentMethod) => {
    try {
      await updatePaymentMethod(method);
      navigate(`/payment/${method}/confirm`);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const handleCancelOrder = async () => {
    await cancelOrder();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Order Summary Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Logo size="sm" showText={true} />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">Pedido</span>
          <span className="font-display font-bold text-lg">#{currentOrder.id}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-muted-foreground">Total do pedido</span>
          <span className="font-display font-bold text-3xl text-accent">
            {formatPrice(currentOrder.total)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-xl text-foreground mb-2">
          Escolha a forma de pagamento
        </h2>
        <p className="text-muted-foreground mb-6">
          Selecione como deseja pagar seu pedido
        </p>

        <div className="space-y-4">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePaymentSelect(option.id)}
              className={cn(
                'w-full p-6 rounded-2xl transition-all',
                'hover:shadow-elevated',
                'flex items-center gap-4 text-left',
                option.bgColor
              )}
            >
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', option.bgColor)}>
                <option.icon className={cn('w-7 h-7', option.iconColor)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg text-foreground">
                    {option.name}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cancel Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={handleCancelOrder}
      >
        <X className="w-5 h-5 mr-2" />
        Cancelar Pedido
      </Button>
    </div>
  );
};

export default Payment;
