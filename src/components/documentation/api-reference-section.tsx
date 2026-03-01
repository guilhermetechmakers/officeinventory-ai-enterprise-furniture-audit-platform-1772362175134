/**
 * APIReferenceSection - Interactive API docs with endpoints and code samples.
 */

import { useState } from 'react'
import { Code, Copy, Check } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ApiEndpoint } from '@/types/documentation'

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-info/20 text-info',
    POST: 'bg-primary/20 text-primary-foreground',
    PUT: 'bg-warning/20 text-foreground',
    PATCH: 'bg-warning/20 text-foreground',
    DELETE: 'bg-destructive/20 text-destructive',
  }
  return (
    <Badge className={cn('font-mono text-xs', colors[method] ?? 'bg-muted')}>
      {method}
    </Badge>
  )
}

function CodeBlock({ code, onCopy }: { code: string; onCopy?: () => void }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }
  return (
    <div className="relative group">
      <pre className="rounded-xl bg-[rgb(var(--primary-foreground))] text-secondary p-4 text-sm overflow-x-auto">
        <code className="text-[rgb(var(--secondary))]">{code}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-secondary/20 text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

export interface APIReferenceSectionProps {
  endpoints: ApiEndpoint[]
  isLoading?: boolean
  className?: string
}

export function APIReferenceSection({
  endpoints,
  isLoading = false,
  className,
}: APIReferenceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<Record<string, number>>({})
  const safeEndpoints = endpoints ?? []

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (safeEndpoints.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-dashed border-border bg-card/50 py-12 px-6 text-center', className)}>
        <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No API endpoints documented yet.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {safeEndpoints.map((ep: ApiEndpoint) => {
        const isExpanded = expandedId === ep.id
        const examples = ep.examples ?? []
        const safeExamples = Array.isArray(examples) ? examples : []
        const exampleIndex = selectedExampleIndex[ep.id] ?? 0
        const currentExample = safeExamples[exampleIndex] ?? safeExamples[0]
        const params = ep.parameters ?? []
        const safeParams = Array.isArray(params) ? params : []

        return (
          <Card key={ep.id} className="overflow-hidden">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => setExpandedId(isExpanded ? null : ep.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MethodBadge method={ep.method} />
                  <span className="font-mono text-sm">{ep.path}</span>
                  <span className="font-medium">{ep.name}</span>
                </div>
              </CardHeader>
            </button>
            {isExpanded && (
              <CardContent className="pt-0 space-y-4 animate-fade-in">
                <p className="text-sm text-muted-foreground">{ep.description}</p>

                {safeParams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Parameters</h4>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Required</th>
                            <th className="px-4 py-2 text-left">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {safeParams.map((p) => (
                            <tr key={p.name} className="border-t border-border">
                              <td className="px-4 py-2 font-mono">{p.name}</td>
                              <td className="px-4 py-2">{p.type}</td>
                              <td className="px-4 py-2">{p.required ? 'Yes' : 'No'}</td>
                              <td className="px-4 py-2 text-muted-foreground">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {safeExamples.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Example</h4>
                      {safeExamples.length > 1 && (
                        <div className="flex gap-1">
                          {safeExamples.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedExampleIndex((s) => ({ ...s, [ep.id]: i }))
                              }}
                              className={cn(
                                'px-2 py-1 rounded text-xs',
                                i === exampleIndex
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted/50 hover:bg-muted'
                              )}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <CodeBlock code={currentExample ?? ''} />
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
