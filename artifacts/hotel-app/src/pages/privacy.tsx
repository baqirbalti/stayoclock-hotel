import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <AppLayout>
      <div className="bg-foreground text-white py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/70">Last updated: January 1, 2025</p>
        </div>
      </div>

      <div className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none text-foreground">

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
              <p className="text-foreground/80 leading-relaxed m-0">
                At The Grand Hotel, we are committed to protecting your personal information and your right to privacy. This policy explains what information we collect, how we use it, and what rights you have in relation to it.
              </p>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information you provide directly when making a reservation or contacting us:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Personal Identification:</strong> Full name and email address when making a booking.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Booking Information:</strong> Room preferences, check-in/check-out dates, and special requests.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Communication Data:</strong> Messages you send us through our contact channels.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Technical Data:</strong> IP address, browser type, and device information collected automatically.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Process and manage your hotel reservations</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Send booking confirmations and important updates</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Improve our services and personalize your experience</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Respond to your inquiries and provide customer support</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span>Comply with legal obligations and prevent fraud</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">3. Data Storage and Security</h2>
              <p className="text-muted-foreground">We implement industry-standard security measures to protect your personal information. Your data is stored on secure servers and is only accessible to authorized personnel. We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, typically up to 7 years for booking records to comply with financial regulations.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">4. Cookies</h2>
              <p className="text-muted-foreground">We use cookies and similar tracking technologies to enhance your browsing experience on our website. These include:</p>
              <ul className="space-y-2 text-muted-foreground mt-4">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Essential Cookies:</strong> Required for the website to function properly.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Analytics Cookies:</strong> Help us understand how visitors use our site.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Preference Cookies:</strong> Remember your settings and preferences.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">5. Your Rights (GDPR)</h2>
              <p className="text-muted-foreground mb-4">Under the General Data Protection Regulation (GDPR), if you are in the European Economic Area, you have the following rights:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Right to Erasure:</strong> Request deletion of your personal data in certain circumstances.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</span></li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-1">•</span><span><strong>Right to Object:</strong> Object to processing of your personal data.</span></li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">6. Third-Party Sharing</h2>
              <p className="text-muted-foreground">We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist in operating our website and services, subject to confidentiality agreements.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4 pb-2 border-b border-border">7. Contact Us</h2>
              <p className="text-muted-foreground">If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer:</p>
              <div className="bg-card border border-border rounded-xl p-6 mt-4">
                <p className="text-foreground font-semibold">The Grand Hotel — Data Protection Officer</p>
                <p className="text-muted-foreground">123 Luxury Avenue, Beverly Hills, CA 90210</p>
                <p className="text-muted-foreground">Email: privacy@thegrand.com</p>
                <p className="text-muted-foreground">Phone: +1 (800) 123-4567</p>
              </div>
            </section>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/cancellation" className="text-primary hover:underline font-medium">Cancellation Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
