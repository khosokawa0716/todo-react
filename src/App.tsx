import { useState } from 'react';
import { TodoItem } from './types';
import { TodoItemTree } from './components/TodoItemTree';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

const initialTodos: TodoItem[] = [
  { id: 1, title: '親タスク1', parentId: null },
  { id: 2, title: '子タスク1-1', parentId: 1 },
  { id: 3, title: '子タスク1-2', parentId: 1 },
  { id: 4, title: '親タスク2', parentId: null },
  { id: 5, title: '孫タスク1-1-1', parentId: 2 },
];

const App = () => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newTitle, setNewTitle] = useState('');

  const parentTodos = todos.filter((todo) => todo.parentId === null);
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = parentTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = parentTodos.findIndex((todo) => todo.id === over.id);

      const newOrder = arrayMove(parentTodos, oldIndex, newIndex);

      // 親タスクの順番だけ更新
      const reorderedTodos = [
        ...newOrder,
        ...todos.filter((todo) => todo.parentId !== null),
      ];

      setTodos(reorderedTodos);
    }
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;

    const newTask: TodoItem = {
      id: Date.now(), // ユニークな数値IDとして利用
      title: newTitle.trim(),
      parentId: null, // 今回は親タスクとして追加
    };

    setTodos((prev) => [...prev, newTask]);
    setNewTitle('');
  };

  const handleAddChild = (parentId: number) => {
    console.log('called handleAddChild');
    console.log(parentId);
    const newTask: TodoItem = {
      id: Date.now(),
      title: '新しい子タスク',
      parentId,
    };
    setTodos((prev) => [...prev, newTask]);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">階層ToDoリスト</h1>

      {/* フォーム */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">
          新しいタスクの追加
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="タスク名を入力"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            追加
          </button>
        </div>
      </div>

      {/* ToDo表示 + DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={parentTodos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-4">
            {parentTodos.map((parent) => (
              <TodoItemTree
                key={parent.id}
                todo={parent}
                allTodos={todos}
                onAddChild={handleAddChild}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default App;
