
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('appointments')
        .select(`
          *,
          services(name, duration_minutes),
          service_providers(business_name)
        `)
        .eq('customer_id', session.user.id)
        .order('appointment_date', { ascending: true });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const { data: providerData } = useQuery({
    queryKey: ['provider-data', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id || profile?.role !== 'provider') return null;
      const { data } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user?.id && profile?.role === 'provider',
  });

  if (!session) {
    navigate('/login');
    return null;
  }

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled'
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'User'}!</h1>
          <p className="text-muted-foreground">
            {profile?.role === 'provider' ? 'Manage your business' : 'Manage your appointments'}
          </p>
        </div>
        
        {profile?.role === 'provider' ? (
          <Button onClick={() => navigate('/provider/setup')}>
            <Plus className="mr-2 h-4 w-4" />
            Set Up Business
          </Button>
        ) : (
          <Button onClick={() => navigate('/browse')}>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        {profile?.role === 'provider' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {providerData ? 'Active' : 'Pending'}
              </div>
              <p className="text-xs text-muted-foreground">
                {providerData ? 'Business profile complete' : 'Complete your setup'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{appointment.services?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      with {appointment.service_providers?.business_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                      {new Date(appointment.appointment_date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{appointment.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.services?.duration_minutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
