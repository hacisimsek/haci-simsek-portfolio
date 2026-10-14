'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { openMailto } from '@/lib/mailto';

export default function CopyEmailButton({ email }: { email: string }) {
  const msg = useTranslations('Footer');
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: fall back to the mail client.
      openMailto(email);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="rounded-full px-6"
        onClick={copy}
      >
        {copied ? (
          <Check aria-hidden className="mr-2 h-4 w-4 text-accent" />
        ) : (
          <Copy aria-hidden className="mr-2 h-4 w-4" />
        )}
        {msg('copyEmail')}
      </Button>
      <p role="status" className="text-sm text-muted-foreground">
        {copied ? msg('copied') : ''}
      </p>
    </>
  );
}
