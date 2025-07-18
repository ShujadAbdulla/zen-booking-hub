-- First create some sample profiles for our providers
INSERT INTO public.profiles (id, email, full_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'clinic@downtown.com', 'Downtown Medical', 'provider'),
('00000000-0000-0000-0000-000000000002', 'spa@beauty.com', 'Beauty Paradise', 'provider'),
('00000000-0000-0000-0000-000000000003', 'tutor@elite.com', 'Elite Tutoring', 'provider'),
('00000000-0000-0000-0000-000000000004', 'consult@business.com', 'Business Pro', 'provider'),
('00000000-0000-0000-0000-000000000005', 'gym@fitlife.com', 'FitLife Trainer', 'provider');

-- Now insert service providers that reference these profiles
INSERT INTO public.service_providers (user_id, business_name, description, category, address, phone, is_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'Downtown Medical Clinic', 'Professional healthcare services with experienced doctors', 'medical', '123 Main St, Downtown', '+1-555-0101', true),
('00000000-0000-0000-0000-000000000002', 'Beauty Paradise Spa', 'Luxury spa and beauty treatments for ultimate relaxation', 'beauty', '456 Oak Ave, Uptown', '+1-555-0102', true),
('00000000-0000-0000-0000-000000000003', 'Elite Tutoring Center', 'Expert tutoring services for all academic levels', 'tutoring', '789 Pine St, Midtown', '+1-555-0103', false),
('00000000-0000-0000-0000-000000000004', 'Business Consulting Pro', 'Strategic business consulting and advisory services', 'consulting', '321 Elm St, Business District', '+1-555-0104', true),
('00000000-0000-0000-0000-000000000005', 'FitLife Gym', 'Personal training and fitness coaching', 'fitness', '654 Cedar Rd, Sports Complex', '+1-555-0105', true);

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