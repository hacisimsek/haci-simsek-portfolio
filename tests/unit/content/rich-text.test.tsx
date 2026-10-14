import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RichText } from '@/lib/rich-text';

describe('RichText', () => {
  it('renders **markers** as strong text', () => {
    const { container } = render(
      <p>
        <RichText text="Built with **Java 11** and **Spring Boot**." />
      </p>
    );
    expect(container.innerHTML).toBe(
      '<p>Built with <strong class="font-semibold text-foreground">Java 11</strong> and <strong class="font-semibold text-foreground">Spring Boot</strong>.</p>'
    );
  });

  it('leaves an unmatched marker as literal text', () => {
    const { container } = render(
      <p>
        <RichText text="a **b and c" />
      </p>
    );
    expect(container.textContent).toBe('a **b and c');
    expect(container.querySelector('strong')).toBeNull();
  });
});
