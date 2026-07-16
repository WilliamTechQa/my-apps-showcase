import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<void>;
}

export function CheckoutDrawer({ open, onOpenChange, onSubmit }: CheckoutDrawerProps) {
  const [name, setName] = useState('Fernando');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      setName('');
      setIsLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(name);
      // Only reset form and close drawer after successful submission
      setName('');
    } catch (error) {
      // If there's an error, keep the drawer open and show the form again
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-6 pb-8">
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <h3 className="font-display font-bold text-2xl text-foreground">
              enviando a cozinha....
            </h3>
            <p className="text-muted-foreground text-center">
              Aguarde enquanto preparamos o seu pagamento.
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-6 pb-8">
        <DrawerHeader className="text-left px-0">
          <DrawerTitle className="font-display text-2xl">Finalizar Pedido</DrawerTitle>
          <DrawerDescription>
            Insira suas informações abaixo para finalizar o seu pedido.
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Seu nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="h-14 text-lg rounded-xl"
              required
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="accent" className="flex-1">
              Finalizar
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
