/**
 * PrivacyPolicyPage - Full privacy policy view with sections, actions, search.
 * Fetches policy on mount, renders with VersionBadge, Export PDF, DPA link.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PolicyContentRenderer } from './policy-content-renderer'
import { VersionBadge } from './version-badge'
import { ExportServiceButton } from './export-service-button'
import { DpaLink } from './dpa-link'
import { PolicySearch } from './policy-search'
import { AccessibilityAids } from './accessibility-aids'
import { fetchLatestPolicy } from '@/api/privacy-policy'
import type { Policy, PolicySection } from '@/types/privacy-policy'

const MAIN_CONTENT_ID = 'privacy-policy-main'

export function PrivacyPolicyPage() {
  const [sections, setSections] = useState<PolicySection[]>([])
  const [version, setVersion] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    fetchLatestPolicy()
      .then((policy: Policy) => {
        const safeSections = Array.isArray(policy?.sections) ? policy.sections : []
        setSections(safeSections)
        setVersion(policy?.version ?? '')
        setLastUpdated(policy?.lastUpdated ?? '')
        setHasError(false)
      })
      .catch(() => {
        setSections([])
        setVersion('')
        setLastUpdated('')
        setHasError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <nav
        className="border-b border-border bg-card"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Link
            to="/"
            className="font-bold text-xl text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            OfficeInventory AI
          </Link>
        </div>
      </nav>

      <AccessibilityAids mainContentId={MAIN_CONTENT_ID} showBreadcrumbs />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <Link to="/">
          <Button
            variant="ghost"
            className="mb-8 -ml-2"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden />
            Back
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
            Privacy Policy
          </h1>
          <VersionBadge
            version={version}
            lastUpdated={lastUpdated}
            className="mb-6"
          />
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <PolicySearch
              value={searchQuery}
              onChange={setSearchQuery}
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-3">
              <ExportServiceButton />
              <DpaLink />
            </div>
          </div>
        </header>

        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="pt-4"
          role="main"
          aria-label="Privacy policy content"
        >
          {isLoading && (
            <div
              className="space-y-6 animate-pulse"
              aria-busy="true"
              aria-live="polite"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-card shimmer" />
              ))}
            </div>
          )}

          {!isLoading && hasError && (
            <div
              className="rounded-2xl border border-border bg-card p-8 text-center"
              role="alert"
            >
              <p className="text-muted-foreground mb-4">
                Unable to load the privacy policy. Please try again later.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !hasError && (
            <div className="animate-fade-in-up">
              <PolicyContentRenderer
                sections={sections}
                searchQuery={searchQuery}
                filterBySearch={true}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
