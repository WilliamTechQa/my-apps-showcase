import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, ArrowLeft, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';

const PaymentCard = () => {
  const navigate = useNavigate();
  const { method } = useParams<{ method: 'credit' }>();
  const { currentOrder, cancelOrder, resetOrder } = useCart();

  if (!currentOrder || method !== 'credit') {
    navigate('/payment');
    return null;
  }

  const Icon = CreditCard;
  const iconColor = 'text-purple-500';
  const bgColor = 'bg-purple-500/10';

  const handleNewOrder = () => {
    resetOrder();
    navigate('/');
  };

  const handleCancelOrder = async () => {
    await cancelOrder();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="icon"
          size="icon"
          onClick={() => navigate('/payment')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Icon className={cn('h-6 w-6', iconColor)} />
          <span className="font-display font-bold text-xl">
            Cartão de Crédito
          </span>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6 animate-fade-up">
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

      {/* Payment Instructions */}
      <div className={cn('rounded-2xl p-6 mb-6', bgColor)}>
        <div className="flex items-center gap-4 mb-4">
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', bgColor)}>
            <Clock className={cn('w-6 h-6', iconColor)} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">
              Pagamento no Balcão
            </h3>
            <p className="text-muted-foreground">
              Dirija-se ao balcão para efetuar o pagamento
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
        <h3 className="font-display font-bold text-lg mb-4">Detalhes do pedido</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente</span>
            <span className="font-semibold">{currentOrder.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <span className="font-semibold">
              {currentOrder.orderType === 'dine-in' ? 'Comer no local' : 'Para levar'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método</span>
            <span className="font-semibold">
              Crédito
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data</span>
            <span className="font-semibold">{formatDate(currentOrder.createdAt)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="font-semibold mb-2">Itens</h4>
          <div className="space-y-2">
            {currentOrder.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product.name}</span>
                <span className="text-muted-foreground">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentOrder.orderType === 'dine-in' && (
        <div className="bg-info/10 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-info flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Após o pagamento, aguarde ser chamado pelo número do seu pedido.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          variant="accent"
          size="xl"
          className="w-full"
          onClick={handleNewOrder}
        >
          Fazer Novo Pedido
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleCancelOrder}
        >
          Cancelar Pedido
        </Button>
      </div>
    </div>
  );
};

export default PaymentCard;
