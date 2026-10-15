import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('fills with the accent by default: purple only means undo', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'bg-accent',
      'text-accent-foreground'
    );
    expect(screen.getByRole('button').className).not.toMatch(/primary/);
  });

  it('draws links in the accent too', () => {
    render(<Button variant="link">Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-accent');
  });

  it.each(['outline', 'ghost'] as const)(
    'keeps %s quiet on hover so it never looks like the primary action',
    (variant) => {
      render(<Button variant={variant}>Go</Button>);
      const button = screen.getByRole('button');
      expect(button.className).not.toMatch(/hover:bg-accent\b/);
      expect(button).toHaveClass('hover:bg-secondary');
    }
  );
});
