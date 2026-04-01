import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";

export default function Terms() {
  return (
    <AppLayout>
      <div className="bg-foreground text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Terms of Service</h1>
          <p className="text-white/70">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none text-foreground">

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
              <p className="text-foreground/80 leading-relaxed m-0">
                By making a reservation or using the services of The Grand Hotel, you agree to be bound by these Terms of Service. Please read them carefully before completing your booking.
              </p>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">1. Reservations and Bookings</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>All reservations are subject to room availability and confirmation by The Grand Hotel.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>A valid email address is required to receive booking confirmations and updates.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>The hotel reserves the right to refuse or cancel reservations at its discretion.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Booking a room constitutes agreement to the rate and dates specified at the time of reservation.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">2. Check-In and Check-Out</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Standard Check-In:</strong> 3:00 PM on the day of arrival. Early check-in is subject to availability and may incur additional charges.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Standard Check-Out:</strong> 11:00 AM on the day of departure. Late check-out is subject to availability and may incur additional charges (typically 50% of the nightly rate until 3:00 PM, full rate thereafter).</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>A valid government-issued photo ID is required at check-in.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>A credit card authorization hold may be placed at check-in for incidentals.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">3. Cancellation Policy</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
                <p className="text-amber-900 font-semibold mb-2">Standard Cancellation Terms:</p>
                <ul className="space-y-1 text-amber-800 text-sm">
                  <li>• <strong>Free cancellation:</strong> Up to 48 hours before check-in</li>
                  <li>• <strong>Within 48 hours:</strong> First night's stay charged</li>
                  <li>• <strong>No-show:</strong> Full reservation amount may be charged</li>
                </ul>
              </div>
              <p className="text-muted-foreground">See our <Link href="/cancellation" className="text-primary hover:underline">full Cancellation Policy</Link> for complete details, special event rates, and non-refundable rate terms.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">4. Guest Conduct and Responsibilities</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Guests are responsible for any damage caused to hotel property during their stay.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>The hotel operates a strict non-smoking policy in all indoor areas. Violations may result in a $500 cleaning fee.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Pets are not permitted unless specifically designated as a pet-friendly booking.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Guests must respect quiet hours (11:00 PM – 7:00 AM) and fellow guests.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>The hotel reserves the right to remove guests who violate these policies without refund.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">5. Pricing and Taxes</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>All rates are quoted in US Dollars (USD) per room per night.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Applicable taxes and service charges will be added to your final bill.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Rates may vary based on seasonality, demand, and availability.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>The hotel is not responsible for rate discrepancies arising from third-party booking platforms.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">6. Liability Limitation</h2>
              <p className="text-muted-foreground">The Grand Hotel shall not be liable for any indirect, incidental, or consequential damages arising from your stay. Our liability is limited to the amount paid for the booking in question. The hotel is not responsible for loss or theft of personal property unless it was stored in the hotel's secure facilities.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">7. Amendments</h2>
              <p className="text-muted-foreground">The Grand Hotel reserves the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the new terms.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">8. Contact</h2>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-foreground font-semibold">The Grand Hotel — Guest Relations</p>
                <p className="text-muted-foreground">123 Luxury Avenue, Beverly Hills, CA 90210</p>
                <p className="text-muted-foreground">Email: legal@thegrand.com | Phone: +1 (800) 123-4567</p>
              </div>
            </section>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/cancellation" className="text-primary hover:underline font-medium">Cancellation Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
