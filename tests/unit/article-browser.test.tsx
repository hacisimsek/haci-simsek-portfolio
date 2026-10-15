import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ArticleBrowser from '@/components/collections/article-browser';
import { renderWithIntl as render } from './render';

const article = (title: string, categories: string[], publishedAt: string) => ({
  title,
  url: `https://medium.com/@hacisimsek/${title.toLowerCase()}`,
  excerpt: `${title} excerpt`,
  categories,
  thumbnail: '',
  publishedAt,
});

const articles = [
  article('Saga', ['microservices', 'saga-pattern'], '2025-05-11T00:00:00Z'),
  article('Breaker', ['resilience', 'microservices'], '2024-01-01T00:00:00Z'),
];

const titles = () =>
  screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);

describe('ArticleBrowser', () => {
  it('searches and filters by topic', async () => {
    const user = userEvent.setup();
    render(<ArticleBrowser articles={articles} />);

    await user.type(screen.getByLabelText('Search'), 'saga');
    expect(titles()).toEqual(['Saga']);
    await user.clear(screen.getByLabelText('Search'));

    const topics = screen.getByRole('group', { name: 'Topic' });
    await user.click(
      within(topics).getByRole('button', { name: 'Resilience' })
    );
    expect(titles()).toEqual(['Breaker']);
    // Topics read as words, while filtering still uses the slug.
    await user.click(
      within(topics).getByRole('button', { name: 'Saga pattern' })
    );
    expect(titles()).toEqual(['Saga']);
  });

  it('sorts oldest first', async () => {
    const user = userEvent.setup();
    render(<ArticleBrowser articles={articles} />);
    await user.selectOptions(screen.getByLabelText('Sort'), 'oldest');
    expect(titles()).toEqual(['Breaker', 'Saga']);
  });
});
