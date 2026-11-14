import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Sparkles } from 'lucide-react';
import { TARGETS } from '@/lib/analog';

export default function FieldBrief({ site, target }) {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await base44.functions.invoke('generateSiteBrief', {
        name: site.name,
        region: site.region,
        target,
        summary: site.summary,
        substrate: site.substrate,
        why: site.why,
        limits: site.limits,
      });
      setBrief(response.data.brief);
    } catch (err) {
      setError('The brief could not be drafted just now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!brief) {
    return (
      <div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Draft a mission-planning brief for this site as a {TARGETS[target].label.toLowerCase()} analog:
          what transfers, what fails, and which field campaigns are worth running.
        </p>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="mt-4 inline-flex items-center gap-2 border border-border px-3.5 py-2 text-[11px] text-foreground transition-colors hover:border-primary/60 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-primary" />}
          {loading ? 'Drafting brief…' : 'Draft field brief'}
        </button>
        {error ? <p className="mt-3 text-[11px] text-accent">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-[13px] leading-[1.8] text-foreground/85">{brief.verdict}</p>
      <BriefList title="Transfers" items={brief.transfers} tone="primary" />
      <BriefList title="Breaks down" items={brief.breaks} tone="accent" />
      <BriefList title="Field tests" items={brief.field_tests} tone="muted" />
      <BriefList title="Instruments" items={brief.instruments} tone="muted" />
      <p className="text-[10px] text-muted-foreground/70">
        Generated draft for discussion — verify against published site data before use.
      </p>
    </div>
  );
}

function BriefList({ title, items = [], tone }) {
  if (!items.length) return null;
  const dot = tone === 'primary' ? 'bg-primary' : tone === 'accent' ? 'bg-accent' : 'bg-muted-foreground/50';
  return (
    <div>
      <h4 className="label-mono mb-2 text-muted-foreground/70">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[12px] leading-relaxed text-foreground/80">
            <span className={`mt-1.5 h-1 w-1 shrink-0 ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}