import { ENV_TYPES, TARGETS } from '@/lib/analog';
import { cn } from '@/lib/utils';

export default function ExplorerControls({ target, onTargetChange, env, onEnvChange, count }) {
  return (
    <div className="flex flex-col gap-5 border-b border-border py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="inline-flex border border-border">
          {Object.values(TARGETS).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onTargetChange(option.id)}
              className={cn(
                'px-4 py-2 text-[12px] tracking-tight transition-colors',
                target === option.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          <Chip active={env === 'all'} onClick={() => onEnvChange('all')}>
            All terrains
          </Chip>
          {Object.entries(ENV_TYPES).map(([value, label]) => (
            <Chip key={value} active={env === value} onClick={() => onEnvChange(value)}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="label-mono shrink-0 text-muted-foreground">
        {count} site{count === 1 ? '' : 's'} ranked
      </p>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-3 py-1.5 text-[11px] tracking-tight transition-colors',
        active
          ? 'border-primary/60 bg-primary/10 text-foreground'
          : 'border-border text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}