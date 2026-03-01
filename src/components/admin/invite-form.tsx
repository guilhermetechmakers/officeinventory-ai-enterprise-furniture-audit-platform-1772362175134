import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, UserPlus, FileSpreadsheet } from 'lucide-react'
import { ValidationErrorTooltip } from './validation-error-tooltip'
import { ConfirmDialog } from './confirm-dialog'
import type { Tenant, Role } from '@/types/admin'

const singleInviteSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Valid email required'),
  tenantId: z.string().min(1, 'Tenant is required'),
  role: z.string().min(1, 'Role is required'),
})

type SingleInviteFormValues = z.infer<typeof singleInviteSchema>

export interface InviteFormProps {
  tenants: Tenant[]
  roles: Role[]
  onSingleInvite: (values: SingleInviteFormValues) => Promise<void>
  onBulkInvite: (invites: Array<{ name: string; email: string; tenantId: string; role: string }>) => Promise<void>
  isSinglePending?: boolean
  isBulkPending?: boolean
}

const CSV_REQUIRED_COLUMNS = ['name', 'email', 'tenantId', 'role']

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length === 0) return []
  return lines.map((line) => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        inQuotes = !inQuotes
      } else if ((c === ',' && !inQuotes) || c === '\t') {
        result.push(current.trim())
        current = ''
      } else {
        current += c
      }
    }
    result.push(current.trim())
    return result
  })
}

