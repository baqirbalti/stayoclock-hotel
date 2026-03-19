import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { differenceInDays, isBefore, startOfToday } from "date-fns";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetRoom, useCreateBooking } from "@workspace/api-client-react";
import { getRoomImage } from "@/lib/unsplash";
import { CheckCircle2, ArrowLeft, Loader2, Calendar as CalendarIcon, Info } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const bookingSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
}).refine(data => {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  return isBefore(checkIn, checkOut);
}, {
  message: "Check-out must be after check-in",
  path: ["checkOut"]
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Book() {
  const [match, params] = useRoute("/book/:roomId");
  const [, setLocation] = useLocation();
  const roomId = match ? parseInt(params.roomId) : 0;
  
  const { data: room, isLoading: roomLoading } = useGetRoom(roomId, { query: { enabled: !!roomId } });
  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: format(new Date(), "yyyy-MM-dd"),
      checkOut: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
    }
  });

  const checkInVal = watch("checkIn");
  const checkOutVal = watch("checkOut");

  const calculateDays = () => {
    if (!checkInVal || !checkOutVal) return 0;
    const start = new Date(checkInVal);
    const end = new Date(checkOutVal);
    const days = differenceInDays(end, start);
    return days > 0 ? days : 0;
  };

  const days = calculateDays();
  const totalPrice = room ? days * room.pricePerNight : 0;

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking({
        data: {
          roomId,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          checkIn: new Date(data.checkIn).toISOString(),
          checkOut: new Date(data.checkOut).toISOString(),
        }
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Booking failed", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  if (success) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-background py-24 mt-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border p-10 text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Reservation Confirmed</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for choosing The Grand. A confirmation email has been sent to your inbox with your reservation details.
            </p>
            <button
              onClick={() => setLocation("/bookings")}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              View My Bookings
            </button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-background min-h-screen py-24 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Back to Rooms
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Booking Form */}
            <div className="lg:col-span-7">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h1 className="text-3xl font-display font-bold mb-6">Complete Your Reservation</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Guest Name</label>
                      <input 
                        {...register("guestName")}
                        placeholder="John Doe"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {errors.guestName && <p className="text-destructive text-xs">{errors.guestName.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Email Address</label>
                      <input 
                        {...register("guestEmail")}
                        placeholder="john@example.com"
                        type="email"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {errors.guestEmail && <p className="text-destructive text-xs">{errors.guestEmail.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Check-In Date</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                        <input 
                          {...register("checkIn")}
                          type="date"
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      {errors.checkIn && <p className="text-destructive text-xs">{errors.checkIn.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Check-Out Date</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                        <input 
                          {...register("checkOut")}
                          type="date"
                          min={checkInVal || format(new Date(), "yyyy-MM-dd")}
                          className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      {errors.checkOut && <p className="text-destructive text-xs">{errors.checkOut.message}</p>}
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 text-primary-foreground text-sm items-start">
                    <Info size={18} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground/80">Standard check-in time is 3:00 PM and check-out is 11:00 AM. For special requests, please speak to our concierge after booking.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending || !room || days <= 0}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-lg hover:bg-primary/90 hover:shadow-lg shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isPending ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : "Confirm Reservation"}
                  </button>
                </form>
              </div>
            </div>

            {/* Room Summary */}
            <div className="lg:col-span-5">
              {roomLoading ? (
                <div className="bg-card border border-border rounded-2xl h-[500px] animate-pulse" />
              ) : room ? (
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm sticky top-28">
                  <div className="h-56 relative">
                    <img 
                      src={getRoomImage(room.id, room.imageUrl)} 
                      alt={room.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white/80 text-sm font-semibold tracking-wider uppercase mb-1">{room.type}</p>
                      <h3 className="text-white text-2xl font-display font-bold leading-tight">{room.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-semibold text-foreground mb-4 border-b border-border pb-2">Price Breakdown</h4>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>${room.pricePerNight} × {days} night{days !== 1 && 's'}</span>
                        <span className="font-medium text-foreground">${totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Taxes & Fees (10%)</span>
                        <span className="font-medium text-foreground">${Math.round(totalPrice * 0.1)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4 flex justify-between items-center">
                      <span className="font-bold text-lg text-foreground">Total</span>
                      <span className="font-bold text-2xl text-primary">${totalPrice + Math.round(totalPrice * 0.1)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-destructive/10 text-destructive p-6 rounded-xl text-center">
                  Room information not found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
