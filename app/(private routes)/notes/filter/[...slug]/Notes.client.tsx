"use client";
import css from './page.module.css';

import Pagination from '@/components/Pagination/Pagination';
import { useState, useEffect } from 'react';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';

interface PaginatedNotes {
  notes: Note[];
  totalPages: number;
}

type AppPageProps = {
  initialData?: PaginatedNotes;
  tag: string;
};

export default function AppPage({ initialData, tag }: AppPageProps) {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    setPage(1);
    setInputValue('');
    setDebouncedValue('');
  }, [tag]);

  const debounced = useDebouncedCallback((value: string) => {
    setDebouncedValue(value);
    setPage(1);
  }, 500);

  const handleSearch = (newInputSearch: string) => {
    setInputValue(newInputSearch);
    debounced(newInputSearch);
  };

  const tagParam = tag === 'All' ? undefined : tag;

  const { data } = useQuery<PaginatedNotes>({
    queryKey: ['notes', tagParam, page, debouncedValue],
    queryFn: () => fetchNotes(debouncedValue, page, tagParam),
    placeholderData: keepPreviousData,
    initialData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearch} />
        <Link href="/notes/action/create" className={css.createBtn}>
          + Create note
        </Link>
      </header>

      {notes.length > 0 && (
        <>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
          <NoteList notes={notes} />
        </>
      )}
    </div>
  );
}
