import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, Users, TrendingUp, Brain, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 text-center">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Smart Career Guidance</span>
          </div>

          <h2 className="text-6xl font-bold text-foreground leading-tight mb-6">
            Your Career
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 block">
              Counselor
            </span>
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            Get personalized career advice, resume help, interview preparation, and professional guidance
            from our advanced counselor. Available 24/7 to support your career journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 shadow-2xl hover:shadow-primary/25 transition-all duration-300">
                Start Your Career Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-background/10 border-border text-foreground hover:bg-accent font-semibold text-lg px-8 py-4">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/50 backdrop-blur-xl border-border text-card-foreground hover:bg-card/80 transition-all duration-300 group">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Career Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-base">
                Get personalized advice on career paths, job transitions, and professional development
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border text-card-foreground hover:bg-card/80 transition-all duration-300 group">
            <CardHeader>
              <Brain className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Smart Counselor</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-base">
                Advanced counselor that understands your unique career situation and provides tailored recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border text-card-foreground hover:bg-card/80 transition-all duration-300 group">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground text-base">
                Access your counselor anytime, anywhere. Continue conversations and get instant responses
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Advance Your Career?
          </h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Join thousands of professionals who have transformed their careers with smart guidance.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 shadow-2xl hover:shadow-primary/25 transition-all duration-300">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-card/20 backdrop-blur-sm border-t border-border py-8 mt-16">
        <div className="container mx-auto px-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Career Counselor</span>
          </div>
          <p className="text-muted-foreground">
            Empowering careers with smart guidance for career success
          </p>
        </div>
      </footer>
    </div>
  );
}
