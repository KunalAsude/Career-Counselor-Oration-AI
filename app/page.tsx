import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, Users, TrendingUp, Brain, Target, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      {/* Header */}
  <header className="relative z-10 container mx-auto px-2 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Career Counselor AI</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
  <main className="relative z-10 container mx-auto px-2 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-medium text-white">AI-Powered Career Guidance</span>
          </div>

          <h2 className="text-6xl font-bold text-white leading-tight mb-6">
            Your AI Career
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 block">
              Counselor
            </span>
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
            Get personalized career advice, resume help, interview preparation, and professional guidance
            from our advanced AI counselor. Available 24/7 to support your career journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                Start Your Career Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold text-lg px-8 py-4">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-300 mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Career Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Get personalized advice on career paths, job transitions, and professional development
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
            <CardHeader>
              <Brain className="h-12 w-12 text-purple-300 mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">Smart AI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Advanced AI that understands your unique career situation and provides tailored recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 transition-all duration-300 group">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-300 mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl">24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">
                Access your AI counselor anytime, anywhere. Continue conversations and get instant responses
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h3>
          <p className="text-gray-300 mb-6 text-lg">
            Join thousands of professionals who have transformed their careers with AI-powered guidance.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-8 mt-16">
  <div className="container mx-auto px-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Career Counselor AI</span>
          </div>
          <p className="text-gray-400">
            Empowering careers with AI-powered guidance • Made with ❤️ for career success
          </p>
        </div>
      </footer>
    </div>
  );
}
