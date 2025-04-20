export interface TodoItem {
  id: number;
  title: string;
  parentId: number | null;
  isDeleted: boolean | null;
}
