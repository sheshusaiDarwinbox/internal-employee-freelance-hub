import React, { useEffect, useRef, useState } from "react";
import { Pencil as HiPencil, Key as HiKey, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProfileImage } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import profileAvatar from "../assets/profile-avatar.png";
import { updateProfile } from "../redux/slices/authSlice";
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
    skills: user.skills?.join(", ") || "",
  });

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
      setError("Failed to upload image");
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`api/users/profile`, {
          withCredentials: true,
        });
        console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="inset-0 bg-[url('https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80')] opacity-[0.02] bg-cover bg-center" />
      <div className="relative p-6 max-w-7xl mx-auto ]">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="relative group cursor-pointer"
                onClick={handleImageClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                  <img
                    src={user.img || profileAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover transform transition group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full  ,
top 21 - 40
top 41 - 60 transition-all duration-300 flex items-center justify-center"
                  >
                    {uploadLoading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    ) : (
                      <HiPencil className="text-white text-2xl" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {user.fullName}
                </h1>
                <p className="text-lg text-gray-600">{user.email}</p>
                <p className="text-gray-500 capitalize font-medium">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowUpdateModal(true)}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <HiPencil className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <HiKey className="h-5 w-5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Work Information",
              items: [
                { label: "Employee ID", value: user.EID },
                { label: "Department", value: user.DID },
                { label: "Job Role", value: user.PID },
                { label: "Work Mode", value: user.workmode },
                { label: "Date of Joining", value: user.doj },
              ],
            },
            {
              title: "Personal Details",
              items: [
                { label: "Gender", value: user.gender },
                { label: "Date of Birth", value: user.dob },
                { label: "Blood Group", value: user.bloodGroup },
                { label: "Marital Status", value: user.maritalStatus },
                { label: "Nationality", value: user.nationality },
              ],
            },
            {
              title: "Contact Information",
              items: [
                { label: "Phone", value: user.phone },
                { label: "Email", value: user.email },
                { label: "Address", value: user.address },
                {
                  label: "State",
                  value: `${user.city}${user.city ? "," : ""} ${user.state}`,
                },
                {
                  label: "Country",
                  value: `${user.country} ${user.pincode ? "-" : ""} ${
                    user.pincode
                  }`,
                },
              ],
            },
          ].map((section, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <InfoRow key={i} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Emergency Contact
            </h3>
            <div className="space-y-4">
              <InfoRow
                label="Contact Number"
                value={user.emergencyContactNumber}
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Skills
            </h3>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skillObj, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                  >
                    {skillObj.skill} {/* Display skill and score */}
                  </span>
                ))}
                {console.log(user.skills)}
              </div>
            </div>
          </div>
        </div>

        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUpdateModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
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

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900">{value || "Not provided"}</span>
  </div>
);

export default App;
