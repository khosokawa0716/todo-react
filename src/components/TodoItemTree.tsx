import { TodoItem } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  todo: TodoItem;
  allTodos: TodoItem[];
  depth?: number;
}

export const TodoItemTree = ({ todo, allTodos, depth = 0 }: Props) => {
  const children = allTodos.filter((t) => t.parentId === todo.id);
  const indent = `pl-${depth * 4}`;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={`mb-2 ${indent}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        className={`p-2 rounded ${
          depth === 0
            ? 'bg-white border font-bold'
            : depth === 1
              ? 'bg-gray-100'
              : 'bg-blue-50 text-sm'
        }`}
      >
        {todo.title}
      </div>
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <TodoItemTree
              key={child.id}
              todo={child}
              allTodos={allTodos}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
