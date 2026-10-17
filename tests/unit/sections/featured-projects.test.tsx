import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FeaturedProjects from '@/components/sections/featured-projects';
import type { FeaturedRepo } from '@/lib/featured';
import { renderWithIntl as render } from '../render';

const repo = (name: string, flagship = false): FeaturedRepo => ({
  name,
  description: `${name} description`,
  url: `https://github.com/hacisimsek/${name}`,
  language: 'Java',
  updatedAt: '2026-01-01T00:00:00Z',
  flagship,
});

describe('FeaturedProjects', () => {
  it('shows the saga demo beside the flagship it comes from', () => {
    render(
      <FeaturedProjects
        repos={[repo('ecommerce-microservices', true), repo('notifyhub')]}
      />
    );
    const section = screen.getByRole('region', { name: 'Featured projects' });
    expect(
      within(section).getByRole('figure', { name: 'An order saga' })
    ).toBeInTheDocument();
  });

  it('leaves the demo out when the flagship is missing from the feed', () => {
    render(<FeaturedProjects repos={[repo('notifyhub')]} />);
    expect(screen.queryByRole('figure')).toBeNull();
  });

  it('renders nothing for an empty feed', () => {
    const { container } = render(<FeaturedProjects repos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
