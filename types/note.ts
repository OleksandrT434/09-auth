export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

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
