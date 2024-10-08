import { PropsWithChildren } from 'react';
import { ResponsiveDialog } from './ui/responsive-dialog';
import { motion } from 'framer-motion';
import { GameModes, getRandomSolution, useWordleStore } from '@/store';

function ModeButton({ name, children, onClick }: PropsWithChildren<{ onClick: () => void; name: string }>) {
  return (
    <ResponsiveDialog.Close asChild onClick={onClick}>
      <motion.div
        className="flex flex-col flex-grow w-full py-2 px-4 gap-1 rounded items-start text-sm cursor-pointer"
        whileHover={'hover'}
        whileFocus={'hover'}
        whileTap={'hover'}
        transition={{
          staggerChildren: 0.05,
        }}
        tabIndex={1}
        onClick={onClick}
      >
        <motion.div className="text-xl flex items-center gap-1 uppercase">
          {[...name].map((c, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center border h-[1.8em] w-[1.8em]"
              initial={{
                background: 'var(--transparent)',
              }}
              variants={{
                hover: {
                  background: 'var(--green)',
                },
              }}
            >
              {c}
            </motion.div>
          ))}
        </motion.div>
        <div className="px-1 text-lg">{children}</div>
      </motion.div>
    </ResponsiveDialog.Close>
  );
}

function newGame(wordCount = 1, guessCount = 7) {
  useWordleStore
    .getState()
    .setGame({ targets: new Array(wordCount).fill(0).map(() => getRandomSolution()), guessCount });
}

export function NewGameDialog({ children }: PropsWithChildren) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialog.Trigger asChild>{children}</ResponsiveDialog.Trigger>

      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>New Game</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>Create new game</ResponsiveDialog.Description>
        </ResponsiveDialog.Header>

        <motion.div
          className="flex flex-col justify-between w-full gap-4"
          animate="entered"
          transition={{ staggerChildren: 0.1 }}
        >
          {Object.entries(GameModes).map(([name, mode]) => (
            <ModeButton key={name} onClick={() => newGame(mode.targetCount, mode.guessCount)} name={name}>
              {mode.description}
            </ModeButton>
          ))}
        </motion.div>

        <ResponsiveDialog.Footer></ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
