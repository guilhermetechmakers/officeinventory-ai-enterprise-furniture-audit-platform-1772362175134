/**
 * DocumentationCenterRoot - Top-level page with global search, category filters, and content.
 */

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DocumentationProvider, useDocumentation } from '@/contexts/documentation-context'
import {
  SearchBar,
  CategoryFilterBar,
  DocumentationGrid,
  GuideCard,
  APIReferenceSection,
  FAQSection,
  ReleaseNotesSection,
  SupportWidget,
} from '@/components/documentation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Book, Code, HelpCircle, Megaphone, MessageCircle } from 'lucide-react'
import type { DocCategory } from '@/types/documentation'

function DocumentationCenterContent() {
  const {
    documents,
    guides,
    endpoints,
    faqs,
    releaseNotes,
    tickets,
    isLoading,
    error,
    searchDocuments,
    fetchDocuments,
    submitTicket,
  } = useDocumentation()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<DocCategory | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const safeDocuments = documents ?? []
  const safeGuides = guides ?? []
  const openTickets = (tickets ?? []).filter(
    (t) => t.status === 'open' || t.status === 'in_progress'
  )

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchQuery.trim()) {
        searchDocuments(searchQuery, activeCategory ?? undefined)
      } else {
        fetchDocuments(activeCategory ?? undefined)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [searchQuery, activeCategory, searchDocuments, fetchDocuments])

  const suggestions = useMemo(
    () =>
      safeDocuments.slice(0, 8).map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
      })),
    [safeDocuments]
  )

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again or contact support.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Documentation Center</h1>
        <p className="text-muted-foreground mt-1">
          Onboarding guides, API docs, FAQs, and support.
        </p>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={(q) => setSearchQuery(q)}
          suggestions={suggestions}
          onSelectSuggestion={(s) => setSearchQuery(s.title)}
        />
        <CategoryFilterBar
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex flex-wrap h-auto gap-2 rounded-2xl bg-[rgb(var(--primary-foreground))] p-2">
          <TabsTrigger value="overview" className="rounded-full">
            Overview
          </TabsTrigger>
          <TabsTrigger value="guides" className="rounded-full">
            <Book className="h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-full">
            <Code className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="faqs" className="rounded-full">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="release-notes" className="rounded-full">
            <Megaphone className="h-4 w-4" />
            Release Notes
          </TabsTrigger>
          <TabsTrigger value="support" className="rounded-full">
            <MessageCircle className="h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Documents</h2>
                <DocumentationGrid
                  documents={safeDocuments}
                  isLoading={isLoading}
                  emptyMessage="No documents match your search. Try a different term or category."
                  emptyAction={
                    <Link to="/help">
                      <span className="text-primary hover:underline">Clear filters</span>
                    </Link>
                  }
                />
              </div>
            </div>
            <div>
              <SupportWidget
                onCreateTicket={submitTicket}
                ticketCount={openTickets.length}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid gap-6">
            <h2 className="text-xl font-bold">Onboarding Guides</h2>
            {safeGuides.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {safeGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 py-12 px-6 text-center">
                <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No guides available.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">API Reference</h2>
            <APIReferenceSection endpoints={endpoints ?? []} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <FAQSection faqs={faqs ?? []} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="release-notes" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Release Notes</h2>
            <ReleaseNotesSection notes={releaseNotes ?? []} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <SupportWidget
              onCreateTicket={submitTicket}
              ticketCount={openTickets.length}
            />
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold mb-2">Support Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday–Friday: 9am–6pm EST
                <br />
                Email: support@officeinventory.ai
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function DocumentationCenterRoot() {
  return (
    <DocumentationProvider>
      <DocumentationCenterContent />
    </DocumentationProvider>
  )
}
