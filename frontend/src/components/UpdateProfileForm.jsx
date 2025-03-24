import { useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";

const UpdateProfileForm = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ formData: formData })).unwrap();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Full Name</Label>
          <TextInput
            id="phone"
            type="tel"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="Enter your name"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <TextInput
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            id="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <TextInput
            id="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select
            id="maritalStatus"
            value={formData.maritalStatus}
            onChange={(e) =>
              setFormData({ ...formData, maritalStatus: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <TextInput
            id="nationality"
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            placeholder="Enter nationality"
          />
        </div>

        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) =>
              setFormData({ ...formData, bloodGroup: e.target.value })
            }
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="workmode">Work Mode</Label>
          <Select
            id="workmode"
            value={formData.workmode}
            onChange={(e) =>
              setFormData({ ...formData, workmode: e.target.value })
            }
          >
            <option value="">Select Work Mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="office">Office</option>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="address">Address</Label>
          <TextInput
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Enter street address"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <TextInput
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <TextInput
            id="state"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            placeholder="Enter state"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <TextInput
            id="country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            placeholder="Enter country"
          />
        </div>

        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <TextInput
            id="pincode"
            value={formData.pincode}
            onChange={(e) =>
              setFormData({ ...formData, pincode: e.target.value })
            }
            placeholder="Enter pincode"
          />
        </div>

        <div>
          <Label htmlFor="emergencyContactNumber">
            Emergency Contact Number
          </Label>
          <TextInput
            id="emergencyContactNumber"
            type="tel"
            value={formData.emergencyContactNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                emergencyContactNumber: e.target.value,
              })
            }
            placeholder="Enter emergency contact"
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <TextInput
            id="skills"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
            placeholder="Enter skills, separated by commas"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" color="blue">
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default UpdateProfileForm;
