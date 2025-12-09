-- Create payment_sessions table for tracking x402 payments
CREATE TABLE public.payment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource TEXT NOT NULL,
  amount DECIMAL(18, 6) NOT NULL,
  asset TEXT NOT NULL DEFAULT 'USDC',
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Create wash_sessions table
CREATE TABLE public.wash_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_session_id UUID REFERENCES public.payment_sessions(id),
  vehicle_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  operator_id TEXT NOT NULL,
  wash_type TEXT NOT NULL DEFAULT 'basic',
  status TEXT NOT NULL DEFAULT 'pending',
  price_usdc DECIMAL(18, 6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create service_sessions table
CREATE TABLE public.service_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_session_id UUID REFERENCES public.payment_sessions(id),
  vehicle_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  operator_id TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'oil_change',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  price_usdc DECIMAL(18, 6) NOT NULL,
  mileage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create customer_loyalty table
CREATE TABLE public.customer_loyalty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id TEXT NOT NULL UNIQUE,
  points INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze',
  total_spent_usdc DECIMAL(18, 6) NOT NULL DEFAULT 0,
  wash_count INTEGER NOT NULL DEFAULT 0,
  service_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create operator_rewards table
CREATE TABLE public.operator_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id TEXT NOT NULL UNIQUE,
  earned_usdc DECIMAL(18, 6) NOT NULL DEFAULT 0,
  pending_usdc DECIMAL(18, 6) NOT NULL DEFAULT 0,
  paid_usdc DECIMAL(18, 6) NOT NULL DEFAULT 0,
  job_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for demo purposes - adjust for production)
CREATE POLICY "Allow public read payment_sessions" ON public.payment_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert payment_sessions" ON public.payment_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update payment_sessions" ON public.payment_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read wash_sessions" ON public.wash_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert wash_sessions" ON public.wash_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update wash_sessions" ON public.wash_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read service_sessions" ON public.service_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert service_sessions" ON public.service_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update service_sessions" ON public.service_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read customer_loyalty" ON public.customer_loyalty FOR SELECT USING (true);
CREATE POLICY "Allow public insert customer_loyalty" ON public.customer_loyalty FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update customer_loyalty" ON public.customer_loyalty FOR UPDATE USING (true);

CREATE POLICY "Allow public read operator_rewards" ON public.operator_rewards FOR SELECT USING (true);
CREATE POLICY "Allow public insert operator_rewards" ON public.operator_rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update operator_rewards" ON public.operator_rewards FOR UPDATE USING (true);

-- Create function to update loyalty tier based on points
CREATE OR REPLACE FUNCTION public.update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.points >= 10000 THEN
    NEW.tier = 'platinum';
  ELSIF NEW.points >= 5000 THEN
    NEW.tier = 'gold';
  ELSIF NEW.points >= 2000 THEN
    NEW.tier = 'silver';
  ELSE
    NEW.tier = 'bronze';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for loyalty tier updates
CREATE TRIGGER update_customer_loyalty_tier
BEFORE UPDATE ON public.customer_loyalty
FOR EACH ROW
EXECUTE FUNCTION public.update_loyalty_tier();