import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: number;
  title: string;
  children?: React.ReactNode;
}

export const SortableItem = ({ id, title, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px',
    border: '1px solid #ccc',
    marginBottom: '8px',
    backgroundColor: '#f9f9f9',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {title}
      {children}
    </li>
  );
};
