import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

export default function SiteNotes({ siteSlug }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    base44.entities.SiteNote.filter({ site_slug: siteSlug }, { sort: '-created_date', limit: 20 })
      .then((page) => {
        if (active) setNotes(page.items || []);
      })
      .catch(() => {
        if (active) setNotes([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [siteSlug]);

  const submit = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    setError('');
    try {
      const created = await base44.entities.SiteNote.create({
        site_slug: siteSlug,
        author_name: author.trim() || 'Anonymous',
        body: body.trim(),
      });
      setNotes((previous) => [created, ...previous]);
      setBody('');
    } catch (err) {
      setError('That note could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="space-y-2">
        <input
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="w-full border border-border bg-background px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="What did you observe, test or question at this site?"
          rows={3}
          maxLength={1200}
          className="w-full resize-none border border-border bg-background px-3 py-2 text-[12px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-muted-foreground">{error || 'Notes are public on this atlas.'}</span>
          <button
            type="submit"
            disabled={saving || !body.trim()}
            className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-[11px] text-foreground transition-colors hover:border-primary/60 disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Post note
          </button>
        </div>
      </form>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-[11px] text-muted-foreground">Loading notes…</p>
        ) : notes.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">No field notes yet. Be the first to add one.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="border-l border-border pl-3">
              <p className="text-[10px] text-muted-foreground">
                {note.author_name || 'Anonymous'}
                <span className="mx-1.5 text-muted-foreground/40">·</span>
                {new Date(note.created_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-foreground/80">{note.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}