function validateCSV(rows: string[][]): { valid: boolean; invites: Array<{ name: string; email: string; tenantId: string; role: string }>; errors: string[] } {
  const errors: string[] = []
  const invites: Array<{ name: string; email: string; tenantId: string; role: string }> = []

  if (rows.length < 2) {
    return { valid: false, invites: [], errors: ['CSV must have a header row and at least one data row'] }
  }

  const header = rows[0].map((h) => h.toLowerCase().replace(/\s/g, ''))
  const nameIdx = header.findIndex((h) => h === 'name')
  const emailIdx = header.findIndex((h) => h === 'email')
  const tenantIdx = header.findIndex((h) => h === 'tenantid')
  const roleIdx = header.findIndex((h) => h === 'role')

  if (nameIdx < 0 || emailIdx < 0 || tenantIdx < 0 || roleIdx < 0) {
    return {
      valid: false,
      invites: [],
      errors: [`Required columns: ${CSV_REQUIRED_COLUMNS.join(', ')}`],
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const name = (row[nameIdx] ?? '').trim()
    const email = (row[emailIdx] ?? '').trim()
    const tenantId = (row[tenantIdx] ?? '').trim()
    const role = (row[roleIdx] ?? '').trim()

    if (!name || !email || !tenantId || !role) {
      errors.push(`Row ${i + 1}: All fields required`)
      continue
    }
    if (!emailRegex.test(email)) {
      errors.push(`Row ${i + 1}: Invalid email format`)
      continue
    }
    invites.push({ name, email, tenantId, role })
  }

  return { valid: errors.length === 0, invites, errors }
}

export function InviteForm({
  tenants,
  roles,
  onSingleInvite,
  onBulkInvite,
  isSinglePending = false,
  isBulkPending = false,
}: InviteFormProps) {
  const safeTenants = Array.isArray(tenants) ? tenants : []
  const safeRoles = Array.isArray(roles) ? roles : []

  const form = useForm<SingleInviteFormValues>({
    resolver: zodResolver(singleInviteSchema),
    defaultValues: {
      name: '',
      email: '',
      tenantId: safeTenants[0]?.id ?? '',
      role: safeRoles[0]?.name ?? '',
    },
  })

  React.useEffect(() => {
    if (safeTenants.length > 0 && !form.getValues('tenantId')) {
      form.setValue('tenantId', safeTenants[0].id)
    }
    if (safeRoles.length > 0 && !form.getValues('role')) {
      form.setValue('role', safeRoles[0].name)
    }
  }, [safeTenants, safeRoles, form])

  const [bulkFile, setBulkFile] = React.useState<File | null>(null)
  const [bulkParseError, setBulkParseError] = React.useState<string | null>(null)
  const [bulkPreview, setBulkPreview] = React.useState<Array<{ name: string; email: string; tenantId: string; role: string }>>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [bulkConfirmOpen, setBulkConfirmOpen] = React.useState(false)

  const handleSingleSubmit = form.handleSubmit(async (values) => {
    await onSingleInvite(values)
    form.reset({ name: '', email: '', tenantId: values.tenantId, role: values.role })
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBulkParseError(null)
    setBulkPreview([])
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? '')
      const rows = parseCSV(text)
      const result = validateCSV(rows)
      if (result.valid) {
        setBulkFile(file)
        setBulkPreview(result.invites)
      } else {
        setBulkParseError(result.errors.join('; '))
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      setBulkParseError(null)
      setBulkPreview([])
      const reader = new FileReader()
      reader.onload = () => {
        const text = String(reader.result ?? '')
        const rows = parseCSV(text)
        const result = validateCSV(rows)
        if (result.valid) {
          setBulkFile(file)
          setBulkPreview(result.invites)
        } else {
          setBulkParseError(result.errors.join('; '))
        }
      }
      reader.readAsText(file)
    } else {
      setBulkParseError('Please upload a CSV file')
    }
  }

  const handleBulkSubmit = async () => {
    if (bulkPreview.length === 0) return
    await onBulkInvite(bulkPreview)
    setBulkFile(null)
    setBulkPreview([])
    setBulkConfirmOpen(false)
  }

  const sampleCSV = `name,email,tenantId,role
John Doe,john@example.com,t1,Editor
Jane Smith,jane@example.com,t1,Viewer`

  const downloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invite_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="rounded-2xl shadow-card">
      <CardHeader>
        <CardTitle>Invite Users</CardTitle>
        <CardDescription>
          Send invitations to join the organization (single or bulk via CSV)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="space-y-4">
          <TabsList className="inline-flex h-11 items-center justify-center rounded-full bg-[rgb(var(--primary-foreground))] p-1">
            <TabsTrigger value="single" className="rounded-full gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserPlus className="h-4 w-4" />
              Single Invite
            </TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-full gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              Bulk Invite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4 space-y-4">
            <form onSubmit={handleSingleSubmit} className="flex flex-wrap items-end gap-4">
              <div className="w-full min-w-[180px] sm:w-48 space-y-2">
                <Label htmlFor="name">Name</Label>
                <ValidationErrorTooltip error={form.formState.errors.name?.message}>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Full name"
                  />
                </ValidationErrorTooltip>
              </div>
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="email">Email</Label>
                <ValidationErrorTooltip error={form.formState.errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="user@example.com"
                  />
                </ValidationErrorTooltip>
              </div>
              <div className="w-[180px] space-y-2">
                <Label htmlFor="tenantId">Tenant</Label>
                <Select
                  value={form.watch('tenantId')}
                  onValueChange={(v) => form.setValue('tenantId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {safeTenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px] space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.watch('role')}
                  onValueChange={(v) => form.setValue('role', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {safeRoles.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isSinglePending}>
                {isSinglePending ? 'Sending…' : 'Invite'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="bulk" className="mt-4 space-y-4">
            <div
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">Drag and drop a CSV file here</p>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <div className="inline-block">
                <input
                  id="bulk-csv-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('bulk-csv-input')?.click()}
                >
                  Browse files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Required columns: name, email, tenantId, role
              </p>
              <button
                type="button"
                onClick={downloadSample}
                className="text-xs text-primary hover:underline mt-2"
              >
                Download sample CSV
              </button>
            </div>

            {bulkParseError && (
              <p className="text-sm text-destructive" role="alert">
                {bulkParseError}
              </p>
            )}

            {bulkPreview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {bulkPreview.length} user(s) ready to invite
                  {bulkFile && (
                    <span className="text-muted-foreground font-normal ml-2">
                      ({bulkFile.name})
                    </span>
                  )}
                </p>
                <Button
                  onClick={() => setBulkConfirmOpen(true)}
                  disabled={isBulkPending}
                >
                  {isBulkPending ? 'Inviting…' : `Invite ${bulkPreview.length} users`}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ConfirmDialog
          open={bulkConfirmOpen}
          onOpenChange={setBulkConfirmOpen}
          title="Confirm bulk invite"
          description={`You are about to invite ${bulkPreview.length} user(s). This will send invitation emails.`}
          confirmLabel="Send invitations"
          onConfirm={handleBulkSubmit}
          loading={isBulkPending}
        />
      </CardContent>
    </Card>
  )
}
