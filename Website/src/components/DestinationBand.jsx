// AI disclosure: this file was written with Claude (Anthropic), an AI tool, for the NASA Space Apps Challenge 2026.
import { AiTag, PlanetStage, Starfield, TerrainIcon, useSleepWhenHidden } from '@/components/space';
import { ENV_TYPES } from '@/lib/analog';

/**
 * The strip that shows what is being compared: Earth next to the Moon or Mars.
 * The chosen planet pops up beside Earth whenever the terrain, the Moon / Mars choice
 * or the destination site changes. Clicking the other planet switches to it.
 *
 *   count   how many Earth sites are in the list right now
 *   best    the top entry of that list ({ site, score }), if there is one
 *   mascot  something to show in the astronaut's spot. Leave it out on the Atlas page,
 *           where the travelling astronaut (AstronautGuide.jsx) flies in and lands there.
 */
export default function DestinationBand({ target, onTargetChange, env = 'all', destinationSite, count, best, mascot = null }) {
  const world = target === 'moon' ? 'the Moon' : 'Mars';
  const other = target === 'moon' ? 'Mars' : 'the Moon';
  const terrain = env === 'all' ? '' : (ENV_TYPES[env] || '').toLowerCase();

  let headline = `All ${count} Earth sites`;
  if (count === 0) headline = `No ${terrain} sites yet`;
  else if (env !== 'all') headline = `${count} ${terrain} ${count === 1 ? 'site' : 'sites'} on Earth`;

  // Everything in the strip stops animating while it is scrolled out of view.
  const restRef = useSleepWhenHidden();

  return (
    <section ref={restRef} aria-label="What you are comparing" className="relative overflow-hidden border-b border-border">
      <Starfield fixed={false} count={44} shooting={1} parallax={10} />
      {/* The planets, astronaut and icon in this strip were made with AI, and this label says so. */}
      <AiTag className="absolute bottom-1.5 right-0">AI-generated graphics</AiTag>

      <div className="relative flex flex-col gap-7 py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-8">
        <div
          key={`${target}:${env}:${destinationSite.id}`}
          className="sp-rise min-w-0 pr-[84px] sm:pr-[102px] lg:flex-1 lg:pr-0"
        >
          <p className="label-mono flex items-center gap-2 text-primary">
            <TerrainIcon type={env} size={16} live />
            You are comparing
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.55rem,2.8vw,2.25rem)] leading-[1.1]">
            {headline}
            <span className="block italic text-muted-foreground">
              {count === 0 ? 'for' : 'standing in for'} {destinationSite.name} on {world}
            </span>
          </h2>
          <p className="mt-3 max-w-[62ch] text-[13px] leading-[1.7] text-muted-foreground">
            {count > 0 && best
              ? `Closest match: ${best.site.name}, ${best.score} out of 100. Tap ${other} to switch.`
              : `Try a different terrain, or tap ${other} to switch.`}
          </p>
        </div>

        {/* The astronaut's spot: top right on phones and tablets, between the words and the planets on wide screens. */}
        <div
          data-astronaut-landing
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-6 h-[88px] w-[76px] sm:h-[104px] sm:w-[90px] lg:static lg:h-[112px] lg:w-[96px] lg:shrink-0 xl:h-[124px] xl:w-[108px]"
        >
          {mascot}
        </div>

        {/* A little narrower on small laptops so the words keep enough room. */}
        <div className="mx-auto w-full max-w-[498px] shrink-0 lg:mx-0 lg:w-[400px] xl:w-[498px]">
          <PlanetStage active={target} onSelect={onTargetChange} pulseKey={`${env}:${destinationSite.id}`} />
        </div>
      </div>
    </section>
  );
}
