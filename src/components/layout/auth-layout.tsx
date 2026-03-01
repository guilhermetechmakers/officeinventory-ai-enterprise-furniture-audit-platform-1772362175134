import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[rgb(var(--primary-foreground))]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-30" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="font-bold text-xl">
            OfficeInventory AI
          </Link>
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Enterprise furniture audit, simplified
            </h2>
            <p className="text-white/80 max-w-md">
              AI-powered inventory capture, confidence-driven review workflows,
              and audit-ready exports for procurement and sustainability.
            </p>
          </div>
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} OfficeInventory AI
          </p>
        </div>
      </div>
      <div
        className={cn(
          'flex flex-1 flex-col justify-center px-6 py-12',
          'lg:px-12 lg:py-24'
        )}
      >
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
