import { TileStatus } from './Constants';
import { Game } from './WordleStore';
import solutionList from '../data/solutions.json';
import validGuessesList from '../data/valid_guess.json';

// Computeds
export function getLetterStatus(_target: string, _guess: string[]): TileStatus[] {
  const guess = [..._guess];
  const target = [..._target.toLowerCase()];
  const status: TileStatus[] = new Array(guess.length).fill(TileStatus.Empty);

  // Handle correct chars
  for (const [index, char] of guess.entries()) {
    if (char && target[index] === char) {
      // Mark as found.
      target[index] = '_';
      status[index] = TileStatus.Green;
    }
  }

  //
  for (const [index, char] of guess.entries()) {
    if (status[index] !== TileStatus.Empty) continue;

    if (char && target.includes(char)) {
      status[index] = TileStatus.Yellow;
    } else if (char) {
      status[index] = TileStatus.Gray;
    }
  }
  return status;
}

export function getIsGameEnded(state: Game): boolean {
  const { guesses, guessCount } = state;
  return guesses.length === guessCount || getIsGameWon(state);
}

export function getIsGameWon(state: Game): boolean {
  const { guesses, targets } = state;
  return targets.every((target) => guesses.some((guess) => guess.join('').toLowerCase() === target.toLowerCase()));
}

export function getIsTargetFound(target: string, state: Game) {
  const { guesses } = state;
  return guesses.some((guess) => guess.join('').toLowerCase() === target.toLowerCase());
}

export function getAlphabetStatus({ targets, guesses }: Game) {
  const charStatus: Record<string, TileStatus[]> = {};

  for (const [targetIndex, target] of targets.entries()) {
    for (const guess of guesses) {
      const statuses = getLetterStatus(target, guess);
      for (const [charIndex, status] of statuses.entries()) {
        const char = guess[charIndex].toLowerCase();
        const prev = charStatus[char]?.[targetIndex] ?? -1;

        charStatus[char] ??= [];
        charStatus[char][targetIndex] = Math.max(prev, status) as TileStatus;
      }
    }
  }

  return charStatus;
}

// Helpers
const validGuess = new Set<string>(validGuessesList);
export function isWordValid(guess: string[]) {
  return validGuess.has(guess.join('').toLowerCase());
}

export function getRandomSolution() {
  return solutionList[Math.floor(Math.random() * (solutionList.length - 1))];
}

export function isGuessUsedBefore(_guess: string[], game: Game) {
  const guesses = game.guesses;
  const guess = _guess.join('').toLowerCase();

  return guesses.some((g) => g.join('').toLowerCase() === guess);
}
