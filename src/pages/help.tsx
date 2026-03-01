import { Link } from 'react-router-dom'
import { Book, FileText, Mail } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const helpSections = [
  { icon: Book, title: 'Documentation', description: 'Searchable docs and capture guides' },
  { icon: FileText, title: 'API docs', description: 'Developer documentation' },
  { icon: Mail, title: 'Support', description: 'Contact support for help' },
]

export function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Link to="/" className="font-bold text-xl">
            OfficeInventory AI
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-4 py-24">
        <h1 className="text-3xl font-bold mb-4">Help & Documentation</h1>
        <p className="text-muted-foreground mb-12">
          Find guides, API documentation, and get support.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {helpSections.map((section) => (
            <Card key={section.title} className="hover:shadow-elevated transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 mb-2">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
