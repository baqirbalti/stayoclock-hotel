import { Link } from "wouter";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArrowRight, Star, Coffee, Wifi, Shield } from "lucide-react";
import { useListRooms } from "@workspace/api-client-react";
import { getRoomImage } from "@/lib/unsplash";

export default function Home() {
  const { data: rooms, isLoading } = useListRooms();
  const featuredRooms = rooms?.slice(0, 3) || [];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* landing page hero scenic luxury hotel facade pool */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy/60 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src="https://pixabay.com/get/ge25fa4408cd9493a0134f1887b20a2a4845873db64fd60f1990accc2d3580deecbe4ee592dc87f03a96635f1135718b65d08a5936ccbe8b16004a7ef2071059a_1280.jpg" 
            alt="The Grand Hotel Exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white/90 text-sm tracking-widest uppercase mb-6">
              A World of Distinction
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 drop-shadow-lg leading-tight">
              Experience <br className="hidden md:block"/> Unrivaled Luxury.
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-10 drop-shadow-md">
              Discover an oasis of tranquility where impeccable service meets architectural brilliance in the heart of the city.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/rooms" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-white hover:text-foreground transition-colors duration-300 shadow-xl shadow-primary/20 text-lg"
              >
                Reserve Your Stay
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Amenities Highlights */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Curated Experiences</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Star, title: "Five-Star Service", desc: "Dedicated concierge at your beck and call 24/7." },
              { icon: Coffee, title: "Fine Dining", desc: "Michelin-starred chefs crafting culinary masterpieces." },
              { icon: Shield, title: "Utmost Privacy", desc: "Discreet and secure environments for VIP guests." },
              { icon: Wifi, title: "Modern Comforts", desc: "High-speed connectivity and smart room controls." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-2 block">Our Signature</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">Accommodations</h2>
            </div>
            <Link href="/rooms" className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group">
              View All Rooms <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room, i) => (
                <motion.div 
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="group rounded-2xl overflow-hidden shadow-lg border border-border bg-card flex flex-col hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={getRoomImage(room.id, room.imageUrl)} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold text-foreground shadow-sm">
                      ${room.pricePerNight} <span className="text-sm font-normal text-muted-foreground">/ night</span>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="uppercase tracking-widest text-xs font-bold text-primary mb-2">{room.type}</div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-3">{room.name}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-6 flex-1">{room.description}</p>
                    <Link 
                      href={`/book/${room.id}`}
                      className="w-full py-3 text-center border-2 border-foreground text-foreground font-semibold rounded-lg hover:bg-foreground hover:text-white transition-colors duration-300"
                    >
                      Reserve
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
