import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { HelpSupportCTA } from '@/components/auth'
import { cn } from '@/lib/utils'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[rgb(var(--primary-foreground))]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,255,82,0.15),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link
            to="/"
            className="font-bold text-xl text-white hover:text-primary transition-colors"
          >
            OfficeInventory AI
          </Link>
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Enterprise furniture audit, simplified
            </h2>
            <p className="text-white/80 max-w-md text-lg leading-relaxed">
              AI-powered inventory capture, confidence-driven review workflows, and audit-ready
              exports for procurement and sustainability.
            </p>
          </div>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} OfficeInventory AI
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div
        className={cn(
          'flex flex-1 flex-col justify-center px-6 py-12',
          'lg:px-12 lg:py-24'
        )}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link to="/" className="font-bold text-xl">
              OfficeInventory AI
            </Link>
          </div>
          <Outlet />
          <div className="mt-8 flex justify-center">
            <HelpSupportCTA />
          </div>
        </div>
      </div>
    </div>
  )
}
