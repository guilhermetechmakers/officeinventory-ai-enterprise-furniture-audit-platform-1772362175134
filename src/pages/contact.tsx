import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Link to="/" className="font-bold text-xl">
            OfficeInventory AI
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-2xl px-4 py-24">
        <h1 className="text-3xl font-bold mb-4">Contact sales</h1>
        <p className="text-muted-foreground mb-8">
          Get in touch with our team to learn more about OfficeInventory AI.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Request a demo</CardTitle>
            <CardDescription>We&apos;ll get back to you within 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input placeholder="Your company" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                className="flex min-h-[120px] w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm"
                placeholder="Tell us about your needs..."
              />
            </div>
            <Button className="w-full rounded-full">
              <Mail className="h-4 w-4 mr-2" />
              Send message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
