import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateProfileImage } from "../redux/slices/authSlice";
import { Card, Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import UpdateProfileForm from "../components/UpdateProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import Loading from "../components/Loading";
import profileAvatar from "../assets/profile-avatar.png";
import { HiPencil, HiKey } from "react-icons/hi";
import { formatDate } from "../utils/dateUtils";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
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

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-2 max-w-7xl mx-auto h-[calc(100vh-160px)">
      {/* Profile Header */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
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
              <img
                src={user.img || profileAvatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                ) : (
                  <HiPencil className="text-white text-2xl" />
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.fullName || "Name"}
              </h1>
              <p className="text-gray-600">{user.email || "email"}</p>
              <p className="text-gray-500 capitalize">{user.role || "role"}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              color="light"
              className="flex items-center space-x-2 hover:bg-gray-100"
              onClick={() => setShowUpdateModal(true)}
            >
              <HiPencil className="h-5 w-5" />
              <span>Edit Profile</span>
            </Button>
            <Button
              color="light"
              className="flex items-center space-x-2 hover:bg-gray-100"
              onClick={() => setShowPasswordModal(true)}
            >
              <HiKey className="h-5 w-5" />
              <span>Change Password</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Work Information
          </h3>
          <div className="space-y-3">
            <InfoRow label="Employee ID" value={user.EID} />
            <InfoRow label="Department" value={user.DID} />
            <InfoRow label="Job Role" value={user.PID} />
            <InfoRow label="Work Mode" value={user.workmode} />
            <InfoRow label="Date of Joining" value={formatDate(user.doj)} />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Personal Details
          </h3>
          <div className="space-y-3">
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow label="Date of Birth" value={user.dob} />
            <InfoRow label="Blood Group" value={user.bloodGroup} />
            <InfoRow label="Marital Status" value={user.maritalStatus} />
            <InfoRow label="Nationality" value={user.nationality} />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Contact Information
          </h3>
          <div className="space-y-3">
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Address" value={user.address} />
            <InfoRow label="City" value={`${user.city}, ${user.state}`} />
            <InfoRow
              label="Country"
              value={`${user.country} - ${user.pincode}`}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Emergency Contact
          </h3>
          <div className="space-y-3">
            <InfoRow
              label="Contact Number"
              value={user.emergencyContactNumber}
            />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            Skills & Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {user.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
            <InfoRow label="Reward Points" value={user.freelanceRewardPoints} />
            <InfoRow label="Rating" value={`${user.freelanceRating}/5`} />
            <InfoRow
              label="Account Balance"
              value={`$${user.accountBalance}`}
            />
          </div>
        </Card>
      </div>

      {/* Modals */}
      <Modal
        show={showUpdateModal}
        size="xl"
        onClose={() => setShowUpdateModal(false)}
      >
        <Modal.Header>Edit Profile Information</Modal.Header>
        <Modal.Body>
          <UpdateProfileForm onClose={() => setShowUpdateModal(false)} />
        </Modal.Body>
      </Modal>

      <Modal
        show={showPasswordModal}
        size="md"
        onClose={() => setShowPasswordModal(false)}
      >
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Body>
          <ChangePasswordForm onClose={() => setShowPasswordModal(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Helper component for displaying information rows
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value || "Not provided"}</span>
  </div>
);

export default Profile;