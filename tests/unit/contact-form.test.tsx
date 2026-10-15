import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '@/components/contact/contact-form';
import { renderWithIntl as render } from './render';

const message = 'We need help moving our checkout to services.';

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada');
  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.type(screen.getByLabelText('Message'), message);
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('explains every invalid field in Turkish and focuses the first', async () => {
    const user = userEvent.setup();
    render(<ContactForm />, { locale: 'tr' });

    await user.click(screen.getByRole('button', { name: 'Mesajı gönder' }));

    const name = screen.getByLabelText('Ad');
    await waitFor(() => expect(name).toHaveFocus());
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription(/en az 2 karakter/);
    expect(screen.getByLabelText('E-posta')).toHaveAccessibleDescription(
      /geçerli bir e-posta/
    );
    expect(screen.getByLabelText('Mesaj')).toHaveAccessibleDescription(
      /en az 20 karakter/
    );
  });

  it('sends once and shows the success panel', async () => {
    let resolve: (response: Response) => void = () => {};
    const fetchMock = vi.fn(
      () => new Promise<Response>((done) => (resolve = done))
    );
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);

    await fill(user);
    const button = screen.getByRole('button', { name: 'Send Message' });
    await user.click(button);
    await user.click(button);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Sending/ })).toBeDisabled();

    // The thank-you panel appears after a 600ms timer and focuses itself in an
    // effect. With a real timer, findBy can see the commit before that effect
    // runs, so drive the timer inside act() to flush the effect first.
    vi.useFakeTimers();
    await act(async () => resolve(new Response('{}')));
    expect(screen.getByRole('button', { name: /Sent/ })).toBeDisabled();
    await act(() => vi.advanceTimersByTimeAsync(600));

    expect(screen.getByRole('status', { name: /Thanks/ })).toHaveFocus();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the message and offers a retry when sending fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 500 }))
    );
    const user = userEvent.setup();
    render(<ContactForm />);

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send Message' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/could not be sent/);
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.getByLabelText('Message')).toHaveValue(message);
  });

  it('hides the honeypot and never sends when a bot fills it', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);

    const trap = container.querySelector<HTMLInputElement>(
      'input[name="_gotcha"]'
    )!;
    expect(trap).toHaveAttribute('tabindex', '-1');
    expect(trap).toHaveAttribute('autocomplete', 'off');
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();

    await fill(user);
    await user.type(trap, 'spam.example');
    await user.click(screen.getByRole('button', { name: 'Send Message' }));

    expect(
      await screen.findByRole('status', { name: /Thanks/ }, { timeout: 4000 })
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('still posts to Formspree without JavaScript', () => {
    const { container } = render(<ContactForm />);
    const form = container.querySelector('form')!;
    expect(form).toHaveAttribute('method', 'POST');
    expect(form).toHaveAttribute('action', 'https://formspree.io/f/xanyoozp');
  });

  it('asks what the message is about and sends the choice', async () => {
    const fetchMock = vi.fn(async () => new Response('{}'));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);

    const topic = screen.getByRole('radiogroup', {
      name: 'What is it about?',
    });
    const role = screen.getByRole('radio', { name: 'A role' });
    expect(role).toBeChecked();
    // Checked in the HTML too, so a post without JavaScript has a topic.
    expect(role).toHaveAttribute('checked');
    expect(topic).toContainElement(role);
    await user.click(
      screen.getByRole('radio', { name: 'A technical conversation' })
    );

    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send Message' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(JSON.parse(String(init.body))).toMatchObject({ topic: 'technical' });
  });

  it('offers the email address when sending fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}', { status: 500 }))
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send Message' }));
    const alert = await screen.findByRole('alert');
    expect(alert.querySelector('a[href^="mailto:"]')).not.toBeNull();
  });
});
