import { TodoItem } from './types';
import { useState } from 'react';

const initialTodos: TodoItem[] = [
  { id: 1, title: '親タスク1', parentId: null },
  { id: 2, title: '子タスク1-1', parentId: 1 },
  { id: 3, title: '子タスク1-2', parentId: 1 },
  { id: 4, title: '親タスク2', parentId: null },
  { id: 5, title: '孫タスク1-1-1', parentId: 2 },
];

const App = () => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  return (
    <div>
      <h1>階層ToDoリスト</h1>
      <ul>
        {todos
          .filter(todo => todo.parentId === null) // 親タスク
          .map(parent => (
            <li key={parent.id}>
              {parent.title}
              <ul>
                {todos
                  .filter(child => child.parentId === parent.id) // 子タスク
                  .map(child => (
                    <li key={child.id}>
                      {child.title}
                      <ul>
                        {todos
                          .filter(grandChild => grandChild.parentId === child.id) // 孫タスク
                          .map(grandChild => (
                            <li key={grandChild.id}>{grandChild.title}</li>
                          ))}
                      </ul>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
