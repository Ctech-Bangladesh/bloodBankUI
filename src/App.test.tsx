import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import LangState from './context/lang';

test('renders the application header title', () => {
  render(
    <LangState>
      <App />
    </LangState>
  );
  const title = screen.getByText(/Department of Transfusion Medicine/i);
  expect(title).toBeInTheDocument();
});
