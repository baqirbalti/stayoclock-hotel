import { Link } from "wouter";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-white mb-4">The Grand</h3>
            <p className="text-secondary-foreground/70 leading-relaxed mb-6">
              Experience unrivaled luxury and impeccable service at the world's most prestigious hospitality destination.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-secondary-foreground/70 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="text-secondary-foreground/70 hover:text-primary transition-colors">Accommodations</Link></li>
              <li><Link href="/bookings" className="text-secondary-foreground/70 hover:text-primary transition-colors">My Bookings</Link></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Dining</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-secondary-foreground/70">
                <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                <span>123 Luxury Avenue<br/>Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Phone size={20} className="text-primary shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Mail size={20} className="text-primary shrink-0" />
                <span>concierge@thegrand.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-secondary-foreground/50">
          <p>&copy; {new Date().getFullYear()} The Grand Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
