import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
// import { changePassword } from "../redux/slices/authSlice";

const ChangePasswordForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <TextInput
          id="currentPassword"
          type="password"
          required
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <TextInput
          id="newPassword"
          type="password"
          required
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <TextInput
          id="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" color="blue">
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
