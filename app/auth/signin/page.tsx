"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Chrome, Loader2, Mail, Lock, User } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    const getProvidersData = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    getProvidersData();
  }, []);

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <Chrome className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleOAuthSignIn = async (providerId: string) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn(providerId, {
        callbackUrl: '/chat',
        redirect: false
      });

      if (result?.error) {
        setError("Failed to sign in. Please try again.");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: signInData.email,
        password: signInData.password,
        callbackUrl: '/chat',
        redirect: false
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: signUpData.email,
        password: signUpData.password,
        callbackUrl: '/chat',
        redirect: false
      });

      if (result?.error) {
        setError("Account created but failed to sign in. Please try signing in manually.");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-purple-500/10 dark:to-blue-500/10"></div>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="auth-content p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side - Hero Content */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2">
                <Github className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI-Powered Career Guidance</span>
              </div>

              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Your AI Career
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 dark:from-purple-400 dark:to-pink-400">
                  {" "}Counselor
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Get personalized career advice, resume help, interview preparation, and professional guidance
                from our advanced AI counselor. Available 24/7 to support your career journey.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                <Chrome className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-foreground mb-1">Smart AI</h3>
                <p className="text-sm text-muted-foreground">Advanced AI for personalized advice</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                <User className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-foreground mb-1">Career Focus</h3>
                <p className="text-sm text-muted-foreground">Tailored to your career goals</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 mt-5">
            <Card className="bg-card/95 backdrop-blur-xl border-border shadow-2xl shadow-primary/20 dark:bg-white/95 dark:shadow-purple-500/20">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-primary dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-xl">C</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Career Counselor AI</h1>
                    <p className="text-sm text-muted-foreground">Your AI Career Guide</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border p-1 rounded-lg backdrop-blur-sm">
                    <TabsTrigger
                      value="signin"
                      className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border transition-all duration-200 text-muted-foreground data-[state=active]:font-medium"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border transition-all duration-200 text-muted-foreground data-[state=active]:font-medium"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4 mt-6">
                    {error && (
                      <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
                        <AlertDescription className="text-destructive">{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* OAuth Providers */}
                    {providers &&
                      Object.values(providers)
                        .filter((provider: Provider) => provider.id !== "credentials")
                        .map((provider: Provider) => (
                          <Button
                            key={provider.name}
                            onClick={() => handleOAuthSignIn(provider.id)}
                            disabled={loading}
                            className="w-full bg-card hover:bg-card/80 text-card-foreground border border-border h-12 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                            variant="outline"
                          >
                            {loading ? (
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            ) : (
                              getProviderIcon(provider.id)
                            )}
                            <span className="ml-2 font-medium">
                              {loading ? "Signing in..." : `Continue with ${provider.name}`}
                            </span>
                          </Button>
                        ))}

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with email</span>
                      </div>
                    </div>

                    {/* Email/Password Sign In */}
                    <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-foreground font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 h-12 border-border focus:border-primary focus:ring-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                            value={signInData.email}
                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-foreground font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-12 border-border focus:border-primary focus:ring-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                            value={signInData.password}
                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 mt-6">
                    {error && (
                      <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
                        <AlertDescription className="text-destructive">{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-foreground font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 h-12 border-border focus:border-primary focus:ring-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                            value={signUpData.name}
                            onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-foreground font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 h-12 border-border focus:border-primary focus:ring-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-foreground font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            className="pl-10 h-12 border-border focus:border-primary focus:ring-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-foreground font-medium">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm-password"
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10 h-12 border-border focus:border-primary focus:ring-primary transition-colors bg-background text-foreground placeholder:text-muted-foreground"
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline">
                        Privacy Policy
                      </a>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
