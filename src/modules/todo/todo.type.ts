export interface Todo {
  id: string;
  todo: string;
  is_complete: boolean;
  created_at: Date;
}

export interface TotalTodo {
  count: string;
}
