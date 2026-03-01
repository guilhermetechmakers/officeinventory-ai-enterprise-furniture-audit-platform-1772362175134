import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const typeData = [
  { name: 'Desks', value: 847, color: 'rgb(var(--primary))' },
  { name: 'Chairs', value: 1203, color: 'rgb(var(--info))' },
  { name: 'Storage', value: 412, color: 'rgb(var(--warning))' },
  { name: 'Meeting Tables', value: 234, color: 'rgb(var(--muted))' },
]

const conditionData = [
  { name: 'Excellent', count: 1200 },
  { name: 'Good', count: 980 },
  { name: 'Fair', count: 420 },
  { name: 'Poor', count: 94 },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-1">
          Aggregated metrics and detection accuracy insights
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by type</CardTitle>
            <CardDescription>Distribution across furniture types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condition distribution</CardTitle>
            <CardDescription>Items by condition rating</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conditionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(var(--card))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
