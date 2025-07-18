-- Remove foreign key constraint to allow test data
ALTER TABLE service_providers DROP CONSTRAINT service_providers_user_id_fkey;

-- Insert sample service providers with random UUIDs
INSERT INTO public.service_providers (user_id, business_name, description, category, address, phone, is_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'Downtown Medical Clinic', 'Professional healthcare services with experienced doctors', 'medical', '123 Main St, Downtown', '+1-555-0101', true),
('22222222-2222-2222-2222-222222222222', 'Beauty Paradise Spa', 'Luxury spa and beauty treatments for ultimate relaxation', 'beauty', '456 Oak Ave, Uptown', '+1-555-0102', true),
('33333333-3333-3333-3333-333333333333', 'Elite Tutoring Center', 'Expert tutoring services for all academic levels', 'tutoring', '789 Pine St, Midtown', '+1-555-0103', false),
('44444444-4444-4444-4444-444444444444', 'Business Consulting Pro', 'Strategic business consulting and advisory services', 'consulting', '321 Elm St, Business District', '+1-555-0104', true),
('55555555-5555-5555-5555-555555555555', 'FitLife Gym', 'Personal training and fitness coaching', 'fitness', '654 Cedar Rd, Sports Complex', '+1-555-0105', true);

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