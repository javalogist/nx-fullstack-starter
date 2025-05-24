"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';



const navItems = [
  { label: "Dashboard", href: "/admin/app-shell" },
  { label: "App 1", href: "/admin/app1" },
  { label: "App 2", href: "/admin/app2" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const renderNavLinks = () =>
    navItems.map((item) => (
      <Link href={item.href} key={item.href}>
        <Button
          variant={pathname === item.href ? "default" : "ghost"}
          className="w-full justify-start"
        >
          {item.label}
        </Button>
      </Link>
    ));

  return (
    <div className="flex h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-muted p-4 border-r">
        <div className="mb-6 text-lg font-bold tracking-wide">
          Kodevy Core
        </div>
        <nav className="space-y-1">{renderNavLinks()}</nav>
      </aside>

      {/* Main Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-4 py-2 bg-background">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <div className="mb-4 font-bold text-lg">Kodevy Core</div>
                <nav className="space-y-1">{renderNavLinks()}</nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Title */}
          <div className="text-lg font-semibold">App Panel</div>

          {/* Avatar/User */}
          <div>
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
