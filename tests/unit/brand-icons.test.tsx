import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from '@/components/icons/brand-icons';

describe('brand icons', () => {
  it.each([
    ['GithubIcon', GithubIcon, 2],
    ['LinkedinIcon', LinkedinIcon, 3],
    ['XIcon', XIcon, 1],
  ] as const)('%s renders a decorative 24px stroke icon', (_, Icon, shapes) => {
    const { container } = render(<Icon className="h-4 w-4" />);
    const svg = container.querySelector('svg')!;

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('h-4', 'w-4');
    expect(svg.querySelectorAll('path, rect, circle')).toHaveLength(shapes);
  });
});
