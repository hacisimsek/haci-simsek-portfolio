import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Marquee from '@/components/motion/marquee';

describe('Marquee', () => {
  it('exposes the items once and hides the looping copy', () => {
    render(<Marquee label="Stack" items={['Java', 'Kafka']} />);
    const region = screen.getByRole('region', { name: 'Stack' });
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    const lists = region.querySelectorAll('ul');
    expect(lists).toHaveLength(2);
    expect(lists[1]).toHaveAttribute('aria-hidden', 'true');
    expect(lists[1]).toHaveAttribute('inert');
  });
});
