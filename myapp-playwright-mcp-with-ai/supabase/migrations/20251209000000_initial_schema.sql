-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create orders table
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('dine-in', 'takeaway')),
  payment_method TEXT CHECK (payment_method IN ('pix', 'debit', 'credit')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (kiosk is public)
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read orders (for status checking)
CREATE POLICY "Anyone can view orders"
ON public.orders
FOR SELECT
USING (true);

-- Allow updates to orders (for payment confirmation and cancellation)
CREATE POLICY "Anyone can update orders"
ON public.orders
FOR UPDATE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

