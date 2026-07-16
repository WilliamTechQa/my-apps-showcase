import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Clock, MapPin, Check, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';

const PaymentPix = () => {
  const navigate = useNavigate();
  const { currentOrder, completePayment, resetOrder } = useCart();
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
      return;
    }

    // Simulate payment confirmation after 5 seconds
    const timer = setTimeout(async () => {
      setIsPaid(true);
      await completePayment();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentOrder, navigate, completePayment]);

  if (!currentOrder) {
    return null;
  }

  const handleNewOrder = () => {
    resetOrder();
    navigate('/');
  };

  const pixCode = '00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540539.905802BR5925MCBUGS RESTAURANTE LTDA6009SAO PAULO62070503***63041234';

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
          <QrCode className="h-6 w-6 text-info" />
          <span className="font-display font-bold text-xl">Pagamento via PIX</span>
        </div>
        <span className="ml-auto text-muted-foreground">#{currentOrder.id}</span>
      </div>

      {/* Payment Status */}
      {!isPaid ? (
        <>
          {/* Waiting Status */}
          <div className="bg-warning/20 rounded-2xl p-6 mb-6 animate-pulse-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Aguardando PIX
                </h3>
                <p className="text-muted-foreground">
                  Aguardando confirmação do pagamento via PIX
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
            <h3 className="font-display font-bold text-lg mb-4">Detalhes do pedido</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Restaurante</span>
                <span className="font-semibold">McBugs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-semibold">
                  {currentOrder.orderType === 'dine-in' ? 'Comer no local' : 'Para levar'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="font-semibold">{formatDate(currentOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-xl text-accent">
                  {formatPrice(currentOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* PIX Code */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
            <h3 className="font-display font-bold text-lg mb-4">Código PIX</h3>
            <div className="bg-secondary rounded-xl p-4 mb-3">
              <p className="text-xs text-muted-foreground break-all font-mono">
                {pixCode}
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Copie o código e cole no app do seu banco
            </p>
          </div>

          {currentOrder.orderType === 'dine-in' && (
            <div className="bg-info/10 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-info flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Após o pagamento, aguarde ser chamado pelo número do seu pedido.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/payment')}
          >
            Escolher Outro Método
          </Button>
        </>
      ) : (
        <>
          {/* Payment Confirmed */}
          <div className="bg-success/20 rounded-2xl p-6 mb-6 animate-bounce-in">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center">
                <Check className="w-8 h-8 text-success-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  Pagamento Confirmado!
                </h3>
                <p className="text-muted-foreground">
                  Seu pagamento foi recebido com sucesso
                </p>
              </div>
            </div>
          </div>

          {/* Preparing Status */}
          <div className="bg-info/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-info/30 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-info animate-spin" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Preparando seu pedido
                </h3>
                <p className="text-muted-foreground">
                  Pedido #{currentOrder.id} • {currentOrder.customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="sm" showText={true} />
            </div>
            <div className="space-y-2">
              {currentOrder.items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="text-muted-foreground">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-display font-bold text-accent">
                  {formatPrice(currentOrder.total)}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="accent"
            size="xl"
            className="w-full"
            onClick={handleNewOrder}
          >
            Fazer Novo Pedido
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentPix;
