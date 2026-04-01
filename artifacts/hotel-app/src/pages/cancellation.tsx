import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function Cancellation() {
  return (
    <AppLayout>
      <div className="bg-foreground text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Cancellation Policy</h1>
          <p className="text-white/70">We make cancellations simple and transparent.</p>
        </div>
      </div>

      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* At a Glance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <CheckCircle2 className="text-green-600 mx-auto mb-3" size={40} />
              <h3 className="font-display font-bold text-lg text-green-900 mb-2">Free Cancellation</h3>
              <p className="text-green-800 text-sm">Cancel more than 48 hours before check-in for a full refund with no penalty.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <AlertCircle className="text-amber-600 mx-auto mb-3" size={40} />
              <h3 className="font-display font-bold text-lg text-amber-900 mb-2">Within 48 Hours</h3>
              <p className="text-amber-800 text-sm">Cancellations within 48 hours of check-in will incur a one-night's room charge.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <XCircle className="text-red-600 mx-auto mb-3" size={40} />
              <h3 className="font-display font-bold text-lg text-red-900 mb-2">No-Show</h3>
              <p className="text-red-800 text-sm">Failure to arrive without prior cancellation may result in the full stay being charged.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">Standard Cancellation Terms</h2>
              <p className="text-muted-foreground mb-4">Our standard cancellation policy applies to most bookings made directly through The Grand Hotel:</p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Cancellation Timing</th>
                      <th className="text-left p-4 font-semibold text-foreground">Refund</th>
                      <th className="text-left p-4 font-semibold text-foreground">Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border bg-green-50/50">
                      <td className="p-4 font-medium text-foreground">More than 48 hours before check-in</td>
                      <td className="p-4 text-green-700 font-semibold">100% Refund</td>
                      <td className="p-4 text-muted-foreground">None</td>
                    </tr>
                    <tr className="border-t border-border bg-amber-50/50">
                      <td className="p-4 font-medium text-foreground">24–48 hours before check-in</td>
                      <td className="p-4 text-amber-700 font-semibold">Partial Refund</td>
                      <td className="p-4 text-muted-foreground">1 night's rate charged</td>
                    </tr>
                    <tr className="border-t border-border bg-red-50/50">
                      <td className="p-4 font-medium text-foreground">Less than 24 hours before check-in</td>
                      <td className="p-4 text-red-700 font-semibold">No Refund</td>
                      <td className="p-4 text-muted-foreground">Full first night charged</td>
                    </tr>
                    <tr className="border-t border-border bg-red-50/70">
                      <td className="p-4 font-medium text-foreground">No-show (no prior cancellation)</td>
                      <td className="p-4 text-red-700 font-semibold">No Refund</td>
                      <td className="p-4 text-muted-foreground">Full stay may be charged</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">How to Cancel</h2>
              <p className="text-muted-foreground mb-4">You can cancel your reservation in two ways:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-2">Online via My Bookings</h3>
                  <p className="text-muted-foreground text-sm">Visit the <Link href="/bookings" className="text-primary hover:underline">My Bookings</Link> page, find your reservation, and select "Cancel Booking." The system will process your cancellation immediately.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-2">Contact Our Front Desk</h3>
                  <p className="text-muted-foreground text-sm">Call +1 (800) 123-4567 (available 24/7) or email reservations@thegrand.com with your booking reference number.</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">Special Event & Non-Refundable Rates</h2>
              <p className="text-muted-foreground">During peak seasons, holidays, and special events (New Year's Eve, major city events, etc.), separate cancellation terms apply:</p>
              <ul className="space-y-2 text-muted-foreground mt-4">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Non-Refundable Rates:</strong> Some promotional rates are non-refundable regardless of cancellation timing. This will be clearly stated at booking.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Special Event Periods:</strong> Full stay may be charged for cancellations within 7 days of check-in.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Group Bookings (5+ rooms):</strong> Separate terms apply — please contact our Events team.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">Refund Processing</h2>
              <p className="text-muted-foreground">Approved refunds are processed within <strong>5–10 business days</strong>. The time it takes for the refund to appear in your account may vary depending on your bank or payment provider. Refunds are issued to the original payment method.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">Modifications to Your Stay</h2>
              <p className="text-muted-foreground">Requests to modify your check-in or check-out dates are subject to room availability and may result in a rate adjustment. Modifications are not guaranteed and must be confirmed by our reservations team.</p>
            </section>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
