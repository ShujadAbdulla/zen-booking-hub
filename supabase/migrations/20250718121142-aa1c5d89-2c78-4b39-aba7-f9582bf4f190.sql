-- First, let's drop the foreign key constraint temporarily to insert test data
ALTER TABLE service_providers DROP CONSTRAINT IF EXISTS service_providers_user_id_fkey;

-- Insert sample service providers without user_id constraints
INSERT INTO public.service_providers (user_id, business_name, description, category, address, phone, is_verified) VALUES
(gen_random_uuid(), 'Downtown Medical Clinic', 'Professional healthcare services with experienced doctors', 'medical', '123 Main St, Downtown', '+1-555-0101', true),
(gen_random_uuid(), 'Beauty Paradise Spa', 'Luxury spa and beauty treatments for ultimate relaxation', 'beauty', '456 Oak Ave, Uptown', '+1-555-0102', true),
(gen_random_uuid(), 'Elite Tutoring Center', 'Expert tutoring services for all academic levels', 'tutoring', '789 Pine St, Midtown', '+1-555-0103', false),
(gen_random_uuid(), 'Business Consulting Pro', 'Strategic business consulting and advisory services', 'consulting', '321 Elm St, Business District', '+1-555-0104', true),
(gen_random_uuid(), 'FitLife Gym', 'Personal training and fitness coaching', 'fitness', '654 Cedar Rd, Sports Complex', '+1-555-0105', true);

-- Insert sample services
INSERT INTO public.services (provider_id, name, description, duration_minutes, price_cents, is_active) VALUES
-- Medical services
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 'General Consultation', 'Comprehensive health checkup and consultation', 30, 15000, true),
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 'Blood Test Analysis', 'Complete blood work and laboratory analysis', 45, 8000, true),

-- Beauty services  
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 'Facial Treatment', 'Deep cleansing facial with moisturizing treatment', 60, 12000, true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 'Full Body Massage', 'Relaxing Swedish massage therapy', 90, 18000, true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 'Manicure & Pedicure', 'Professional nail care and styling', 75, 9500, true),

-- Tutoring services
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 'Math Tutoring', 'One-on-one mathematics tutoring session', 60, 6000, true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 'English Writing Help', 'Essay writing and grammar improvement', 90, 7500, true),

-- Consulting services
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 'Business Strategy Session', 'Strategic planning and business development consultation', 120, 25000, true),
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 'Marketing Analysis', 'Market research and marketing strategy review', 90, 20000, true),

-- Fitness services
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 'Personal Training Session', 'One-on-one fitness training with certified trainer', 60, 8500, true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 'Group Fitness Class', 'High-energy group workout session', 45, 3500, true);

-- Add back the foreign key constraint
ALTER TABLE service_providers ADD CONSTRAINT service_providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;