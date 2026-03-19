import { Link, useLocation } from "wouter";
import { Menu, X, BedDouble } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/rooms", label: "Accommodations" },
    { href: "/bookings", label: "My Bookings" },
  ];

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo.png`} 
            alt="The Grand Hotel" 
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`font-display font-bold text-2xl tracking-wide ${isScrolled ? "text-foreground" : "text-foreground drop-shadow-md"}`}>
            The Grand
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-medium tracking-wide transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : isScrolled ? "text-foreground/80" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/rooms"
            className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-xl md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-lg font-medium ${
                    location === link.href ? "bg-primary/10 text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href="/rooms"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-center bg-primary text-primary-foreground font-semibold rounded-lg mt-2"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
