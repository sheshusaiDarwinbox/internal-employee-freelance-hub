import PropTypes from "prop-types";

const ProfileField = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Icon className="w-5 h-5 text-gray-500" />
      <p className="font-semibold">
        {label}: <span className="font-normal text-gray-600">{value}</span>
      </p>
    </div>
  );
};

// Define PropTypes
ProfileField.propTypes = {
  icon: PropTypes.elementType.isRequired, // Icon component
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProfileField;
