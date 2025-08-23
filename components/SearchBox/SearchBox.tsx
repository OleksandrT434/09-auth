import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onSearch: (newInputStarch: string) => void;
}

export default function SearchBox({ value, onSearch, }: SearchBoxProps) {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    }
        return (
            <input
                className={css.input}
                type="text"
                placeholder="Search notes"
                value={value}
                onChange={handleInputChange}
            />
        );
}
