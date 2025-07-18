
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfDay } from "date-fns";
import { Clock, MapPin, User } from "lucide-react";

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
  };
};

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ service, isOpen, onClose }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: availability } = useQuery({
    queryKey: ['availability', service.service_providers.id, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      
      const dayOfWeek = selectedDate.getDay();
      const { data } = await supabase
        .from('provider_availability')
        .select('*')
        .eq('provider_id', service.service_providers.id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true);
      
      return data || [];
    },
    enabled: !!selectedDate,
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id || !selectedDate || !selectedTime) {
        throw new Error('Missing required information');
      }

      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from('appointments')
        .insert({
          customer_id: session.user.id,
          service_id: service.id,
          provider_id: service.service_providers.id,
          appointment_date: appointmentDateTime.toISOString(),
          duration_minutes: service.duration_minutes,
          total_price_cents: service.price_cents,
          notes: notes || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked.",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setNotes("");
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const generateTimeSlots = () => {
    if (!availability || availability.length === 0) return [];
    
    const slots: string[] = [];
    availability.forEach((slot) => {
      const start = new Date(`1970-01-01T${slot.start_time}`);
      const end = new Date(`1970-01-01T${slot.end_time}`);
      
      const current = new Date(start);
      while (current < end) {
        slots.push(current.toTimeString().slice(0, 5));
        current.setMinutes(current.getMinutes() + service.duration_minutes);
      }
    });
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!session) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              You need to sign in to book an appointment.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => window.location.href = '/login'}>
            Sign In
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
          <DialogDescription>
            Schedule your appointment with {service.service_providers.business_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{service.name}</h3>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(service.price_cents)}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {service.service_providers.business_name}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {service.duration_minutes} minutes
              </div>
              {service.service_providers.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {service.service_providers.address}
                </div>
              )}
            </div>
            
            {service.description && (
              <p className="text-sm text-muted-foreground">{service.description}</p>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-semibold">Select Date</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < startOfDay(new Date()) || date > addDays(new Date(), 30)}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <Label className="text-base font-semibold">Available Times</Label>
              <div className="mt-2">
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No available times for {format(selectedDate, 'EEEE, MMMM d')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-semibold">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or information for the provider..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Booking Summary & Actions */}
          {selectedDate && selectedTime && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Service:</strong> {service.name}</p>
                <p><strong>Provider:</strong> {service.service_providers.business_name}</p>
                <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Duration:</strong> {service.duration_minutes} minutes</p>
                <p><strong>Total:</strong> {formatPrice(service.price_cents)}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={() => bookingMutation.mutate()}
              disabled={!selectedDate || !selectedTime || bookingMutation.isPending}
              className="flex-1"
            >
              {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
