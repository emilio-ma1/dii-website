import { useState, useRef, useEffect } from "react";

/**
 * Autocomplete component to select multiple authors safely.
 *
 * @param {object} props The properties object.
 * @param {Array<object>} props.availableUsers List of available users to search.
 * @param {Array<object>} props.selectedAuthors List of currently selected authors.
 * @param {Function} props.onAddAuthor Callback executed when an author is added.
 * @param {Function} props.onRemoveAuthor Callback executed when an author is removed.
 * @returns {JSX.Element} The rendered autocomplete component.
 */
export function AuthorAutocomplete({ availableUsers, selectedAuthors, onAddAuthor, onRemoveAuthor }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const lowerInput = inputValue.toLowerCase();
    const filteredUsers = availableUsers.filter((user) => {
      const isAlreadySelected = selectedAuthors.some((author) => author.id === user.id);
      return !isAlreadySelected && user.full_name.toLowerCase().includes(lowerInput);
    });

    setSuggestions(filteredUsers);
    setIsOpen(filteredUsers.length > 0);
  }, [inputValue, availableUsers, selectedAuthors]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSuggestion = (user) => {
    onAddAuthor(user);
    setInputValue("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="mb-2 block text-sm font-medium text-[#722b4d]">
        Autores (Docentes y Egresados)
      </label>

      <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 transition focus-within:border-[#722b4d] focus-within:ring-2 focus-within:ring-[#722b4d]/20">
        {selectedAuthors.map((author) => (
          <span
            key={author.id}
            className="flex items-center gap-1 rounded-md bg-[#722b4d]/10 px-2 py-1 text-sm text-[#722b4d]"
          >
            {author.full_name}
            <button
              type="button"
              onClick={() => onRemoveAuthor(author.id)}
              className="text-[#722b4d] hover:text-red-600 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder={selectedAuthors.length === 0 ? "Busca y selecciona autores..." : ""}
          className="min-w-[150px] flex-1 bg-transparent outline-none"
        />
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {suggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => selectSuggestion(user)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-[#722b4d]/5"
            >
              <div className="font-medium">{user.full_name}</div>
              <div className="text-xs text-gray-400 capitalize">{user.role}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}