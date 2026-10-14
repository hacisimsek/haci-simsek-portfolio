import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutBento from '@/components/sections/about-bento';
import { renderWithIntl as render } from '../render';

const article = {
  title: 'What is the Saga Pattern?',
  url: 'https://medium.com/@hacisimsek/saga',
  excerpt: '',
  categories: [],
  thumbnail: '',
  publishedAt: '2026-01-01T00:00:00.000Z',
};

describe('AboutBento', () => {
  it('computes the years of experience in the intro', () => {
    render(<AboutBento />);
    expect(
      screen.getByText(/Software engineer with \d+ years of experience/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/\{years\}/)).toBeNull();
  });

  it('shows the portrait, current role and the scholarship', () => {
    render(<AboutBento />);
    expect(
      screen.getByRole('img', { name: 'Haci Simsek' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Software Development Senior Specialist')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Full scholarship at Bahçeşehir University')
    ).toBeInTheDocument();
  });

  it('links the latest article when the feed has one', () => {
    render(<AboutBento latestArticle={article} />);
    expect(screen.getByRole('link', { name: /Saga Pattern/ })).toHaveAttribute(
      'href',
      article.url
    );
  });

  it('drops the article card without a feed', () => {
    render(<AboutBento />);
    expect(screen.queryByText('Latest article')).not.toBeInTheDocument();
  });

  it('renders a time placeholder until the client clock starts', () => {
    render(<AboutBento />);
    expect(screen.getByText(/Local time in Istanbul/)).toBeInTheDocument();
  });
});
