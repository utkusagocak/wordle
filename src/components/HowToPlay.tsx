import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ResponsiveDialog } from './ui/responsive-dialog';
import { stagger, useAnimate } from 'framer-motion';
import { getLetterStatus, TileStatus } from '@/store';

const example = {
  target: 'avoid',
  guesses: ['audio', 'droid', 'avoid'],
};

const bgMap = {
  [TileStatus.Empty]: 'var(--transparent)',
  [TileStatus.Gray]: 'var(--gray)',
  [TileStatus.Yellow]: 'var(--yellow)',
  [TileStatus.Green]: 'var(--green)',
};

function ExampleGame() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const timeout = useRef(0);

  async function sequence() {
    if (!scope.current) return;

    const rows = scope.current.querySelectorAll('.example-row');
    for (const row of rows) {
      const chars = row.querySelectorAll('.example-char');
      const tiles = row.querySelectorAll('.example-tile');

      if (!scope.current) return;
      await animate(chars, { opacity: 1 }, { delay: stagger(0.1, { startDelay: 1 }) });

      if (!scope.current) return;
      await animate(
        tiles,
        { rotateX: 360, background: 'var(--status-color)' },
        { delay: stagger(0.1, { startDelay: 0.25 }) },
      );
    }

    if (!scope.current) return;
    await animate(
      '.example-row:last-child',
      { transform: ['scale(1)', 'scale(1.1)', 'scale(1.1)', 'scale(1)'] },
      { delay: 0.5, ease: 'anticipate', duration: 1.5 },
    );

    if (!scope.current) return;
    await animate('.example-char', { opacity: 0 }, { delay: 3 });

    if (!scope.current) return;
    await animate('.example-tile', { rotateX: 0, background: 'var(--transparent)' });
  }

  useEffect(() => {
    if (scope.current) {
      async function loop() {
        window.clearTimeout(timeout.current);
        await sequence();
        timeout.current = window.setTimeout(loop);
      }

      loop();
      return () => window.clearTimeout(timeout.current);
    }
  }, [scope, animate]);

  return (
    <div ref={scope} className="text-xl space-y-1 mt-4 uppercase example-board">
      {example.guesses.map((guess, index) => (
        <div key={index} className="example-row flex items-center gap-1 w-min">
          {getLetterStatus(example.target, [...guess]).map((status, i: number) => (
            <div
              key={i}
              className="example-tile flex items-center justify-center border border-foreground h-[1.8em] w-[1.8em]"
              style={
                {
                  '--status-color': bgMap[status],
                } as React.CSSProperties
              }
            >
              <div className="example-char opacity-0">{guess[i]}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function HowToPlay({ children }: PropsWithChildren) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem('how-to-play') !== 'true') {
      setTimeout(() => {
        localStorage.setItem('how-to-play', 'true');
        setOpen(true);
      }, 1500);
    }
  }, []);

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialog.Trigger asChild>{children}</ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>How to Play</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>Wordle, Quordle or Octordle?</ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <section className="pr-4 pl-6">
          <h1 className="sr-only">How to play?</h1>

          <ul className="list list-inside space-y-3">
            <li>Type a 5-letter word and press enter.</li>
            <li className="space-y-2">
              <span>Each word grid will highlight the letters:</span>
              <ul className="list-disc list-inside ml-5 space-y-1">
                <li>
                  <span className="text-green-600 font-bold">Green:</span> Correct letter, correct spot.
                </li>
                <li>
                  <span className="text-yellow-500 font-bold">Yellow:</span> Correct letter, wrong spot.
                </li>
                <li>
                  <span className="text-gray-500 font-bold">Gray:</span> Incorrect letter.
                </li>
              </ul>
            </li>
            <li>Use the clues to narrow down your guesses and solve all the words before running out of tries.</li>
          </ul>

          <p className="mt-4">
            The goal of all three games is to guess 5-letter words, but the number of words and guesses you have
            differs.
          </p>

          <section className="mt-6">
            <h3 className="text-lg">Example</h3>
            <ExampleGame />
          </section>
        </section>

        <ResponsiveDialog.Footer></ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
