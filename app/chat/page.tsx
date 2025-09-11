import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      </div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">AI Career Chat</h1>
            </div>
          </div>

          {/* Welcome Card */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-purple-300" />
                Welcome to Your AI Career Counselor
              </CardTitle>
              <CardDescription className="text-gray-300">
                Hello {session.user?.name}! Your AI career counselor is ready to help you with personalized advice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-300">
                  This is your personal career counseling session. The AI counselor will help you with:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Career path planning and advice</li>
                  <li>Resume and cover letter review</li>
                  <li>Interview preparation</li>
                  <li>Job search strategies</li>
                  <li>Professional development guidance</li>
                </ul>
                <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <p className="text-purple-200 font-medium">
                    💡 Tip: Start by telling the AI about your current career situation or goals!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface Placeholder */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl mt-6">
            <CardHeader>
              <CardTitle>Chat Interface</CardTitle>
              <CardDescription className="text-gray-300">
                The full chat interface will be implemented here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                <p className="text-gray-400">Chat interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}