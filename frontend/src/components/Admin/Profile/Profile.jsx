import { 
  User, Mail, Phone, Briefcase, Calendar, Globe, Heart, UserCheck, Shield, 
  Award, Key, Contact, MonitorSmartphone, Home, Star, 
  Layers, Banknote 
} from "lucide-react";
import ProfileField from "./ProfileField"; // Import the ProfileField component

const Profile = () => {
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
          <ProfileField icon={Briefcase} label="Employee ID" value="E12345" />
          <ProfileField icon={User} label="Full Name" value="John Doe" />
          <ProfileField icon={Mail} label="Email" value="john.doe@example.com" />
          <ProfileField icon={Phone} label="Phone" value="+1234567890" />
          <ProfileField icon={Briefcase} label="Designation" value="Software Engineer" />
          <ProfileField icon={UserCheck} label="Manager ID" value="M5678" />
          <ProfileField icon={Briefcase} label="Department" value="IT" />
          <ProfileField icon={Key} label="Role" value="Admin" />
          <ProfileField icon={Calendar} label="Date of Birth" value="1990-05-21" />
          <ProfileField icon={Calendar} label="Date of Joining" value="2022-01-15" />
          
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <ProfileField icon={Globe} label="Nationality" value="American" />
          <ProfileField icon={Heart} label="Marital Status" value="Single" />
          <ProfileField icon={Shield} label="Blood Group" value="O+" />
          <ProfileField icon={Contact} label="Emergency Contact" value="+9876543210" />
          <ProfileField icon={MonitorSmartphone} label="Work Mode" value="Hybrid" />
          <ProfileField icon={Home} label="Address" value={"123 Main St,\nNew York, NY, 10001, USA"} />
          <ProfileField icon={Award} label="Freelance Reward Points" value="150" />
          <ProfileField icon={Star} label="Freelance Rating" value="4.8" />
          <ProfileField icon={Layers} label="Skills" value="React, Node.js, MongoDB" />
          <ProfileField icon={Banknote} label="Account Balance" value="$5000" />
        </div>
      </div>

      {/* Save Button */}
      {/* <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 rounded-lg shadow-md hover:shadow-lg bg-blue-400 text-white">
          Back
        </button>
      </div> */}
    </div>
  );
};

export default Profile;
