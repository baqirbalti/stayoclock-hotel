import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useListRooms } from "@workspace/api-client-react";
import { getRoomImage } from "@/lib/unsplash";
import { Users, Wifi, Tv, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Room } from "@workspace/api-client-react";

const formatImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("/objects/")) return `/api/storage${url}`;
  return url;
};

function RoomCarousel({ room }: { room: Room }) {
  const images = room.images && room.images.length > 0 
    ? room.images.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(img => formatImageUrl(img.imageUrl))
    : [getRoomImage(room.id, room.imageUrl)];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link click if wrapped
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-72 overflow-hidden bg-muted group/carousel">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${room.name} image ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </AnimatePresence>

      {!room.available && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
          <span className="bg-white px-6 py-2 rounded-full font-bold text-foreground tracking-wide">Fully Booked</span>
        </div>
      )}

      {/* Image Counter Badge */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 z-20">
          <ImageIcon size={14} />
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all z-20"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-20 pointer-events-none">
        {room.amenities?.slice(0,3).map(amenity => (
          <span key={amenity} className="text-xs bg-black/60 text-white backdrop-blur-md px-2.5 py-1 rounded-md">
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Rooms() {
  const { data: rooms, isLoading } = useListRooms();

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="bg-foreground text-white py-24 relative overflow-hidden mt-16">
        <div className="absolute inset-0 opacity-20">
          {/* rooms hero scenic luxury hotel room interior */}
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
                  <RoomCarousel room={room} />
                  
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
