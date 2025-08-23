import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';


export interface PaginationProps {
    totalPages: number;
    onPageChange: (page: number) => void;
    currentPage: number;
}

export default function Pagination({ totalPages, onPageChange, currentPage }: PaginationProps) {
    if (totalPages <= 1)
    return null;
  
  
    return (
      <ReactPaginate
        className={css.pagination}
        pageCount={totalPages}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        forcePage={currentPage - 1}
        nextLabel="→"
        previousLabel="←"
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        activeClassName={css.active}
      />
    );
  }
