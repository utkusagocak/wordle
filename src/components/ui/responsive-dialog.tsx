import React, { PropsWithChildren } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type MixedProps<
  D extends React.JSXElementConstructor<any>,
  M extends React.JSXElementConstructor<any>,
> = React.ComponentProps<D> & React.ComponentProps<M>;

const desktop = '(min-width: 768px)';
function useIsDesktop<T extends PropsWithChildren>(
  DesktopComponent: React.FC<T>,
  MobileComponent: React.FC<T>,
  props: T,
) {
  const isDesktop = useMediaQuery(desktop);
  return isDesktop ? <DesktopComponent {...props} /> : <MobileComponent {...props} />;
}

const Root = (props: MixedProps<typeof Dialog, typeof Drawer>) => useIsDesktop(Dialog, Drawer, props);

const Trigger = (props: MixedProps<typeof DialogTrigger, typeof DrawerTrigger>) =>
  useIsDesktop(DialogTrigger, DrawerTrigger, props);

const Close = (props: MixedProps<typeof DialogClose, typeof DrawerClose>) =>
  useIsDesktop(DialogClose, DrawerClose, props);

const Content = (props: MixedProps<typeof DialogContent, typeof DrawerContent>) =>
  useIsDesktop(DialogContent, DrawerContent, props);

const Description = (props: MixedProps<typeof DialogDescription, typeof DrawerDescription>) =>
  useIsDesktop(DialogDescription, DrawerDescription, props);

const Header = (props: MixedProps<typeof DialogHeader, typeof DrawerHeader>) =>
  useIsDesktop(DialogHeader, DrawerHeader, props);

const Title = (props: MixedProps<typeof DialogTitle, typeof DrawerTitle>) =>
  useIsDesktop(DialogTitle, DrawerTitle, props);

const Footer = (props: MixedProps<typeof DialogFooter, typeof DrawerFooter>) =>
  useIsDesktop(DialogFooter, DrawerFooter, props);

export const ResponsiveDialog = Object.assign(Root, {
  Trigger,
  Close,
  Content,
  Description,
  Header,
  Title,
  Footer,
});
