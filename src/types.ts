export interface TodoItem {
  id: number;
  title: string;
  parentId: number | null;
}
