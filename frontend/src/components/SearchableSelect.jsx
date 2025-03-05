import { useState, useEffect, useRef } from "react";
import { TextInput, Spinner } from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import api from "../utils/api";
import useDebounce from "../components/ManageDepartment/Debounce";

const SearchableSelect = ({ value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/departments/?search=${debouncedSearch}`,
          {
            withCredentials: true,
          }
        );
        setOptions(response.data.docs);
      } catch (error) {
        console.error("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearch) {
      fetchDepartments();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dept) => {
    setSelectedDept(dept);
    onChange({ target: { value: dept.DID } });
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <TextInput
        value={selectedDept?.name || search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedDept(null);
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
        placeholder="Search departments..."
        required={required}
        icon={HiSearch}
        rightIcon={
          selectedDept &&
          (() => (
            <HiX
              className="cursor-pointer"
              onClick={() => {
                setSelectedDept(null);
                onChange({ target: { value: "" } });
              }}
            />
          ))
        }
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 flex justify-center">
              <Spinner size="sm" />
            </div>
          ) : options.length > 0 ? (
            options.map((dept) => (
              <div
                key={dept._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(dept)}
              >
                {dept.name}
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">
              No departments found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
