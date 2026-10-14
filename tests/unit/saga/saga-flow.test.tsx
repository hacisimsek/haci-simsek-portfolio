import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SagaFlow, { TICK_MS } from '@/components/saga/saga-flow';
import { HOLD_TICKS } from '@/lib/saga';
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
    expect(shipping).toHaveAttribute('data-status', 'idle');
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
});
