
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, Star, Search } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";

type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  service_providers: {
    id: string;
    business_name: string;
    address: string;
    category: string;
    is_verified: boolean;
  } | null;
};

const BrowseServices = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ['services', selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select(`
          *,
          service_providers!inner(
            id,
            business_name,
            address,
            category,
            is_verified
          )
        `)
        .eq('is_active', true);

      if (selectedCategory !== 'all') {
        query = query.eq('service_providers.category', selectedCategory as any);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Service[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'medical', label: 'Medical' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'other', label: 'Other' },
  ];

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
            <p className="text-muted-foreground">Find and book the perfect service for your needs</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services Grid */}
          {error ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
                <p className="text-muted-foreground mb-4">
                  Unable to connect to the database. Please check your connection and try again.
                </p>
              </div>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
                        {service.service_providers && (
                          <Badge variant="outline" className="capitalize text-xs shrink-0">
                            {service.service_providers.category}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        {service.service_providers?.business_name || 'Unknown Provider'}
                        {service.service_providers?.is_verified && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {service.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration_minutes} min
                        </div>
                        {service.service_providers?.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{service.service_providers.address.split(',')[0]}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(service.price_cents)}
                        </div>
                        <Button 
                          onClick={() => setSelectedService(service)}
                          className="w-full sm:w-auto"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No services found matching your criteria
              </p>
              <Button variant="outline" onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {selectedService && (
        <BookingModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default BrowseServices;
