import { TodoItem } from './types';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem.tsx';

const initialTodos: TodoItem[] = [
  { id: 1, title: '親タスク1', parentId: null },
  { id: 2, title: '子タスク1-1', parentId: 1 },
  { id: 3, title: '子タスク1-2', parentId: 1 },
  { id: 4, title: '親タスク2', parentId: null },
  { id: 5, title: '孫タスク1-1-1', parentId: 2 },
];

const App = () => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const parentTodos = todos.filter((todo) => todo.parentId === null);

  // DnD用のセンサー
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

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">階層ToDoリスト</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={parentTodos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {parentTodos.map((parent) => (
              <SortableItem key={parent.id} id={parent.id} title={parent.title}>
                <ul>
                  {todos
                    .filter((child) => child.parentId === parent.id) // 子タスク
                    .map((child) => (
                      <li key={child.id}>
                        {child.title}
                        <ul>
                          {todos
                            .filter(
                              (grandChild) => grandChild.parentId === child.id
                            ) // 孫タスク
                            .map((grandChild) => (
                              <li key={grandChild.id}>{grandChild.title}</li>
                            ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default App;
