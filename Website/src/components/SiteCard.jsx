import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { band, envLabel, topDimensions } from '@/lib/analog';
import { cn } from '@/lib/utils';

export default function SiteCard({ site, score, target, destinationSite, active, onSelect, index = 0 }) {
  const strengths = topDimensions(site, target, 2, destinationSite);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(site.slug)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.995 }}
      className={cn(
        'group w-full border-b border-border/70 px-5 py-5 text-left transition-colors last:border-b-0',
        active ? 'bg-secondary/70' : 'hover:bg-secondary/40',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <span className="pt-1 font-mono text-[10px] text-muted-foreground/60">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="label-mono text-muted-foreground">{envLabel(site.env_type)}</p>
            <h3 className="mt-1.5 truncate text-[15px] font-medium tracking-tight">{site.name}</h3>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{site.region}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-3xl leading-none tabular-nums">{score}</div>
          <div className="label-mono mt-1 text-muted-foreground">{band(score)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {strengths.map((dimension) => (
            <span
              key={dimension.key}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] tracking-tight text-muted-foreground transition-colors group-hover:border-primary/40"
            >
              {dimension.short}
            </span>
          ))}
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
}