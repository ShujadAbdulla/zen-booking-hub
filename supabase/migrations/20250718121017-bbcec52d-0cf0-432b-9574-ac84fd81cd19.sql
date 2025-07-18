-- Insert sample service providers
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

-- Insert sample availability for providers
INSERT INTO public.provider_availability (provider_id, day_of_week, start_time, end_time, is_active) VALUES
-- Downtown Medical Clinic (Mon-Fri 9AM-5PM)
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 1, '09:00', '17:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 2, '09:00', '17:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 3, '09:00', '17:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 4, '09:00', '17:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Downtown Medical Clinic'), 5, '09:00', '17:00', true),

-- Beauty Paradise Spa (Mon-Sat 10AM-8PM)
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 1, '10:00', '20:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 2, '10:00', '20:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 3, '10:00', '20:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 4, '10:00', '20:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 5, '10:00', '20:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Beauty Paradise Spa'), 6, '10:00', '20:00', true),

-- Elite Tutoring Center (Mon-Sun 2PM-9PM)
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 1, '14:00', '21:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 2, '14:00', '21:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 3, '14:00', '21:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 4, '14:00', '21:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 5, '14:00', '21:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 6, '14:00', '21:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Elite Tutoring Center'), 0, '14:00', '21:00', true),

-- Business Consulting Pro (Mon-Fri 8AM-6PM)
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 1, '08:00', '18:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 2, '08:00', '18:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 3, '08:00', '18:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 4, '08:00', '18:00', true),
((SELECT id FROM service_providers WHERE business_name = 'Business Consulting Pro'), 5, '08:00', '18:00', true),

-- FitLife Gym (Mon-Sun 6AM-10PM)
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 1, '06:00', '22:00', true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 2, '06:00', '22:00', true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 3, '06:00', '22:00', true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 4, '06:00', '22:00', true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 5, '06:00', '22:00', true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 6, '06:00', '22:00', true),
((SELECT id FROM service_providers WHERE business_name = 'FitLife Gym'), 0, '06:00', '22:00', true);