import { Link } from 'react-router-dom'
import { Camera, Upload, CheckSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const quickActions = [
  { to: '/dashboard/capture', icon: Camera, label: 'Start Capture', color: 'bg-primary' },
  { to: '/dashboard/uploads', icon: Upload, label: 'Upload Batch', color: 'bg-info' },
  { to: '/dashboard/review-queue', icon: CheckSquare, label: 'Review Queue', color: 'bg-warning' },
]

const kpiData = [
  { label: 'Total Items', value: '2,847', trend: '+12%', positive: true },
  { label: 'Pending Review', value: '43', trend: '-8', positive: true },
  { label: 'Active Audits', value: '12', trend: '+2', positive: true },
  { label: 'Sites', value: '8', trend: '0', positive: true },
]

const chartData = [
  { name: 'Mon', items: 120 },
  { name: 'Tue', items: 180 },
  { name: 'Wed', items: 150 },
  { name: 'Thu', items: 220 },
  { name: 'Fri', items: 190 },
  { name: 'Sat', items: 80 },
  { name: 'Sun', items: 45 },
]

const recentActivity = [
  { id: 1, action: 'Batch uploaded', detail: '24 images from Building A', time: '2 min ago' },
  { id: 2, action: 'Audit completed', detail: 'Floor 3 - West Wing', time: '1 hour ago' },
  { id: 3, action: 'Review assigned', detail: '12 items to you', time: '3 hours ago' },
  { id: 4, action: 'Export generated', detail: 'Inventory List Q1', time: 'Yesterday' },
]

export function DashboardOverview() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Operational visibility and quick navigation
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/50">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{action.label}</p>
                  <p className="text-sm text-muted-foreground">Quick access</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={kpi.positive ? 'text-primary' : 'text-destructive'}>
                  {kpi.trend}
                </span>{' '}
                from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Items Captured (7 days)</CardTitle>
            <CardDescription>Daily detection volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="items"
                  stroke="rgb(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorItems)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
