'use client';

import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          'dialog-content fixed top-[15vh] left-1/2 z-[71] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl outline-none',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
