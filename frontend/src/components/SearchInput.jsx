import { memo } from "react";
import PropTypes from "prop-types";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

const SearchInput = memo(
  ({ value, onChange, placeholder = "Search...", className = "" }) => (
    <TextInput
      icon={HiSearch}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      type="text"
      sizing="md"
    />
  )
);

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

SearchInput.displayName = "SearchInput";

export default SearchInput;
