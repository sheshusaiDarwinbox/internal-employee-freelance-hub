import { 
  User, Mail, Phone, Briefcase, Calendar, Globe, Heart, UserCheck, Shield, 
  Award, Key, Contact, MonitorSmartphone, Home, Star, 
  Layers, Banknote 
} from "lucide-react";
import ProfileField from "./ProfileField"; // Import the ProfileField component
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../../../redux/slices/usersSlice'; // Import the fetchUserDetails action

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser); // Get current user from Redux store

  useEffect(() => {
    // Fetch user details when the component mounts
    if (currentUser && currentUser.id) {
      dispatch(fetchUserDetails(currentUser.id)); // Assuming currentUser has an id property
    }
  }, [dispatch, currentUser]);

  if (!currentUser) {
    return <div>Loading user details...</div>; // Display loading message or spinner
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow my-auto">
      {/* Profile Header */}
      <div className="flex justify-center items-center">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-500 rounded-full flex items-center justify-center shadow-md text-center">
          <User className="w-16 h-16 text-white" />
        </div>
      </div>
      <a href="#"><p className="text-blue-500 text-center mt-2">Edit</p></a>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full text-gray-700 mt-6">
        {/* Left Column */}
        <div className="space-y-5">
          <ProfileField icon={Briefcase} label="Employee ID" value={currentUser.employeeId || "N/A"} />
          <ProfileField icon={User} label="Full Name" value={currentUser.fullName || "N/A"} />
          <ProfileField icon={Mail} label="Email" value={currentUser.email || "N/A"} />
          <ProfileField icon={Phone} label="Phone" value={currentUser.phone || "N/A"} />
          <ProfileField icon={Briefcase} label="Designation" value={currentUser.designation || "N/A"} />
          <ProfileField icon={UserCheck} label="Manager ID" value={currentUser.managerId || "N/A"} />
          <ProfileField icon={Briefcase} label="Department" value={currentUser.department || "N/A"} />
          <ProfileField icon={Key} label="Role" value={currentUser.role || "N/A"} />
          <ProfileField icon={Calendar} label="Date of Birth" value={currentUser.dob || "N/A"} />
          <ProfileField icon={Calendar} label="Date of Joining" value={currentUser.dateOfJoining || "N/A"} />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <ProfileField icon={Globe} label="Nationality" value={currentUser.nationality || "N/A"} />
          <ProfileField icon={Heart} label="Marital Status" value={currentUser.maritalStatus || "N/A"} />
          <ProfileField icon={Shield} label="Blood Group" value={currentUser.bloodGroup || "N/A"} />
          <ProfileField icon={Contact} label="Emergency Contact" value={currentUser.emergencyContact || "N/A"} />
          <ProfileField icon={MonitorSmartphone} label="Work Mode" value={currentUser.workMode || "N/A"} />
          <ProfileField icon={Home} label="Address" value={currentUser.address || "N/A"} />
          <ProfileField icon={Award} label="Freelance Reward Points" value={currentUser.rewardPoints || "N/A"} />
          <ProfileField icon={Star} label="Freelance Rating" value={currentUser.rating || "N/A"} />
          <ProfileField icon={Layers} label="Skills" value={currentUser.skills.join(", ") || "N/A"} />
          <ProfileField icon={Banknote} label="Account Balance" value={`$${currentUser.accountBalance || "0"}`} />
        </div>
      </div>
    </div>
  );
};

export default Profile;