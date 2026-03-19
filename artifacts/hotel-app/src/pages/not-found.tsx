import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
