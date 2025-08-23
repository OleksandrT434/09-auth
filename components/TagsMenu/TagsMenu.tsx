'use client';

import css from './TagsMenu.module.css';
import { useState } from 'react';
import Link from 'next/link';

const tags = [
    {id: 'All', name: 'All'},
    { id: 'Todo', name: 'Todo', },
     {id: 'Work', name: 'Work'},
    {id: 'Personal', name: 'Personal'},
    {id:'Meeting', name: 'Meeting'},
    {id:'Shopping', name: 'Shopping'},
];

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggleMenu} className={css.menuButton}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag.id} className={css.menuItem}>
              <Link
                      href={`/notes/filter/${tag.id}`}
                      className={css.menuLink}
                      onClick={() => setIsOpen(false)}
                 >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
