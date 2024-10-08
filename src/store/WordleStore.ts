import { create } from 'zustand';
import { getIsGameEnded, getRandomSolution, isGuessUsedBefore, isWordValid } from './Utils';

export interface Message {
  text: string;
  className?: string;
}

export interface Game {
  readonly guessCount: number;
  readonly targets: string[];
  readonly guesses: string[][];
}

export interface WordleStore {
  // State
  game: Game;
  currentGuess: string[];
  message?: Message;

  // Actions
  setGame(initial?: Partial<Game>): void;
  setCurrentGuess(guess: string[]): void;
  makeGuess(): void;
  showMessage(message: Message): void;
}

function createGame(initial: Partial<Game> = {}): Game {
  return {
    guessCount: 7,
    targets: [getRandomSolution()],
    guesses: [],
    ...initial,
  };
}

const MESSAGE_DURATION = 1000;
let messageTimeout = 0;

// Global store
export const useWordleStore = create<WordleStore>((set, get) => ({
  game: createGame(),
  currentGuess: [],
  message: undefined,

  setGame: (initial?: Partial<Game>) => set(() => ({ game: createGame(initial), currentGuess: [] })),
  setCurrentGuess: (guess: string[]) => set(() => ({ currentGuess: guess })),
  makeGuess() {
    const { currentGuess: guess, game, showMessage } = get();

    if (getIsGameEnded(game)) {
      return;
    }

    if (!isWordValid(guess)) {
      showMessage({ text: 'Not in word list.' });
      return;
    }

    if (isGuessUsedBefore(guess, game)) {
      showMessage({ text: 'Used before.' });
      return;
    }

    set((state) => ({ game: { ...state.game, guesses: [...state.game.guesses, guess] }, currentGuess: [] }));
  },
  showMessage(message?: Message) {
    clearTimeout(messageTimeout);
    set(() => ({ message }));
    messageTimeout = window.setTimeout(() => set(() => ({ message: undefined })), MESSAGE_DURATION);
  },
}));
