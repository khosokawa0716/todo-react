import { TodoItem } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
  todo: TodoItem;
  allTodos: TodoItem[];
  depth?: number;
  onAddChild: (parentId: number) => void;
}

export const TodoItemTree = ({
  todo,
  allTodos,
  depth = 0,
  onAddChild,
}: Props) => {
  const children = allTodos.filter((t) => t.parentId === todo.id);
  const indent = `pl-${depth * 4}`;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li className={`mb-2 ${indent}`} ref={setNodeRef} style={style}>
      <div
        className={`p-2 rounded ${
          depth === 0
            ? 'bg-white border font-bold'
            : depth % 2 === 1
              ? 'bg-gray-100'
              : 'bg-blue-50 text-sm'
        }`}
      >
        {/* 左側：DnDハンドル + タイトル */}
        <div className="flex items-center gap-2">
          <span className="cursor-move" {...attributes} {...listeners}>
            <GripVertical className="w-4 h-4 text-gray-400" />
          </span>
          <span>{todo.title}</span>
        </div>
        {/* 右側：子タスク追加ボタン */}
        <button
          onClick={() => onAddChild(todo.id)}
          className="ml-2 text-sm text-blue-500 hover:underline"
        >
          ＋子を追加
        </button>
      </div>
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <TodoItemTree
              key={child.id}
              todo={child}
              allTodos={allTodos}
              depth={depth + 1}
              onAddChild={onAddChild}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
