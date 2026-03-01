/**
 * TermsOfServicePage - Full ToS view with sections, acceptance, download.
 * Fetches content on mount, renders with version badge, Download PDF, AcceptancePanel.
 */

import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentRichTextRenderer } from './content-rich-text-renderer'
import { VersionBadge } from './version-badge'
import { DownloadPDFButton } from './download-pdf-button'
import { AcceptancePanel } from './acceptance-panel'
import { ChangesBlock } from './changes-block'
import { ToSAccessibilityAids } from './tos-accessibility-aids'
import { useToSContentLoader } from './tos-content-loader'
import { useTermsAcceptance } from '@/hooks/use-terms-acceptance'

const MAIN_CONTENT_ID = 'tos-main'

export interface TermsOfServicePageProps {
  /** When true, show acceptance panel (e.g. signup flow) */
  requireAcceptance?: boolean
  /** User ID for backend acceptance sync */
  userId?: string | null
  /** When true, acceptance panel is sticky at bottom */
  acceptanceSticky?: boolean
}

export function TermsOfServicePage({
  requireAcceptance = false,
  userId,
  acceptanceSticky = false,
}: TermsOfServicePageProps) {
  const { content, history, isLoading, hasError } = useToSContentLoader()
  const acceptance = useTermsAcceptance({
    versionId: content?.versionId ?? '',
    userId,
    forceShow: false,
  })

  const sections = content?.contentSections ?? []
  const versionNumber = content?.versionNumber ?? ''
  const effectiveDate = content?.effectiveDate ?? ''
  const versionId = content?.versionId ?? ''

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

      <ToSAccessibilityAids mainContentId={MAIN_CONTENT_ID} showBreadcrumbs />

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
            Terms of Service
          </h1>
          <VersionBadge
            versionNumber={versionNumber}
            effectiveDate={effectiveDate}
            className="mb-6"
          />
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <DownloadPDFButton sections={sections} className="sm:max-w-fit" />
          </div>
        </header>

        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="pt-4"
          role="main"
          aria-label="Terms of Service content"
        >
          {isLoading && (
            <div
              className="space-y-6 animate-pulse"
              aria-busy="true"
              aria-live="polite"
            >
              {[1, 2, 3, 4, 5].map((i) => (
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
                Unable to load the Terms of Service. Please try again later or
                download the latest version.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <DownloadPDFButton />
              </div>
            </div>
          )}

          {!isLoading && !hasError && (
            <div className="animate-fade-in-up space-y-8">
              <ContentRichTextRenderer sections={sections} />

              <ChangesBlock
                history={history}
                currentVersion={versionNumber}
                effectiveDate={effectiveDate}
              />

              {requireAcceptance && versionId && !acceptance.isAccepted() && (
                <AcceptancePanel
                  acceptance={acceptance}
                  sticky={acceptanceSticky}
                />
              )}

              {!requireAcceptance && (
                <p className="text-sm text-muted-foreground">
                  By using OfficeInventory AI, you acknowledge that you have
                  read and agree to these Terms of Service. Download a copy above
                  if needed.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
