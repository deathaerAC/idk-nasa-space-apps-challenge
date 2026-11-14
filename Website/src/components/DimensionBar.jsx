import { motion } from 'framer-motion';

export default function DimensionBar({ label, value, weight, compact = false, delay = 0 }) {
  const width = `${Math.max(2, Math.min(100, value))}%`;

  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <div className="flex items-baseline justify-between gap-3">
        <span className={compact ? 'text-[11px] text-muted-foreground' : 'text-[12px] text-foreground/80'}>
          {label}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {value}
          {weight ? <span className="text-muted-foreground/50"> · {Math.round(weight * 100)}%</span> : null}
        </span>
      </div>
      <div className="h-[3px] w-full overflow-hidden bg-secondary">
        <motion.div
          className="h-full bg-primary/80"
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}