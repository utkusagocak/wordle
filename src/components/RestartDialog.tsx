import { PropsWithChildren } from 'react';
import { ResponsiveDialog } from './ui/responsive-dialog';
import { Button } from './ui/button';
import { useWordleStore } from '@/store';

export function RestartDialog({ children }: PropsWithChildren) {
  function restart() {
    const { game, setGame } = useWordleStore.getState();
    setGame({ targets: game.targets, guessCount: game.guessCount });
  }
  return (
    <ResponsiveDialog>
      <ResponsiveDialog.Trigger asChild>{children}</ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>Restart</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>Reset the current game.</ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
        <ResponsiveDialog.Footer>
          <ResponsiveDialog.Close asChild>
            <Button variant={'ghost'}>Cancel</Button>
          </ResponsiveDialog.Close>
          <ResponsiveDialog.Close asChild>
            <Button onClick={restart}>Restart</Button>
          </ResponsiveDialog.Close>
        </ResponsiveDialog.Footer>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  );
}
