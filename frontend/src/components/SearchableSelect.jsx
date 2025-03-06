import { useState, useEffect, useRef } from "react";
import { TextInput, Spinner } from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import useDebounce from "../components/ManageDepartment/Debounce";

const SearchableSelect = ({
  onChange,
  required,
  fetchOptions,
  labelKey = "name",
  valueKey = "_id",
  placeholder = "Search...",
  initialSelected = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(initialSelected);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const loadOptions = async () => {
      if (!debouncedSearch) {
        setOptions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchOptions(debouncedSearch);
        setOptions(Array.isArray(data) ? data : data.docs || []);
      } catch (err) {
        setError("Failed to fetch options");
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [debouncedSearch, fetchOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    onChange({ target: { value: option[valueKey] } });
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    onChange({ target: { value: "" } });
    setSearch("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <TextInput
          value={selected ? selected[labelKey] : search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(null);
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          icon={HiSearch}
        />
        {selected && (
          <HiX
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 flex justify-center">
              <Spinner size="sm" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">{error}</div>
          ) : options.length > 0 ? (
            options.map((option) => (
              <div
                key={option[valueKey]}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option[labelKey]}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
