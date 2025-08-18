-- AI Resume Builder Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table is handled by Supabase Auth automatically

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  template_id TEXT DEFAULT 'modern-professional',
  ats_score INTEGER,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resume reviews table
CREATE TABLE IF NOT EXISTS resume_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  overall_score INTEGER,
  ats_issues JSONB,
  keywords_analysis JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions table (for premium features)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
  credits_remaining INTEGER DEFAULT 5,
  subscription_start TIMESTAMP DEFAULT NOW(),
  subscription_end TIMESTAMP,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resume templates table
CREATE TABLE IF NOT EXISTS resume_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  preview_image TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default templates
INSERT INTO resume_templates (id, name, description, category, is_premium) VALUES
('modern-professional', 'Modern Professional', 'Clean and modern design perfect for tech and business roles', 'Professional', FALSE),
('executive-classic', 'Executive Classic', 'Traditional format ideal for senior leadership positions', 'Executive', FALSE),
('creative-designer', 'Creative Designer', 'Stylish template for creative and design professionals', 'Creative', TRUE),
('healthcare-professional', 'Healthcare Professional', 'Specialized format for medical and healthcare careers', 'Healthcare', TRUE),
('finance-banking', 'Finance & Banking', 'Conservative design for finance and banking sectors', 'Finance', TRUE),
('academic-research', 'Academic & Research', 'Academic-focused template for researchers and educators', 'Academic', TRUE),
('sales-marketing', 'Sales & Marketing', 'Dynamic template for sales and marketing professionals', 'Sales', FALSE),
('engineering-technical', 'Engineering & Technical', 'Technical-focused design for engineers and developers', 'Technical', FALSE),
('fresh-graduate', 'Fresh Graduate', 'Entry-level friendly template for new graduates', 'Entry Level', FALSE),
('career-changer', 'Career Changer', 'Flexible format for career transition professionals', 'Transition', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resumes
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for resume reviews
CREATE POLICY "Users can view own resume reviews" ON resume_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM resumes 
      WHERE resumes.id = resume_reviews.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own resume reviews" ON resume_reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes 
      WHERE resumes.id = resume_reviews.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

-- Create RLS policies for user subscriptions
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_reviews_resume_id ON resume_reviews(resume_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Create function to automatically create user subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_type, credits_remaining)
  VALUES (NEW.id, 'free', 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();