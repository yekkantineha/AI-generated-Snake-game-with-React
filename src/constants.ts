/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from "./types";

export const DUMMY_TRACKS: Track[] = [
  {
    id: "1",
    title: "Neon Horizon",
    artist: "SynthAura AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372,
    coverUrl: "https://picsum.photos/seed/neon1/400/400",
  },
  {
    id: "2",
    title: "Cyber Pulse",
    artist: "Digital Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 425,
    coverUrl: "https://picsum.photos/seed/cyber/400/400",
  },
  {
    id: "3",
    title: "Electric Dreams",
    artist: "Midnight Grid",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 318,
    coverUrl: "https://picsum.photos/seed/electric/400/400",
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = "UP";
export const GAME_SPEED = 150; // ms
