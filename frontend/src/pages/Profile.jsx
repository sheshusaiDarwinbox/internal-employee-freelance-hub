import React, { useState } from "react";
import { Card, Button, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import UpdateProfileForm from "../components/UpdateProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import Loading from "../components/Loading";
import profileAvatar from "../assets/profile-avatar.png";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="col-span-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <img
                src={user.img || profileAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.EID}</p>
              </div>
            </div>
            <Button color="blue" onClick={() => setShowUpdateModal(true)}>
              Update Profile
            </Button>
          </div>
        </Card>

        {/* Work Details */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Work Information</h3>
          <div className="space-y-3">
            <InfoRow label="Department" value={user.DID} />
            <InfoRow label="Job Role" value={user.JID} />
            <InfoRow label="Manager" value={user.ManagerID} />
            <InfoRow label="Work Mode" value={user.workmode} />
            <InfoRow
              label="Date of Joining"
              value={new Date(user.doj).toLocaleDateString()}
            />
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Address" value={user.address} />
            <InfoRow label="City" value={user.city} />
            <InfoRow label="State" value={user.state} />
            <InfoRow label="Country" value={user.country} />
            <InfoRow label="Pincode" value={user.pincode} />
          </div>
        </Card>

        {/* Personal Details */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
          <div className="space-y-3">
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow label="Date of Birth" value={user.dob} />
            <InfoRow label="Marital Status" value={user.maritalStatus} />
            <InfoRow label="Nationality" value={user.nationality} />
            <InfoRow label="Blood Group" value={user.bloodGroup} />
          </div>
        </Card>

        {/* Freelance Information */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Freelance Details</h3>
          <div className="space-y-3">
            <InfoRow label="Reward Points" value={user.freelanceRewardPoints} />
            <InfoRow label="Rating" value={user.freelanceRating} />
            <InfoRow
              label="Account Balance"
              value={`$${user.accountBalance}`}
            />
            <InfoRow label="Skills" value={user.skills?.join(", ")} />
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>
          <div className="space-y-3">
            <InfoRow
              label="Contact Number"
              value={user.emergencyContactNumber}
            />
          </div>
        </Card>

        {/* Password Change Button */}
        <Card className="col-span-2">
          <div className="flex justify-end">
            <Button color="gray" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </Button>
          </div>
        </Card>
      </div>

      {/* Update Profile Modal */}
      <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <Modal.Header>Update Profile</Modal.Header>
        <Modal.Body>
          <UpdateProfileForm onClose={() => setShowUpdateModal(false)} />
        </Modal.Body>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
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
