import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SagaFlow, { TICK_MS } from '@/components/saga/saga-flow';
import { HOLD_TICKS, VISITOR_HOLD_TICKS } from '@/lib/saga';
import { renderWithIntl as render } from '../render';

function advance(ticks: number) {
  act(() => {
    vi.advanceTimersByTime(TICK_MS * ticks);
  });
}

describe('SagaFlow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the four services as a captioned figure', () => {
    render(<SagaFlow />);
    const figure = screen.getByRole('figure');
    const steps = within(figure).getAllByRole('listitem');
    expect(steps).toHaveLength(4);
    expect(steps[0]).toHaveTextContent('Order service');
    expect(steps[0]).toHaveTextContent('Create order');
    expect(steps[3]).toHaveTextContent('Shipping');
    expect(figure.querySelector('figcaption')).toHaveTextContent(/saga/i);
  });

  it('starts as a finished run, then plays a happy run by itself', () => {
    render(<SagaFlow />);
    for (const step of screen.getAllByRole('listitem'))
      expect(step).toHaveAttribute('data-status', 'done');
    advance(HOLD_TICKS);
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute(
      'data-status',
      'running'
    );
    advance(4);
    const steps = screen.getAllByRole('listitem');
    for (const step of steps)
      expect(step).toHaveAttribute('data-status', 'done');
    // A run the visitor did not start is not announced.
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('fails inventory on demand and undoes the earlier steps', () => {
    render(<SagaFlow />);
    advance(1);
    fireEvent.click(screen.getByRole('button', { name: 'Run with a failure' }));
    advance(5);
    const [order, payment, inventory, shipping] =
      screen.getAllByRole('listitem');
    expect(inventory).toHaveAttribute('data-status', 'failed');
    expect(inventory).toHaveTextContent('Out of stock');
    expect(payment).toHaveAttribute('data-status', 'compensated');
    expect(payment).toHaveTextContent('Refund payment');
    expect(order).toHaveTextContent('Cancel order');
    expect(shipping).toHaveAttribute('data-status', 'skipped');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Inventory failed. Payment refunded and order cancelled.'
    );
  });

  it('does not stack timers when the button is pressed twice', () => {
    render(<SagaFlow />);
    const button = screen.getByRole('button', { name: 'Run with a failure' });
    fireEvent.click(button);
    fireEvent.click(button);
    advance(2);
    expect(screen.getAllByRole('listitem')[2]).toHaveAttribute(
      'data-status',
      'running'
    );
  });

  it('speaks Turkish', () => {
    render(<SagaFlow />, { locale: 'tr' });
    expect(
      screen.getByRole('button', { name: 'Hata senaryosunu çalıştır' })
    ).toBeInTheDocument();
    expect(screen.getByText('Sipariş servisi')).toBeInTheDocument();
  });

  it('keeps the outcome with the still result when motion is reduced', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener() {},
          removeEventListener() {},
        }) as unknown as MediaQueryList
    );
    render(<SagaFlow />);
    advance(HOLD_TICKS + 2);
    // Nothing moves on its own.
    for (const step of screen.getAllByRole('listitem'))
      expect(step).toHaveAttribute('data-status', 'done');
    fireEvent.click(screen.getByRole('button', { name: 'Run with a failure' }));
    advance(5 + HOLD_TICKS + 2);
    expect(screen.getAllByRole('listitem')[2]).toHaveAttribute(
      'data-status',
      'failed'
    );
    expect(screen.getByRole('status')).toHaveTextContent('Inventory failed.');
    matchMedia.mockRestore();
  });

  it('does not tick in a tab that is hidden at load', () => {
    const visibility = vi
      .spyOn(document, 'visibilityState', 'get')
      .mockReturnValue('hidden');
    render(<SagaFlow />);
    advance(HOLD_TICKS + 2);
    for (const step of screen.getAllByRole('listitem'))
      expect(step).toHaveAttribute('data-status', 'done');
    visibility.mockRestore();
  });

  it('gives the first step a full tick after the button', () => {
    render(<SagaFlow />);
    act(() => {
      vi.advanceTimersByTime(TICK_MS / 2);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Run with a failure' }));
    act(() => {
      vi.advanceTimersByTime(TICK_MS - 1);
    });
    const [order] = screen.getAllByRole('listitem');
    expect(order).toHaveAttribute('data-status', 'running');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(order).toHaveAttribute('data-status', 'done');
  });

  it('is named plainly and keeps status labels on one line', () => {
    render(<SagaFlow />, { locale: 'tr' });
    expect(
      screen.getByRole('figure', { name: "Bir sipariş saga'sı" })
    ).toBeInTheDocument();
    expect(screen.getByText('Karttan tahsil et')).toBeInTheDocument();
    for (const label of screen.getAllByText('Tamam'))
      expect(label).toHaveClass('shrink-0');
  });

  it('marks shipping skipped and keeps the result long enough to read', () => {
    render(<SagaFlow />);
    fireEvent.click(screen.getByRole('button', { name: 'Run with a failure' }));
    advance(5);
    const shipping = screen.getAllByRole('listitem')[3];
    expect(shipping).toHaveAttribute('data-status', 'skipped');
    expect(shipping).toHaveTextContent('Skipped');
    advance(VISITOR_HOLD_TICKS - 1);
    expect(screen.getByRole('status')).toHaveTextContent('Inventory failed.');
  });

  it('can be paused and played', () => {
    render(<SagaFlow />);
    const pause = screen.getByRole('button', { name: 'Pause' });
    expect(pause).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(pause);
    expect(pause).toHaveAttribute('aria-pressed', 'true');
    // The latched state is visible, not only announced.
    expect(pause).toHaveClass('aria-pressed:bg-secondary');
    advance(HOLD_TICKS + 2);
    for (const step of screen.getAllByRole('listitem'))
      expect(step).toHaveAttribute('data-status', 'done');
    fireEvent.click(pause);
    advance(HOLD_TICKS);
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute(
      'data-status',
      'running'
    );
  });

  it('still plays a visitor run while auto-play is paused', () => {
    render(<SagaFlow />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    fireEvent.click(screen.getByRole('button', { name: 'Run with a failure' }));
    advance(5);
    expect(screen.getAllByRole('listitem')[2]).toHaveAttribute(
      'data-status',
      'failed'
    );
  });

  it('offers no pause control when nothing moves on its own', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener() {},
          removeEventListener() {},
        }) as unknown as MediaQueryList
    );
    render(<SagaFlow />);
    expect(screen.queryByRole('button', { name: 'Pause' })).toBeNull();
    matchMedia.mockRestore();
  });
});
