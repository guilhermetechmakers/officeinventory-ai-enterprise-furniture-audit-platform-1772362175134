import { Plus, Mail, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const users = [
  { id: '1', name: 'Jane Smith', email: 'jane@acme.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'John Doe', email: 'john@acme.com', role: 'Reviewer', status: 'active' },
  { id: '3', name: 'Alice Johnson', email: 'alice@acme.com', role: 'Field Inspector', status: 'pending' },
]

export function UsersPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users at tenant scale
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="h-4 w-4 mr-2" />
          Invite user
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Invite users and assign roles</CardDescription>
            </div>
            <Input placeholder="Search users..." className="max-w-sm rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                    {user.role}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit role</DropdownMenuItem>
                      <DropdownMenuItem>Resend invite</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
