import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil, X, Check } from 'lucide-react'
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
import { ValidationErrorTooltip } from '@/components/admin/validation-error-tooltip'
import { useProfile, useUpdateProfile } from '@/hooks/use-user-profile'
import { TIMEZONES } from '@/lib/timezones'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/types/user-profile'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

function toFormValues(profile: UserProfile | undefined): ProfileFormValues {
  const p = profile ?? ({} as Partial<UserProfile>)
  return {
    name: p.name ?? '',
    email: p.email ?? '',
    phone: p.phone ?? '',
    timezone: p.timezone ?? 'America/New_York',
  }
}

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(profile),
    values: toFormValues(profile),
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await updateProfile.mutateAsync({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      timezone: values.timezone,
    })
    setIsEditing(false)
  })

  const onCancel = () => {
    form.reset(toFormValues(profile))
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
          <div className="h-11 animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-fade-in transition-all duration-300 hover:shadow-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information and contact details</CardDescription>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="rounded-full"
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="rounded-full"
              aria-label="Cancel edit"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              form="profile-form"
              size="sm"
              disabled={updateProfile.isPending}
              className="rounded-full"
              aria-label="Save profile"
            >
              <Check className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form id="profile-form" onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <ValidationErrorTooltip error={form.formState.errors.name?.message}>
                <Input
                  id="name"
                  {...form.register('name')}
                  disabled={!isEditing}
                  className={cn(!isEditing && 'bg-muted/50')}
                />
              </ValidationErrorTooltip>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <ValidationErrorTooltip error={form.formState.errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  disabled={!isEditing}
                  className={cn(!isEditing && 'bg-muted/50')}
                />
              </ValidationErrorTooltip>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <ValidationErrorTooltip error={form.formState.errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                  className={cn(!isEditing && 'bg-muted/50')}
                />
              </ValidationErrorTooltip>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={form.watch('timezone')}
                onValueChange={(v) => form.setValue('timezone', v)}
                disabled={!isEditing}
              >
                <SelectTrigger
                  id="timezone"
                  className={cn(!isEditing && 'bg-muted/50')}
                >
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {(TIMEZONES as readonly string[]).map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
