import { AppLayout } from "@/components/layout/AppLayout";
import { useListDining } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState } from "react";

const formatImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("/objects/")) return `/api/storage${url}`;
  return url;
};

const CATEGORIES = ["breakfast", "lunch", "dinner", "drinks", "dessert"];

export default function Dining() {
  const { data: menuItems, isLoading } = useListDining();
  const [activeCategory, setActiveCategory] = useState("dinner");

  const filteredItems = menuItems?.filter((item) => item.category === activeCategory) || [];

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="bg-secondary text-white py-32 relative overflow-hidden mt-16">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={`${import.meta.env.BASE_URL}images/dining-hero.png`} 
            alt="Fine Dining" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">Culinary Excellence</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Dining at The Grand</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Savor masterful creations by Michelin-starred chefs in an atmosphere of unparalleled elegance.
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-background py-24 min-h-[600px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-semibold tracking-wide capitalize transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded-xl" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-lg">
              No items available in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {filteredItems.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex flex-col gap-2 group"
                >
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex-1 border-b-2 border-dotted border-border relative top-[-6px]" />
                    <span className="text-lg font-semibold text-foreground">${item.price}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed pr-8">
                    {item.description}
                  </p>
                  
                  {!item.available && (
                    <span className="text-xs font-semibold text-destructive uppercase tracking-wider mt-1">
                      Currently Unavailable
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
