'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Users, Shield, BarChart, Bell, FileText, Settings, User } from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands = [
    { icon: Users, label: 'Users', value: 'users', action: () => router.push('/users') },
    { icon: Shield, label: 'Roles', value: 'roles', action: () => router.push('/roles') },
    { icon: BarChart, label: 'Analytics', value: 'analytics', action: () => router.push('/analytics') },
    { icon: Bell, label: 'Notifications', value: 'notifications', action: () => router.push('/notifications') },
    { icon: FileText, label: 'Files', value: 'files', action: () => router.push('/files') },
    { icon: Settings, label: 'Settings', value: 'settings', action: () => router.push('/settings') },
    { icon: User, label: 'Profile', value: 'profile', action: () => router.push('/profile') },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {commands.map((command) => {
            const Icon = command.icon;
            return (
              <CommandItem
                key={command.value}
                value={command.value}
                onSelect={() => {
                  command.action();
                  setOpen(false);
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{command.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
