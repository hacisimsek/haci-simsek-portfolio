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
});
