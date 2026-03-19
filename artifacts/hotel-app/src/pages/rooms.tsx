import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useListRooms } from "@workspace/api-client-react";
import { getRoomImage } from "@/lib/unsplash";
import { Users, Wifi, Wind, Tv } from "lucide-react";
import { motion } from "framer-motion";

export default function Rooms() {
  const { data: rooms, isLoading } = useListRooms();

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="bg-foreground text-white py-24 relative overflow-hidden mt-16">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1920" 
            alt="Texture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Accommodations</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
            Designed for the modern traveler, our rooms and suites offer a harmonious blend of luxury, comfort, and state-of-the-art technology.
          </p>
        </div>
      </div>

      {/* Room Listing */}
      <div className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[500px] bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms?.map((room, i) => (
                <motion.div 
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={getRoomImage(room.id, room.imageUrl)} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {!room.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                        <span className="bg-white px-6 py-2 rounded-full font-bold text-foreground tracking-wide">Fully Booked</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-20">
                      {room.amenities?.slice(0,3).map(amenity => (
                        <span key={amenity} className="text-xs bg-black/60 text-white backdrop-blur-md px-2.5 py-1 rounded-md">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{room.type}</p>
                        <h3 className="text-2xl font-display font-bold text-foreground">{room.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-foreground">${room.pricePerNight}</span>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Per Night</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">{room.description}</p>
                    
                    <div className="flex items-center gap-4 mb-6 text-sm text-foreground/80 font-medium">
                      <div className="flex items-center gap-1.5"><Users size={16} className="text-primary"/> up to {room.capacity}</div>
                      <div className="flex items-center gap-1.5"><Wifi size={16} className="text-primary"/> Free Wifi</div>
                      <div className="flex items-center gap-1.5"><Tv size={16} className="text-primary"/> Smart TV</div>
                    </div>

                    <Link 
                      href={`/book/${room.id}`}
                      className={`w-full block text-center py-3 rounded-lg font-semibold transition-all duration-300 ${
                        room.available 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30" 
                          : "bg-muted text-muted-foreground pointer-events-none"
                      }`}
                    >
                      {room.available ? "Book This Room" : "Unavailable"}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
