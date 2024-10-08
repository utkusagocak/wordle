import { TileStatus } from '@/store';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { memo } from 'react';

const row = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const row2 = ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ''];
const row3 = ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'];

const CustomContent: Record<string, string | JSX.Element> = {
  ['Backspace']: <button className="flex-grow-[1.5]">⌫</button>,
  ['Enter']: <button className="flex-grow-[1.5] text-base sm:text-xl">Enter</button>,
  ['']: <div className="pointer-events-none invisible flex-grow-[0.5]"></div>,
};

type AlphabetStats = Record<string, TileStatus[]>;

const bgMap = {
  [TileStatus.Empty]: 'hsl(var(--primary))',
  [TileStatus.Gray]: 'var(--gray)',
  [TileStatus.Yellow]: 'var(--yellow)',
  [TileStatus.Green]: 'var(--green)',
};

function getBackground(statuses: TileStatus[]) {
  if (!statuses) return 'hsl(var(--primary))';
  const step = 360 / statuses.length;
  const steps = statuses.map((status, index) => `${bgMap[status]} 0deg ${index * step}deg`);
  return `conic-gradient(${steps.join(',')})`;
}

export const Keyboard = memo(function Keyboard({
  className,
  status,
  onKeyboard = () => void 0,
  ...props
}: React.HTMLProps<HTMLDivElement> & { status: AlphabetStats; onKeyboard?: (key: string) => void }) {
  return (
    <div className={cn('flex gap-1 flex-col items-stretch select-none', className)} {...props}>
      {[row, row2, row3].map((row, index) => (
        <div key={index} className="flex flex-grow gap-1 items-stretch justify-center ">
          {row.map((c, i) => (
            <Button
              key={c + i}
              data-key={c}
              className={cn(
                'capitalize px-0 active:scale-[1.1] transition-transform duration-200 flex-1 text-lg sm:text-2xl',
              )}
              style={{
                background: getBackground(status[c]),
              }}
              onClick={() => onKeyboard(c)}
              asChild={CustomContent[c] ? true : false}
            >
              {CustomContent[c] ?? c}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
});
