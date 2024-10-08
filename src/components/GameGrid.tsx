import React, { ComponentProps } from 'react';
import { motion, Variants } from 'framer-motion';
import { getLetterStatus, isWordValid, TileStatus, WordLength } from '../store';
import { cn } from '../lib/utils';

// Tile animations
const tileVariants: Variants = {
  entered: (data: { color: string }) => ({
    backgroundColor: ['var(--transparent)', data.color],
    rotateX: 360,
    transition: { rotateX: { type: 'spring' }, backgroundColor: { ease: 'easeIn' } },
  }),
  current: (data: { char: string }) =>
    !data.char ? {} : { scale: [1.15, 1], transition: { type: 'spring' }, borderColor: 'var(--border-focus)' },
  currentInvalid: { borderColor: '#ff0000' },
  empty: {
    opacity: [0, 1],
  },
};

const rowVariants = {
  entered: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  empty: {
    opacity: [0, 1],
    transition: { staggerChildren: 0.1 },
  },
};

export const Tile = React.memo(
  ({
    char,
    status = TileStatus.Empty,

    className,
    ...props
  }: { char: string; status?: TileStatus } & ComponentProps<typeof motion.div>) => {
    function getColor() {
      if (status === TileStatus.Gray) return 'var(--gray)';
      if (status === TileStatus.Yellow) return 'var(--yellow)';
      if (status === TileStatus.Green) return 'var(--green)';
      return 'var(--transparent)';
    }

    return (
      <motion.div
        className={cn('uppercase content-center text-center w-full h-full border-2 select-none', className)}
        custom={{ color: getColor(), char }}
        variants={tileVariants}
        {...props}
      >
        {char}
      </motion.div>
    );
  },
);

export const Row = React.memo(function Row({
  guess,
  statuses = [],
  animate,

  ...props
}: {
  guess: string[];
  statuses?: TileStatus[];
  animate?: 'entered' | ['current', string];
} & ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className="grid grid-rows-[1.5em] auto-cols-[1.5em] grid-flow-col gap-1"
      animate={animate}
      variants={rowVariants}
      {...props}
    >
      {new Array(WordLength).fill('').map((_, index) => (
        <Tile key={index} char={guess[index] ?? ''} status={statuses[index]}></Tile>
      ))}
    </motion.div>
  );
});

const EMPTY_GUESS: string[] = [];
export const GameGrid = React.memo(function GameGrid({
  target,
  guessCount,
  guesses,
  currentGuess,

  className,
  ...props
}: {
  target: string;
  guessCount: number;
  guesses: string[][];
  currentGuess: string[];
} & ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={cn('grid auto-cols-[1fr] auto-rows-[1.5em] gap-1 w-min', className)}
      {...props}
      animate={'empty'}
      transition={{ staggerChildren: 0.1 }}
    >
      {guesses.map((guess, index) => (
        <Row key={index} guess={guess} animate={'entered'} statuses={getLetterStatus(target, guess)} />
      ))}

      {guesses.length < guessCount && (
        <Row
          key={guesses.length}
          guess={currentGuess}
          animate={[
            'current',
            currentGuess.length === WordLength && !isWordValid(currentGuess) ? 'currentInvalid' : '',
          ]}
        />
      )}

      {guessCount - guesses.length > 0 &&
        new Array(guessCount - guesses.length - 1)
          .fill('')
          .map((_, index) => <Row key={guesses.length + index + 1} guess={EMPTY_GUESS} />)}
    </motion.div>
  );
});
