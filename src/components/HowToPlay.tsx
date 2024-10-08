import { PropsWithChildren } from 'react';
import { ResponsiveDialog } from './ui/responsive-dialog';
import { motion } from 'framer-motion';
import { Tile } from './GameGrid';
import { getLetterStatus } from '@/store';

const example = {
  target: 'avoid',
  guesses: ['audio', 'droid', 'avoid'],
};

export function HowToPlay({ children }: PropsWithChildren) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialog.Trigger asChild>{children}</ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>How to Play</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>Wordle, Quordle, and Octordle?</ResponsiveDialog.Description>
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
            <motion.div
              className="text-xl space-y-1 mt-4"
              animate={'entered'}
              transition={{
                staggerChildren: 2,
              }}
            >
              {example.guesses.map((guess, index) => (
                <motion.div
                  key={index}
                  className="grid grid-rows-[1.8em] auto-cols-[1.8em] grid-flow-col gap-1"
                  variants={{
                    entered: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {getLetterStatus(example.target, [...guess]).map((status, i) => (
                    <Tile key={i} char={guess[i]} status={status} className="border" />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </section>
        </section>

        <ResponsiveDialog.Footer></ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
