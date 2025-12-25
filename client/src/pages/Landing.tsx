import { Button } from "@/components/ui/button";
import { Activity, Music, Sparkles, Shield, Zap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10 pointer-events-none" />
      
      <header className="relative z-10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">DAiW</span>
        </div>
        
        <a href="/api/login" data-testid="button-login">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </a>
      </header>

      <main className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
            Digital AI Workstation
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            A musical intention engine for generative AI music models. Compose visually, export structured prompts for Suno, Udio, and more.
          </p>
          <a href="/api/login" data-testid="button-get-started">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Composition</h3>
            <p className="text-white/50 text-sm">
              Design musical intentions through intuitive lane-based visualization and timeline arrangement.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered QA</h3>
            <p className="text-white/50 text-sm">
              Built-in AI assistant monitors your workflow, checks functionality, and suggests improvements.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-white/50 text-sm">
              Your projects and files are protected with user isolation and secure authentication.
            </p>
          </div>
        </div>

        <div className="text-center text-white/40 text-sm">
          <p>Sign in with Google, GitHub, Apple, or email to save your projects</p>
        </div>
      </main>
    </div>
  );
}
