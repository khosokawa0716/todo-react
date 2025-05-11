import { useState } from 'react';
import { TodoItem } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

interface Props {
  todo: TodoItem;
  allTodos: TodoItem[];
  depth?: number;
  onAddChild: (parentId: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onToggleDone: (id: number) => void;
}

export const TodoItemTree = ({
  todo,
  allTodos,
  depth = 0,
  onAddChild,
  onUpdateTitle,
  onDelete,
  onRestore,
  onToggleDone,
}: Props) => {
  const children = allTodos.filter((t) => t.parentId === todo.id);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSubmit = () => {
    onUpdateTitle(todo.id, editTitle.trim() || todo.title);
    setIsEditing(false);
  };

  if (todo.isDeleted) return null;

  const handleDeleteClick = () => {
    onDelete(todo.id);
  };

  return (
    <li
      data-testid={`todo-${todo.id}`}
      className="mb-2 pl-2"
      ref={setNodeRef}
      style={style}
    >
      <div
        data-testid={`todo-${todo.id}-title-container`}
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
          <input
            type="checkbox"
            checked={!!todo.isDone}
            onChange={() => onToggleDone(todo.id)}
            className="mr-2"
          />
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
              className="border px-1 text-sm w-full"
            />
          ) : (
            <>
              <span className={todo.isDone ? 'line-through text-gray-400' : ''}>
                {todo.title}
              </span>
              <button
                onClick={() => {
                  setEditTitle(todo.title); // 念のため再設定
                  setIsEditing(true);
                }}
                className="text-gray-500 hover:text-blue-500"
                aria-label="タイトルを編集"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-sm text-red-500 hover:underline"
                aria-label="タイトルを削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
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
              onUpdateTitle={onUpdateTitle}
              onDelete={onDelete}
              onRestore={onRestore}
              onToggleDone={onToggleDone}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
