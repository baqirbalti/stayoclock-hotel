import { AppLayout } from "@/components/layout/AppLayout";
import { useListBookings, useListRooms } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { Calendar, User, Mail, CreditCard, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getRoomImage } from "@/lib/unsplash";

export default function Bookings() {
  const { data: bookings, isLoading: bookingsLoading } = useListBookings();
  const { data: rooms, isLoading: roomsLoading } = useListRooms();

  const isLoading = bookingsLoading || roomsLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <AppLayout>
      <div className="bg-background min-h-screen py-24 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-3">My Reservations</h1>
            <p className="text-muted-foreground">Manage and view your upcoming stays at The Grand.</p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-card rounded-2xl animate-pulse border border-border" />
              ))}
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-bold font-display text-foreground mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">You haven't made any reservations with us yet.</p>
              <a href="/rooms" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Browse Rooms
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, i) => {
                const room = rooms?.find(r => r.id === booking.roomId);
                
                return (
                  <motion.div 
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
                  >
                    <div className="md:w-64 h-48 md:h-auto shrink-0 relative">
                      <img 
                        src={room ? getRoomImage(room.id, room.imageUrl) : "https://images.unsplash.com/photo-1566665797739-1674de7a421a"} 
                        alt={room?.name || "Room"} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize shadow-sm ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            {room?.name || `Room #${booking.roomId}`}
                          </h3>
                          <span className="font-bold text-lg text-foreground">${booking.totalPrice}</span>
                        </div>
                        <p className="text-sm text-primary font-semibold tracking-wider uppercase mb-6">
                          Booking REF: #{booking.id.toString().padStart(6, '0')}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <span>{format(parseISO(booking.checkIn), "MMM d, yyyy")} - {format(parseISO(booking.checkOut), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-primary" />
                            <span>{booking.guestName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-primary" />
                            <span className="truncate">{booking.guestEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
