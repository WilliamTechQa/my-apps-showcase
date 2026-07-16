import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, Product, OrderType, PaymentMethod, Order } from '@/types/menu';
import { supabase } from '@/integrations/supabase/client';

const CART_ITEMS_KEY = 'mcbugs-cart-items';
const ORDER_TYPE_KEY = 'mcbugs-order-type';
const CURRENT_ORDER_KEY = 'mcbugs-current-order';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType | null;
  currentOrder: Order | null;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  getTotal: () => number;
  getItemCount: () => number;
  createOrder: (customerName: string, paymentMethod: PaymentMethod) => Promise<Order>;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => Promise<void>;
  completePayment: () => Promise<void>;
  cancelOrder: () => Promise<void>;
  resetOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Load initial state from localStorage
  const loadItems = (): CartItem[] => {
    try {
      const stored = localStorage.getItem(CART_ITEMS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
    return [];
  };

  const loadOrderType = (): OrderType | null => {
    try {
      const stored = localStorage.getItem(ORDER_TYPE_KEY);
      if (stored) {
        return stored as OrderType;
      }
    } catch (error) {
      console.error('Error loading order type:', error);
    }
    return null;
  };

  const loadCurrentOrder = (): Order | null => {
    try {
      const stored = localStorage.getItem(CURRENT_ORDER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        };
      }
    } catch (error) {
      console.error('Error loading current order:', error);
    }
    return null;
  };

  const [items, setItems] = useState<CartItem[]>(loadItems);
  const [orderType, setOrderType] = useState<OrderType | null>(loadOrderType);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(loadCurrentOrder);
  const [isLoading, setIsLoading] = useState(false);

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  }, [items]);

  // Persist orderType to localStorage
  useEffect(() => {
    try {
      if (orderType) {
        localStorage.setItem(ORDER_TYPE_KEY, orderType);
      } else {
        localStorage.removeItem(ORDER_TYPE_KEY);
      }
    } catch (error) {
      console.error('Error saving order type:', error);
    }
  }, [orderType]);

  // Persist currentOrder to localStorage
  useEffect(() => {
    try {
      if (currentOrder) {
        const orderToStore = {
          ...currentOrder,
          createdAt: currentOrder.createdAt.toISOString(),
        };
        localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(orderToStore));
      } else {
        localStorage.removeItem(CURRENT_ORDER_KEY);
      }
    } catch (error) {
      console.error('Error saving current order:', error);
    }
  }, [currentOrder]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_ITEMS_KEY);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const createOrder = useCallback(async (customerName: string, paymentMethod: PaymentMethod): Promise<Order> => {
    setIsLoading(true);
    
    const total = getTotal();
    const orderTypeValue = orderType || 'dine-in';
    
    // Prepare items for JSON storage
    const itemsJson = items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          order_type: orderTypeValue,
          payment_method: paymentMethod,
          total: total,
          items: itemsJson,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }

      const order: Order = {
        id: data.id,
        items: [...items],
        total: total,
        customerName,
        orderType: orderTypeValue,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(data.created_at),
      };
      
      setCurrentOrder(order);
      // Clear cart items after order is created
      setItems([]);
      localStorage.removeItem(CART_ITEMS_KEY);
      setIsLoading(false);
      return order;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [items, orderType, getTotal]);

  const updatePaymentMethod = useCallback(async (paymentMethod: PaymentMethod) => {
    if (currentOrder?.id) {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ payment_method: paymentMethod })
        .eq('id', currentOrder.id);

      if (error) {
        console.error('Error updating payment method:', error);
        throw error;
      } else {
        setCurrentOrder({ ...currentOrder, paymentMethod });
      }
      
      setIsLoading(false);
    }
  }, [currentOrder]);

  const completePayment = useCallback(async () => {
    if (currentOrder?.id) {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', currentOrder.id);

      if (error) {
        console.error('Error updating order:', error);
      } else {
        setCurrentOrder({ ...currentOrder, status: 'paid' });
      }
      
      setIsLoading(false);
    }
  }, [currentOrder]);

  const cancelOrder = useCallback(async () => {
    if (currentOrder?.id) {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', currentOrder.id);

      if (error) {
        console.error('Error cancelling order:', error);
      }
      
      setIsLoading(false);
    }
    
    // Reset order state regardless of database update result
    setItems([]);
    setOrderType(null);
    setCurrentOrder(null);
    // Clear all localStorage keys
    localStorage.removeItem(CART_ITEMS_KEY);
    localStorage.removeItem(ORDER_TYPE_KEY);
    localStorage.removeItem(CURRENT_ORDER_KEY);
  }, [currentOrder]);

  const resetOrder = useCallback(() => {
    setItems([]);
    setOrderType(null);
    setCurrentOrder(null);
    // Clear all localStorage keys
    localStorage.removeItem(CART_ITEMS_KEY);
    localStorage.removeItem(ORDER_TYPE_KEY);
    localStorage.removeItem(CURRENT_ORDER_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        currentOrder,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        getTotal,
        getItemCount,
        createOrder,
        updatePaymentMethod,
        completePayment,
        cancelOrder,
        resetOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
