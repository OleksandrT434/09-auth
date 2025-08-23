'use client';

import React from "react";

import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from '../NotePreview.module.css';
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Note } from "@/types/note";


export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();


  const { data: note, isLoading, isError  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading...</p>
      </Modal>
    );
  }
  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Note not found.</p>
      </Modal>
    );
  }


  return (
    <Modal onClose={handleClose}>
    <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClose}>
        Back
      </button>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.updatedAt ?? note.createdAt}</p>
        </div>
        {note.tag && <p className={css.tag}>{note.tag}</p>}
    </div>
  </Modal>
  );
}
