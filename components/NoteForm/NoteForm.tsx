'use client';

import css from './NoteForm.module.css';
import {  useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/api'; 
import { useRouter } from 'next/navigation';
import { useNoteDraft } from '@/lib/store/noteStore';

interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}



export default function NoteForm() {
  const {draft, setDraft, clearDraft } = useNoteDraft()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (noteData: NewNoteData) => createNote(noteData),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      router.back();
    },
  });
  
  const router = useRouter(); 

  async function handleSubmit(formData: FormData) {
    const noteData: NewNoteData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };

    mutation.mutate(noteData);

  }
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setDraft({
    ...draft,       
    [name]: value,   
  });
};
      

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          maxLength={500}

        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="reset" className={css.cancelButton} onClick={() =>
          router.back()}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}