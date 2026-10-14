import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Stats from '@/components/sections/stats';
import { renderWithIntl as render } from '../render';

describe('Stats', () => {
  it('renders final values with translated labels', () => {
    render(
      <Stats
        stats={[
          { id: 'years', value: 5 },
          { id: 'repos', value: 1234 },
        ]}
      />,
      { locale: 'tr' }
    );
    expect(screen.getByText('Yıl deneyim')).toBeInTheDocument();
    expect(screen.getAllByText('1.234').length).toBeGreaterThan(0);
  });
});
