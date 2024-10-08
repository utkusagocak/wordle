import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAlphabetStatus, getIsGameEnded, getIsTargetFound, useWordleStore, WordLength } from './store';
import { cn } from './lib/utils';
import {
  Button,
  GameGrid,
  HowToPlay,
  Keyboard,
  NewGameDialog,
  RestartDialog,
  SimpleToast,
  ThemeProvider,
  ThemeToggle,
} from './components';
import { CircleHelp } from 'lucide-react';

function getBoardData(target: string, guesses: string[][], currentGuess: string[]) {
  const visibleGuesses: string[][] = [];
  for (const guess of guesses) {
    visibleGuesses.push(guess);
    if (guess.join('').toLowerCase() === target.toLowerCase()) {
      return { guesses: visibleGuesses, currentGuess: [] };
    }
  }
  return { guesses: visibleGuesses, currentGuess };
}

function emitKey(key: string) {
  const { game, makeGuess, currentGuess, setCurrentGuess } = useWordleStore.getState();

  if (getIsGameEnded(game)) return;

  // To handle non-ascii 'ı' charachters. (e.g ı -> I -> i)
  const char = key.toUpperCase().toLowerCase();
  if (char.match(/^[a-zA-Z]$/i)) {
    setCurrentGuess(currentGuess.length < WordLength ? [...currentGuess, char] : currentGuess);
    return true;
  } else if (key === 'Backspace') {
    setCurrentGuess(currentGuess.filter((_, i) => i < currentGuess.length - 1));
    return true;
  } else if (key === 'Enter' && currentGuess.length === WordLength) {
    makeGuess();
    return true;
  }
}

function SolutionBadge({ target, isTargetFound }: { target: string; isTargetFound: boolean }) {
  return (
    <motion.div
      className={cn('absolute left-1/2 top-0 py-2 px-6 rounded-full uppercase font-bold shadow', {
        'bg-[--red]': !isTargetFound,
        'bg-[--green]': isTargetFound,
      })}
      initial={{
        opacity: 0,
        y: '-100%',
        x: '-50%',
      }}
      animate={{
        opacity: 1,
        y: '0%',
      }}
      exit={{
        opacity: 0,
        y: '-100%',
      }}
    >
      {target}
    </motion.div>
  );
}

function App() {
  const game = useWordleStore((state) => state.game);
  const setGame = useWordleStore((state) => state.setGame);

  const currentGuess = useWordleStore((state) => state.currentGuess);
  const isGameEnded = useWordleStore((state) => getIsGameEnded(state.game));
  const alphabetStatus = useMemo(() => getAlphabetStatus(game), [game]);

  useEffect(() => {
    setGame({ ...(JSON.parse(localStorage.getItem('game') ?? '{}') ?? {}) });
    const unsubscribe = useWordleStore.subscribe((state, prevState) => {
      if (state.game !== prevState.game) {
        localStorage.setItem('game', JSON.stringify(state.game));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (emitKey(e.key)) {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        e.preventDefault();
      }
    }

    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, []);

  return (
    <ThemeProvider>
      <main className="flex flex-col items-center h-screen overflow-hidden">
        <header className="w-full border-b p-2 items-center gap-2 grid grid-cols-[1fr,1fr,1fr]">
          <div></div>
          <div className="flex justify-center">
            <h1 className="text-3xl">Wordle</h1>
          </div>
          <div className="flex justify-end gap-2">
            <HowToPlay>
              <Button variant="ghost" className="h-8 w-8 px-0">
                <CircleHelp />
                <span className="sr-only">How to play?</span>
              </Button>
            </HowToPlay>
            <ThemeToggle />
          </div>
        </header>

        <SimpleToast className="z-50" />

        <div className="flex flex-grow overflow-y-auto gap-4 flex-wrap justify-center w-full py-4">
          {game.targets.map((target, index) => (
            <div className="relative" key={index}>
              <motion.div animate={{ opacity: isGameEnded ? 0.5 : 1 }}>
                <GameGrid
                  key={target + index}
                  target={target}
                  guessCount={game.guessCount}
                  className={cn({
                    'text-3xl sm:text-5xl': game.targets.length === 1,
                    'text-xl sm:text-4xl': game.targets.length > 1 && game.targets.length < 5,
                    'text-lg sm:text-2xl': game.targets.length > 4,
                  })}
                  {...getBoardData(target, game.guesses, currentGuess)}
                />
              </motion.div>

              <AnimatePresence>
                {isGameEnded && <SolutionBadge target={target} isTargetFound={getIsTargetFound(target, game)} />}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="w-full max-w-[500px] pb-4 px-2">
          <div className="ml-auto flex gap-2 justify-between flex items-center">
            <RestartDialog>
              <Button variant={'secondary'}>Restart</Button>
            </RestartDialog>

            <NewGameDialog>
              <Button variant={'secondary'}>New Game</Button>
            </NewGameDialog>
          </div>
          <Keyboard className="pt-2" status={alphabetStatus} onKeyboard={emitKey} />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
