export const TileStatus = {
  Empty: 0,
  Gray: 1,
  Yellow: 2,
  Green: 3,
} as const;
export type TileStatus = (typeof TileStatus)[keyof typeof TileStatus];

export const WordLength = 5 as const;
export type WordLength = typeof WordLength;

export type GameMode = {
  readonly guessCount: number;
  readonly targetCount: number;
  readonly description: string;
};

export const GameModes: Record<string, GameMode> = {
  Wordle: { guessCount: 6, targetCount: 1, description: 'Guess a single 5-letter word in 6 tries.' },
  Quordle: { guessCount: 9, targetCount: 4, description: 'Solve 4 words at the same time in 9 tries.' },
  Octordle: { guessCount: 13, targetCount: 8, description: 'Guess 8 words simultaneously within 13 tries.' },
} as const;
