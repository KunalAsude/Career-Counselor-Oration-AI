import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { SignOutForm } from "./signout-form";

export default async function SignOutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="auth-page bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-purple-500/10 dark:to-blue-500/10"></div>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="auth-content p-4">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border shadow-2xl shadow-primary/20 dark:bg-white/95 dark:shadow-purple-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive rounded-full flex items-center justify-center mb-4">
              <LogOut className="h-8 w-8 text-destructive-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Sign Out</CardTitle>
            <CardDescription className="text-muted-foreground">
              Are you sure you want to sign out of Career Counselor?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignOutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
