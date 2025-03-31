import { render, screen } from '@testing-library/react';
import App from './App';

test('タイトルが表示される', () => {
  render(<App />);
  expect(screen.getByText('階層ToDoリスト')).toBeInTheDocument();
});
