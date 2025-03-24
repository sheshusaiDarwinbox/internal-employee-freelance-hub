import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Key,
  X,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Flag,
  Droplet,
  Monitor,
  AlertCircle,
  Award,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileImage, updateProfile } from "../redux/slices/authSlice";
import profileAvatar from "../assets/profile-avatar.png";
import api from "../utils/api";

function App() {
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    phone: user.phone || "",
    gender: user.gender || "",
    dob: user.dob || "",
    fullName: user.fullName || "",
    maritalStatus: user.maritalStatus || "",
    nationality: user.nationality || "",
    bloodGroup: user.bloodGroup || "",
    workmode: user.workmode || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    country: user.country || "",
    pincode: user.pincode || "",
    emergencyContactNumber: user.emergencyContactNumber || "",
  });

  const genderOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const workmodeOptions = ["Remote", "Hybrid", "On-site"];

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadLoading(true);
      await dispatch(updateProfileImage({ formData: formData })).unwrap();
    } catch (error) {
      console.error(error);
      console.error("Failed to upload image");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ formData: formData })).unwrap();
    } catch (error) {
      console.error("Update failed:", error);
    }
    setShowUpdateModal(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowPasswordModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`api/users/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const renderFormField = (key, value) => {
    const label =
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

    switch (key) {
      case "dob":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>
        );

      case "gender":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "maritalStatus":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
            <select
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            >
              <option value="">Select Marital Status</option>
              {maritalStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "bloodGroup":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            >
              <option value="">Select Blood Group</option>
              {bloodGroupOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "workmode":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Mode
            </label>
            <select
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            >
              <option value="">Select Work Mode</option>
              {workmodeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "phone":
      case "emergencyContactNumber":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type="tel"
              name={key}
              value={value}
              onChange={handleInputChange}
              pattern="[0-9]*"
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>
        );

      case "pincode":
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleInputChange}
              pattern="[0-9]*"
              maxLength={6}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>
        );

      default:
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-stone-100 to-stone-200" />
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end -mt-16">
              <div className="relative group" onClick={handleImageClick}>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="w-32 h-32 rounded-xl overflow-hidden ring-4 ring-white shadow-md">
                  <img
                    src={user.img || profileAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    {uploadLoading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    ) : (
                      <Pencil className="text-white" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-6 py-2.5 bg-white hover:bg-stone-50 text-gray-700 border border-stone-200 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            title="Work Information"
            icon={<Briefcase className="w-5 h-5 text-stone-600" />}
            items={[
              {
                label: "Employee ID",
                value: user.EID,
                icon: <User className="w-4 h-4" />,
              },
              {
                label: "Department",
                value: user.DID,
                icon: <Briefcase className="w-4 h-4" />,
              },
              {
                label: "Job Role",
                value: user.PID,
                icon: <Award className="w-4 h-4" />,
              },
              {
                label: "Work Mode",
                value: user.workmode,
                icon: <Monitor className="w-4 h-4" />,
              },
              {
                label: "Date of Joining",
                value: user.doj,
                icon: <Calendar className="w-4 h-4" />,
              },
            ]}
          />

          <InfoCard
            title="Personal Details"
            icon={<User className="w-5 h-5 text-stone-600" />}
            items={[
              {
                label: "Gender",
                value: user.gender,
                icon: <User className="w-4 h-4" />,
              },
              {
                label: "Date of Birth",
                value: user.dob,
                icon: <Calendar className="w-4 h-4" />,
              },
              {
                label: "Blood Group",
                value: user.bloodGroup,
                icon: <Droplet className="w-4 h-4" />,
              },
              {
                label: "Marital Status",
                value: user.maritalStatus,
                icon: <Heart className="w-4 h-4" />,
              },
              {
                label: "Nationality",
                value: user.nationality,
                icon: <Flag className="w-4 h-4" />,
              },
            ]}
          />

          <InfoCard
            title="Contact Information"
            icon={<Phone className="w-5 h-5 text-stone-600" />}
            items={[
              {
                label: "Phone",
                value: user.phone,
                icon: <Phone className="w-4 h-4" />,
              },
              {
                label: "Email",
                value: user.email,
                icon: <Mail className="w-4 h-4" />,
              },
              {
                label: "Address",
                value: user.address,
                icon: <MapPin className="w-4 h-4" />,
              },
              {
                label: "State",
                value: `${user.city}${user.city ? "," : ""} ${user.state}`,
                icon: <MapPin className="w-4 h-4" />,
              },
              {
                label: "Country",
                value: `${user.country} ${user.pincode ? "-" : ""} ${
                  user.pincode
                }`,
                icon: <Flag className="w-4 h-4" />,
              },
            ]}
          />

          <InfoCard
            title="Emergency Contact"
            icon={<AlertCircle className="w-5 h-5 text-stone-600" />}
            items={[
              {
                label: "Contact Number",
                value: user.emergencyContactNumber,
                icon: <Phone className="w-4 h-4" />,
              },
            ]}
          />

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-stone-600" />
              <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills?.map((skillObj, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors duration-200"
                >
                  {skillObj.skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(formData).map(([key, value]) =>
                      renderFormField(key, value)
                    )}
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUpdateModal(false)}
                      className="px-6 py-2.5 border border-stone-200 rounded-lg text-gray-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-900"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Change Password
                  </h2>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {[
                    "Current Password",
                    "New Password",
                    "Confirm New Password",
                  ].map((label) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                      />
                    </div>
                  ))}
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-6 py-2.5 border border-stone-200 rounded-lg text-gray-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-900"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const InfoCard = ({ title, icon, items }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            {item.icon}
            <span>{item.label}</span>
          </div>
          <span className="text-gray-900 font-medium">
            {item.value || "Not provided"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default App;
