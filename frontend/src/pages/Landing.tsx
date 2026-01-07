import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MousePointerClick,
  CalendarCheck,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/calendar');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <Calendar className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-bold">Warm Calendar</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="shadow-md">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-28 md:pb-16 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple, Beautiful, Powerful</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Organize Your Time,{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            A beautiful calendar app to manage your events and schedule with ease.
            Stay organized and never miss what matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all">
              <Link to="/auth?mode=signup" className="flex items-center gap-2">
                Start for Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-12 pt-6 border-t border-border/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">Free</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">∞</div>
              <div className="text-xs text-muted-foreground">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-xs text-muted-foreground">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-sm">
              Powerful features in a simple interface
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Clock, title: 'Smart Scheduling', desc: 'Recurring events, reminders, and time management' },
              { icon: MousePointerClick, title: 'Drag & Drop', desc: 'Reschedule events instantly by dragging' },
              { icon: Palette, title: 'Color Coding', desc: 'Organize events by category with colors' },
              { icon: CalendarCheck, title: 'Multiple Views', desc: 'Switch between month and week views' },
              { icon: Users, title: 'Meeting Links', desc: 'Add Zoom, Meet, or Teams links' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Instant loading and real-time updates' },
            ].map((feature, index) => (
              <div key={index} className="group bg-background p-4 md:p-6 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works + Benefits Combined */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* How It Works */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">
                Get started in seconds
              </h2>
              <div className="space-y-4">
                {[
                  { num: '1', title: 'Create Account', desc: 'Sign up with email or Google' },
                  { num: '2', title: 'Add Events', desc: 'Click any date to add events' },
                  { num: '3', title: 'Stay Organized', desc: 'Manage your schedule anywhere' },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-0.5">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">
                Why choose us?
              </h2>
              <div className="space-y-3">
                {[
                  "Completely free - no hidden costs",
                  "Works on all devices",
                  "No ads or trackers",
                  "Automatic data backup",
                  "Clean, modern design",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm md:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-8 md:p-10 border border-primary/20">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Ready to get organized?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Start your journey to better time management today.
            </p>
            <Button size="lg" asChild className="shadow-lg">
              <Link to="/auth?mode=signup" className="flex items-center gap-2">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-serif font-semibold text-sm">Warm Calendar</span>
            </div>
            <div className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Warm Calendar. Made with ❤️
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}