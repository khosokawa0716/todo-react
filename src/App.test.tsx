import { render, screen, within } from '@testing-library/react';
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

test('子タスクを追加できる', async () => {
  render(<App />);
  const user = userEvent.setup();

  const input = screen.getByPlaceholderText('タスク名を入力');
  const button = screen.getByRole('button', { name: '追加' });

  // 入力してボタンを押す
  await user.type(input, '新しいタスク');
  await user.click(button);

  // "新しいタスク"　の中から子追加ボタンを取得
  const parent = screen.getByText('新しいタスク').closest('li');
  const childButton = within(parent!).getByRole('button', {
    name: '＋子を追加',
  });

  await user.click(childButton);
  // タスクがリストに追加されているか確認
  expect(screen.getByText('新しい子タスク')).toBeInTheDocument();
});
