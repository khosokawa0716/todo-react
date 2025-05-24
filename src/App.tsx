import { useState, useEffect } from 'react';
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
import { Undo2 } from 'lucide-react';

const initialTodos: TodoItem[] = [
  {
    id: 1,
    title: '親タスク1',
    parentId: null,
    isDeleted: false,
    isDone: false,
  },
  { id: 2, title: '子タスク1-1', parentId: 1, isDeleted: false, isDone: false },
  { id: 3, title: '子タスク1-2', parentId: 1, isDeleted: false, isDone: false },
  {
    id: 4,
    title: '親タスク2',
    parentId: null,
    isDeleted: false,
    isDone: false,
  },
  {
    id: 5,
    title: '孫タスク1-1-1',
    parentId: 2,
    isDeleted: false,
    isDone: false,
  },
];

const STORAGE_KEY = 'todo-items';

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
      isDeleted: false,
    };

    setTodos((prev) => [...prev, newTask]);
    setNewTitle('');
  };

  const handleAddChild = (parentId: number) => {
    const newTask: TodoItem = {
      id: Date.now(),
      title: '新しい子タスク',
      parentId,
      isDeleted: false,
    };
    setTodos((prev) => [...prev, newTask]);
  };

  const handleUpdateTitle = (id: number, newTitle: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))
    );
  };

  const handleDelete = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isDeleted: true } : todo))
    );
  };

  const handleRestore = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isDeleted: false } : todo
      )
    );
  };

  const deletedTodos = todos.filter((todo) => todo.isDeleted);

  const handleToggleDone = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedDate = date.replace(/\//g, '-'); // 日付をYYYY-MM-DD形式に変換
    // ファイル名に日付を追加
    const filename = `todos-${formattedDate}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        } else {
          alert('読み込んだファイルの形式が正しくありません。');
        }
      } catch (e) {
        alert('ファイルの読み込み中にエラーが発生しました。');
        console.error(e);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      } catch (e) {
        console.error('読み込みエラー:', e);
      }
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
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
                onUpdateTitle={handleUpdateTitle}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onToggleDone={handleToggleDone}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {deletedTodos.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            削除済みタスク
          </h2>
          <ul className="space-y-2">
            {deletedTodos.map((todo) => (
              <li
                key={todo.id}
                className="p-2 bg-gray-100 text-sm flex justify-between items-center rounded"
              >
                <span>{todo.title}</span>
                <button
                  onClick={() => handleRestore(todo.id)}
                  className="text-blue-500 hover:underline text-sm"
                  aria-label="復元"
                >
                  <Undo2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleExportJson}
        className="mt-4 text-sm text-blue-500 hover:underline"
      >
        タスクをJSONでダウンロード
      </button>
      <div className="mt-4">
        <label className="text-sm text-blue-500 hover:underline cursor-pointer">
          JSONファイルから読み込み
          <input
            type="file"
            accept="application/json"
            onChange={handleImportJson}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default App;
