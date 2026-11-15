// AI disclosure: the animation, graphics and sound parts of this file were written with Claude (Anthropic), an AI tool.
import { ENV_TYPES, TARGETS } from '@/lib/analog';
import { cn } from '@/lib/utils';
import { PlanetIcon, TerrainIcon } from '@/components/space';

export default function ExplorerControls({ target, onTargetChange, env, onEnvChange, count }) {
  return (
    <div className="flex flex-col gap-5 border-b border-border py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="inline-flex border border-border">
          {Object.values(TARGETS).map((option) => (
            <button
              key={option.id}
              type="button"
              data-sound="switch"
              onClick={() => onTargetChange(option.id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 text-[12px] tracking-tight transition-colors',
                target === option.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <PlanetIcon planet={option.id} size={16} />
              {option.label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          <Chip terrain="all" active={env === 'all'} onClick={() => onEnvChange('all')}>
            All terrains
          </Chip>
          {Object.entries(ENV_TYPES).map(([value, label]) => (
            <Chip key={value} terrain={value} active={env === value} onClick={() => onEnvChange(value)}>
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

function Chip({ terrain, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] tracking-tight transition-colors',
        active
          ? 'border-primary/60 bg-primary/10 text-foreground'
          : 'border-border text-muted-foreground hover:text-foreground',
      )}
    >
      {/* the little drawing moves while its terrain is chosen, or while the pointer is over the button */}
      <TerrainIcon type={terrain} size={14} live={active} />
      {children}
    </button>
  );
}
