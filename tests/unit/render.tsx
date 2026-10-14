import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import en from '../../messages/en.json';
import tr from '../../messages/tr.json';

const messages = { en, tr };

export function renderWithIntl(
  ui: ReactElement,
  { locale = 'en' }: { locale?: 'en' | 'tr' } = {}
) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={messages[locale]}
      timeZone="Europe/Istanbul"
    >
      {ui}
    </NextIntlClientProvider>
  );
}
