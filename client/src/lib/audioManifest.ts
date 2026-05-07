// Audio manifest for Human Technology.
// Source: ORIJINS Studio — https://orijins-studio.vercel.app/
// 22 tracks across 21 chapters (Ch.13 = stereo split: LEFT + RIGHT).
// Public CDN — stable for the project lifecycle.
// Sprint 6 task: optional migration to self-hosted /audio/chapters/*.mp3 for single-domain hygiene.

const STUDIO = 'https://orijins-studio.vercel.app';

export type ChapterAudio = string | { left: string; right: string };

export const CHAPTER_AUDIO: Record<number, ChapterAudio> = {
  1:  `${STUDIO}/02-Les-Lois/05-Souffle.mp3`,
  2:  `${STUDIO}/03-Fibonacci/19-Temps.mp3`,
  3:  `${STUDIO}/04-Divine-Galaxy/05-Galaxy-v3-Bang.mp3`,
  4:  `${STUDIO}/04-Divine-Galaxy/03-Signal-Intercepte.mp3`,
  5:  `${STUDIO}/02-Les-Lois/03-Spirale.mp3`,
  6:  `${STUDIO}/02-Les-Lois/08-Gaia-Parle.mp3`,
  7:  `${STUDIO}/07-Tribal-Trance/02-Electronique.mp3`,
  8:  `${STUDIO}/02-Les-Lois/01-Eveil.mp3`,
  9:  `${STUDIO}/04-Divine-Galaxy/01-Frequence-Divine-9-Solfeges.mp3`,
  10: `${STUDIO}/02-Les-Lois/02-Connexion.mp3`,
  11: `${STUDIO}/03-Fibonacci/17-Miroir.mp3`,
  12: `${STUDIO}/02-Les-Lois/09-Messager.mp3`,
  13: {
    left:  `${STUDIO}/06-Stade-de-France/stade-samba-09-chaos.mp3`,
    right: `${STUDIO}/02-Les-Lois/06-Resonance.mp3`,
  },
  14: `${STUDIO}/01-House-Club/01-Cinematic-Love-528Hz.mp3`,
  15: `${STUDIO}/04-Divine-Galaxy/04-Galaxy-v2-Intime.mp3`,
  16: `${STUDIO}/04-Divine-Galaxy/02-Galaxy-Resonance-v1.mp3`,
  17: `${STUDIO}/03-Fibonacci/18-Alchimie.mp3`,
  18: `${STUDIO}/03-Fibonacci/20-Pardon.mp3`,
  19: `${STUDIO}/04-Divine-Galaxy/06-Galaxy-v4-Spirale-Infinie.mp3`, // Shepard tone
  20: `${STUDIO}/04-Divine-Galaxy/07-Schumann-Real-Signal.mp3`,      // 7.83 Hz Earth pulse
  21: `${STUDIO}/03-Fibonacci/21-Infini-Special.mp3`,                // Ouroboros loop
};

export const CHAPTER_TITLES: Record<number, { title: string; track: string }> = {
  1:  { title: 'The Breath',         track: 'Le Souffle' },
  2:  { title: 'The Foreshadow',     track: 'Le Temps' },
  3:  { title: 'Big Bang',           track: 'Galaxy v3 — Bang' },
  4:  { title: 'Stardust',           track: 'Signal Intercepté' },
  5:  { title: 'The Spiral',         track: 'La Spirale' },
  6:  { title: 'Gaia',               track: 'Gaïa Parle' },
  7:  { title: 'Evolution',          track: 'Tribal × Électronique' },
  8:  { title: 'The Human Appears',  track: "L'Éveil" },
  9:  { title: 'Twenty Watts',       track: 'Fréquence Divine' },
  10: { title: 'The Day',            track: 'Connexion' },
  11: { title: 'The Mirror',         track: 'Le Miroir' },
  12: { title: 'Civilization',       track: 'Le Messager' },
  13: { title: 'The Choice',         track: 'Chaos Créatif × Résonance' },
  14: { title: 'The Next Century',   track: 'Cinematic Love 528Hz' },
  15: { title: 'Ten Thousand',       track: 'Galaxy v2 — Intime' },
  16: { title: 'The Sun Dies',       track: 'Galaxy Resonance' },
  17: { title: 'Stars Go Dark',      track: "L'Alchimie" },
  18: { title: 'Black Hole Era',     track: 'Le Pardon' },
  19: { title: 'Evaporation',        track: 'Galaxy v4 — Spirale' },
  20: { title: 'Heat Death',         track: 'Signal Gaïa (7.83 Hz)' },
  21: { title: 'Rebirth',            track: "L'INFINI" },
};
