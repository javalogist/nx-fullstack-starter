'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {Button} from '../ui/button';

import { MoonIcon, SunIcon } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="rounded-full"
    >
      {theme === 'dark' ? (
        <SunIcon color={"orange"} />
      ) : (
        <MoonIcon color={"black"}/>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
