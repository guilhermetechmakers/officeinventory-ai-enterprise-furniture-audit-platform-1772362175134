import { Link } from 'react-router-dom'
import { Camera, Sparkles, CheckSquare, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
const valueProps = [
  {
    icon: Camera,
    title: 'Capture',
    description: 'Mobile-first, offline-tolerant photo capture with resumable uploads and batch metadata.',
  },
  {
    icon: Sparkles,
    title: 'AI Detection',
    description: 'Pluggable vision APIs detect furniture, extract attributes, and produce evidence-backed detections.',
  },
  {
    icon: CheckSquare,
    title: 'Review',
    description: 'Confidence-driven review queue with human-in-the-loop validation and audit trails.',
  },
  {
    icon: FileText,
    title: 'Reporting',
    description: 'Export-ready CSV/PDF outputs and analytics for procurement and ESG reporting.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient hero background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>

      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-bold text-xl text-foreground">
            OfficeInventory AI
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-slide-up">
            AI-powered furniture audit
            <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              for enterprise portfolios
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Inventory, assess, and report on office furniture across multi-site corporate portfolios. 
            Photo-based capture, AI detection, and confidence-driven review—all in one platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 text-base">
                Request demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value proposition cards - Bento grid */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-foreground mb-4">
            Built for enterprise scale
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            From capture to export—every step designed for field teams, reviewers, and procurement.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((item, i) => (
              <Card
                key={item.title}
                className="group transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center shadow-card">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Ready to transform your furniture audits?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join facilities teams, space planners, and auditors who save 50%+ time on inventories.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8">
                Start free trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Contact sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OfficeInventory AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
