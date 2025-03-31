import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

test('タイトルが表示される', () => {
  render(<App />);
  expect(screen.getByText('階層ToDoリスト')).toBeInTheDocument();
});

test('タスクを追加できる', async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByPlaceholderText('タスク名を入力');
  const button = screen.getByRole('button', { name: '追加' });

  // 入力してボタンを押す
  await user.type(input, '新しいタスク');
  await user.click(button);

  // タスクがリストに追加されているか確認
  expect(screen.getByText('新しいタスク')).toBeInTheDocument();
});
