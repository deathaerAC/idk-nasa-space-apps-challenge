SPACE ANIMATIONS  (this folder: src/components/space)
=====================================================

What is in here
  Starfield       twinkling stars with the odd shooting star
  OrbitScene      Earth with the Moon going around it (in front, then behind)
  AnimatedPlanet  one planet ("earth", "moon" or "mars") that floats, glows and
                  reacts to the mouse
  PlanetStage     the Moon, Earth and Mars in a row. The chosen planet pops up big
                  next to Earth, the other one stays small and can be clicked
  PlanetIcon      a tiny still picture of a planet, for buttons and labels
  TerrainIcon     a small line drawing for each terrain, with a little movement in it
  Astronaut       the mascot. Three moods: "float" (waving), "read" (pamphlet) and
                  "shrug". A sign next to the helmet shows ..., ! or ?
  SoundToggle     looks after all the sound: starts the background music, plays a very
                  short sound when any button is clicked, and shows two round buttons in
                  the bottom left corner (music on / off, click sounds on / off)
  music.js        the background music player. The track is music/ambient.mp3
  sfx.js          the click sounds. They are made by the browser, so there are no sound
                  files. Pitch, length and loudness are at the top of the file
  useSleepWhenHidden   pauses the animations inside a section while it is scrolled out of view

No extra packages are needed. It only uses React, which the project already has.


Where it is used right now
  components/Hero.jsx              stars, Earth with the Moon orbiting it, and Mars floating nearby.
                                   The three numbers count up when the page opens.
  components/AstronautGuide.jsx    the astronaut on the Atlas page. It waits beside the title. When
                                   you scroll it looks down, notices (!), then flies after you and
                                   lands in the "You are comparing" strip a moment later. There it
                                   reads its pamphlet, shows ! when the choice changes, and shrugs
                                   with a ? when no sites match. The two numbers at the top of the
                                   file set how long it looks and how far it trails behind.
  components/DestinationBand.jsx   the "You are comparing" strip. Earth sits next to the Moon or
                                   Mars, and the planet pops whenever the terrain, the Moon / Mars
                                   choice or the destination site changes. Used on the Atlas page
                                   (pages/Explorer.jsx) and the Ranking page (pages/Ranking.jsx).
  components/ExplorerControls.jsx  planet pictures on the Moon / Mars buttons, terrain icons on the
                                   terrain buttons
  components/SiteCard.jsx          a terrain icon beside each site's terrain label
  pages/Explorer.jsx               the planet beside the "Leading candidate" score, the three small
                                   planets in the footer, and the sound button (the footer, and so
                                   the sound button, shows on every page)
  pages/Challenge.jsx              tiny Moon and Mars pictures on the two pairs of boxes
  components/SiteHeader.jsx        the logo icon turns slowly

  components/EarthArt.jsx is no longer used by anything. Keep it or delete it.


Using it on another page
  import { Starfield, AnimatedPlanet, OrbitScene, PlanetStage, PlanetIcon, TerrainIcon, Astronaut }
    from "@/components/space";

  <Starfield fixed={false} />                  stars inside a box that has "relative" on it
  <AnimatedPlanet planet="mars" size={240} />
  <OrbitScene size={500} />
  <PlanetStage active="mars" onSelect={(planet) => ...} pulseKey={anythingThatChanges} />
  <PlanetIcon planet="moon" size={16} />
  <TerrainIcon type="volcanic" size={16} live />
  <Astronaut mood="read" size={110} />

  Starfield on its own fills the whole page behind everything. Put className="sp-above"
  on the box that holds your normal content so it stays on top of the stars.


Music and sounds
- The music is music/ambient.mp3: "Space Cinematic Ambient" by Tunetank. Check Tunetank's
  licence terms and credit the track wherever the project lists its resources.
- To change the music, replace that file and keep the same name.
- It plays at 47% volume and starts again by itself when it ends. The volume is MUSIC_VOLUME
  at the top of music.js.
- Browsers do not allow sound before the visitor has clicked, tapped or pressed a key, so the
  music starts on their first action, not when the page opens. The file is only downloaded then.
- Any <button> makes the "tap" sound. Add data-sound="switch" to a button for the two-note
  sound, or data-sound="none" to keep it silent.
- Both on / off choices are remembered on that device.
- To remove music and sounds completely, delete the <SoundToggle /> line in pages/Explorer.jsx.


Good to know
- Stars need a dark background to be seen. The site already has one.
- Anyone who turned on "reduce motion" in their device settings sees still pictures.
- The planet pictures are in planets/ (small WebP files). "-md" is used when a planet is shown
  small, "-sm" is the tiny icon. The big ones are only loaded for the large Earth and Moon.
- Animations stop by themselves while they are scrolled out of view, and start again when seen.
- Every setting is explained in the comment at the top of each file.
- To turn something off, delete its line from the page. Nothing else depends on it.
