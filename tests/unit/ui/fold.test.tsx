import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Fold from '@/components/ui/fold';
import { renderWithIntl as render } from '../render';

describe('Fold', () => {
  // Items mark themselves as folded with a class keyed to the group's
  // data-open; the group only owns the state and the phone-only button.
  it('opens and closes the group with one phone-only button', async () => {
    const { container } = render(
      <Fold hidden={2}>
        <p>always</p>
      </Fold>
    );
    const group = container.querySelector('[data-open]')!;
    expect(group).toHaveAttribute('data-open', 'false');
    expect(group.className).toContain('group/fold');

    const button = screen.getByRole('button', { name: 'Show 2 more' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', group.id);
    expect(button.className).toContain('md:hidden');

    await userEvent.click(button);
    expect(group).toHaveAttribute('data-open', 'true');
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('uses a given label instead of the count', () => {
    render(
      <Fold hidden={2} more="Read more">
        <p>x</p>
      </Fold>
    );
    expect(screen.getByRole('button', { name: 'Read more' })).toBeVisible();
  });

  it('adds no button when nothing is folded', () => {
    render(
      <Fold hidden={0}>
        <p>all</p>
      </Fold>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('speaks Turkish on the Turkish pages', () => {
    render(
      <Fold hidden={2}>
        <p>x</p>
      </Fold>,
      { locale: 'tr' }
    );
    expect(
      screen.getByRole('button', { name: '2 tane daha göster' })
    ).toBeInTheDocument();
  });
});
