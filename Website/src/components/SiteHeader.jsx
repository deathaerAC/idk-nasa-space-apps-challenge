import { Link, useLocation } from 'react-router-dom';
import { Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Atlas' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/challenge', label: 'Challenge' },
];

export default function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 sm:h-[72px] sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card">
            <Orbit className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </span>
          <span className="leading-tight">
            <span className="label-mono block text-muted-foreground">Terra Analog Atlas</span>
            <span className="block text-[13px] font-medium tracking-tight">Earth · Moon · Mars</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[12px] tracking-tight transition-colors sm:px-4',
                  active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 lg:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span className="label-mono text-muted-foreground">Space Apps 2026</span>
        </div>
      </div>
    </header>
  );
}