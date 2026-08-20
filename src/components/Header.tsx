import HeaderClient from './HeaderClient';
import type { MenuItem, Theme } from '@/types';

interface HeaderProps {
  menu: MenuItem[];
  theme?: Theme;
}

export default function Header({ menu, theme }: HeaderProps) {
  return <HeaderClient menu={menu} theme={theme} />;
}
