-- Insert availability for all providers
INSERT INTO public.provider_availability (provider_id, day_of_week, start_time, end_time, is_active) 
SELECT 
    sp.id as provider_id,
    generate_series(1, 5) as day_of_week,  -- Monday to Friday
    '09:00'::time as start_time,
    '17:00'::time as end_time,
    true as is_active
FROM service_providers sp
WHERE sp.business_name IN ('Downtown Medical Clinic', 'Business Consulting Pro');

-- Beauty spa and gym - longer hours, includes Saturday
INSERT INTO public.provider_availability (provider_id, day_of_week, start_time, end_time, is_active) 
SELECT 
    sp.id as provider_id,
    generate_series(1, 6) as day_of_week,  -- Monday to Saturday
    '10:00'::time as start_time,
    '20:00'::time as end_time,
    true as is_active
FROM service_providers sp
WHERE sp.business_name IN ('Beauty Paradise Spa', 'FitLife Gym');

-- Tutoring center - afternoons and weekends
INSERT INTO public.provider_availability (provider_id, day_of_week, start_time, end_time, is_active) 
SELECT 
    sp.id as provider_id,
    generate_series(1, 7) as day_of_week,  -- Monday to Sunday (0 = Sunday)
    '14:00'::time as start_time,
    '21:00'::time as end_time,
    true as is_active
FROM service_providers sp
WHERE sp.business_name = 'Elite Tutoring Center'
UNION
SELECT 
    sp.id as provider_id,
    0 as day_of_week,  -- Sunday
    '14:00'::time as start_time,
    '21:00'::time as end_time,
    true as is_active
FROM service_providers sp
WHERE sp.business_name = 'Elite Tutoring Center';