import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithIntl as render } from './render';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';
import { openMailto } from '@/lib/mailto';
import en from '../../messages/en.json';
import tr from '../../messages/tr.json';

vi.mock('@/lib/mailto', () => ({ openMailto: vi.fn() }));

describe('Footer', () => {
  it('links each social icon to the right profile in a new tab', () => {
    render(<Footer />);

    const expected = {
      GitHub: 'https://github.com/hacisimsek',
      LinkedIn: 'https://www.linkedin.com/in/haci-simsek/',
      X: 'https://x.com/CodeWithHaci',
    };

    for (const [name, href] of Object.entries(expected)) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('points the call to action at the contact page', () => {
    render(<Footer />);
    expect(
      screen.getByRole('link', { name: /start a conversation/i })
    ).toHaveAttribute('href', '/contact');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('links the short build SHA when deployed', () => {
    vi.stubEnv(
      'VERCEL_GIT_COMMIT_SHA',
      '662ca9cc40dbccaac05477a86eccd1acefa7dd7c'
    );
    render(<Footer />);
    expect(screen.getByRole('link', { name: /662ca9c/ })).toHaveAttribute(
      'href',
      'https://github.com/hacisimsek/haci-simsek-portfolio/commit/662ca9cc40dbccaac05477a86eccd1acefa7dd7c'
    );
  });

  it('hides the build link outside a deployment', () => {
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '');
    render(<Footer />);
    expect(screen.queryByRole('link', { name: /build/i })).toBeNull();
  });

  it('leaves the wordmark and the local time to the hero and About', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer > p')).toBeNull();
    expect(screen.queryByText(/Istanbul/)).toBeNull();
  });

  it('calls the build a "derleme" in Turkish', () => {
    vi.stubEnv(
      'VERCEL_GIT_COMMIT_SHA',
      '662ca9cc40dbccaac05477a86eccd1acefa7dd7c'
    );
    render(<Footer />, { locale: 'tr' });
    expect(
      screen.getByRole('link', { name: /derleme 662ca9c/ })
    ).toBeInTheDocument();
  });

  it('closes the page with an honest, open invitation', () => {
    const { container } = render(<Footer />);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Open to the right conversation',
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/not actively looking/)).toBeInTheDocument();
    expect(container.querySelector('.surface-card')).toBeNull();
    expect(container.textContent).not.toMatch(/templates|selective/i);
  });

  it('copies the email address and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<Footer />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
    });
    expect(writeText).toHaveBeenCalledWith('hacisimsek23@gmail.com');
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
  });

  it('says so when it opens the mail client instead', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) },
    });
    render(<Footer />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
    });
    expect(screen.getByRole('status')).toHaveTextContent(
      'Opening your mail app'
    );
  });

  it('clears the confirmation so a second copy is announced again', async () => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<Footer />);
    const button = screen.getByRole('button', { name: 'Copy email' });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
    vi.useRealTimers();
  });

  it('opens the mail client when the clipboard is blocked', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) },
    });
    render(<Footer />, { locale: 'tr' });
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'E-postayı kopyala' })
      );
    });
    expect(openMailto).toHaveBeenCalledWith('hacisimsek23@gmail.com');
  });

  it('takes the employer from the profile, not from the copy', () => {
    expect(en.Footer.text).toContain('{company}');
    expect(tr.Footer.text).toContain('{company}');
    render(<Footer />, { locale: 'tr' });
    expect(screen.getByText(/Sisal’deyim/)).toBeInTheDocument();
  });

  it('uses the internal arrow and the Turkish title', () => {
    const { container } = render(<Footer />, { locale: 'tr' });
    expect(
      screen.getByRole('heading', { level: 2, name: 'Doğru tekliflere açığım' })
    ).toBeInTheDocument();
    const contact = screen.getByRole('link', { name: /Bir konuşma başlat/ });
    expect(contact.querySelector('.lucide-arrow-right')).not.toBeNull();
    expect(container.querySelector('.lucide-arrow-up-right')).toBeNull();
  });

  it('re-announces a quick second copy and keeps it on screen', async () => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<Footer />);
    const button = screen.getByRole('button', { name: 'Copy email' });
    await act(async () => {
      fireEvent.click(button);
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await act(async () => {
      fireEvent.click(button);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // The second copy restarted the message, so it has not cleared yet.
    expect(screen.getByRole('status')).toHaveTextContent('Email copied');
    vi.useRealTimers();
  });

  it('draws the band rule full width and lets the bottom row follow it', () => {
    render(<Footer />);
    const band = screen
      .getByRole('heading', { name: 'Open to the right conversation' })
      .closest('section')!;
    expect(band).not.toHaveClass('border-t');
    expect(band.parentElement).toHaveClass('border-t');
    const bottom = screen
      .getByRole('link', { name: 'GitHub' })
      .closest('div')!.parentElement!;
    expect(bottom.className).not.toMatch(/\bmt-14\b/);
  });
});
