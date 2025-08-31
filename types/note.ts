export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: Tag
};
export type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export type NewNoteData = {
  title: string;
  content: string;
  tag?: string;
};

export type Params = {
  page: number;
  perPage: number;
  search?: string;
  sortBy?: 'created' | 'updated';
  tag?: string;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};
export interface FetchNotesParams{
    tag?: string;
    page?: number;
    perPage?: number;
    search?: string;
}
export interface NotesResponse{
  data: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}