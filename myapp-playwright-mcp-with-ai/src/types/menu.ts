export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  ingredients?: string[];
}

export type Category = 'lanches' | 'fritas' | 'bebidas' | 'sobremesas';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderType = 'dine-in' | 'takeaway';

export type PaymentMethod = 'pix' | 'debit' | 'credit';

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  customerName: string;
  orderType: OrderType;
  paymentMethod?: PaymentMethod;
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
}
