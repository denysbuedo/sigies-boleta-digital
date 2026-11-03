import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('renders heading and message', () => {
    render(<HomePage />);
    expect(screen.getByText('Portal del Aspirante')).toBeDefined();
    expect(screen.getByText(/Aplicación en construcción/i)).toBeDefined();
  });
});