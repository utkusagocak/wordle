import { cn } from '@/lib/utils';
import { useWordleStore } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';

export function SimpleToast({ className, ...props }: Omit<React.HTMLProps<HTMLDivElement>, 'children'>) {
  const message = useWordleStore((state) => state.message);

  return (
    <div className={cn('relative pointer-events-none', className)} {...props}>
      <AnimatePresence>
        {message && (
          <motion.div
            key={message.text}
            className={cn(
              'absolute top-4 text-nowrap bg-primary text-primary-foreground font-semibold min-w-min border rounded px-4 py-1',
              message.className,
            )}
            initial={{
              opacity: 0,
              x: '-50%',
              y: '-100%',
            }}
            animate={{ opacity: 1, x: '-50%', y: '0%' }}
            exit={{ opacity: 0, x: '-50%', y: '-100%' }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
