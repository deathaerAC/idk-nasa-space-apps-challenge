# Here's how to build and run it:

```ps1
  pnpm install
  pnpm approve-builds
  pnpm run build
  pnpm run preview
```

# AI use and credits

NASA Space Apps asks teams to show where AI tools were used.

- **Graphics made with AI (Claude, by Anthropic):** the Earth, Moon and Mars pictures
  (`src/components/space/planets/`), the astronaut mascot and the terrain icons. On the site
  these carry a visible "AI-generated" label, and the picture files say so in their metadata.
- **Code written with AI (Claude):** everything in `src/components/space/`, plus
  `src/components/AstronautGuide.jsx` and `src/components/DestinationBand.jsx`. The animation,
  graphics and sound parts of `Hero.jsx`, `ExplorerControls.jsx`, `SiteCard.jsx`, `SiteHeader.jsx`,
  `Explorer.jsx`, `Ranking.jsx` and `Challenge.jsx` were also added with Claude, as were the
  satellite imagery, zoom buttons and fly-to-site parts of `AnalogMap.jsx`. Each of these files
  says so in its first line.
- **Click sounds:** made in the browser by code written with Claude. There are no sound files.
- **Music (not AI):** "Space Cinematic Ambient" by Tunetank (tunetank.com),
  https://youtu.be/ozb32hgHdo4
- **Map imagery (not AI):** Esri World Imagery and World Boundaries and Places
  (Esri, Maxar, Earthstar Geographics), loaded from server.arcgisonline.com

This section only covers the animation, graphics and sound work. Add any other AI tools the
team used for the rest of the project.
