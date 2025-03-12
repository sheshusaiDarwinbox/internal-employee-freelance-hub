import React, { useState, useEffect } from "react";
import { HiPhone, HiMail, HiUser, HiLocationMarker } from "react-icons/hi";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`api/users/get-user/${userId}`, {
          withCredentials: true,
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading user details...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="flex items-center space-x-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-400 shadow-sm">
          <img
            src={user.img || "/default-avatar.png"}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-slate-800">
            {user.fullName}
          </h2>
          <p className="text-xl text-slate-600">{user.role}</p>
        </div>
      </div>

      {/* User Details Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center text-slate-700">
            <HiUser className="h-5 w-5 mr-3 text-slate-500" />
            <p className="text-lg">{user.EID}</p>
          </div>
          <div className="flex items-center text-slate-700">
            <HiMail className="h-5 w-5 mr-3 text-slate-500" />
            <p className="text-lg">{user.email}</p>
          </div>
          <div className="flex items-center text-slate-700">
            <HiPhone className="h-5 w-5 mr-3 text-slate-500" />
            <p className="text-lg">{user.phone || "N/A"}</p>
          </div>
          <div className="flex items-center text-slate-700">
            <HiLocationMarker className="h-5 w-5 mr-3 text-slate-500" />
            <p className="text-lg">
              {user.city}, {user.state}, {user.country}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-lg text-slate-700">
            <strong>Date of Birth: </strong>
            {user.dob || "N/A"}
          </div>
          <div className="text-lg text-slate-700">
            <strong>Joining Date: </strong>
            {new Date(user.doj).toLocaleDateString()}
          </div>
          <div className="text-lg text-slate-700">
            <strong>Marital Status: </strong>
            {user.maritalStatus || "N/A"}
          </div>
          <div className="text-lg text-slate-700">
            <strong>Nationality: </strong>
            {user.nationality || "N/A"}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-slate-800 mb-4">Skills</h3>
        <div className="flex flex-wrap gap-4">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition duration-300"
              >
                {skill.skill} -{" "}
                {skill.score ? (skill.score * 100).toFixed(0) : "N/A"}%
              </span>
            ))
          ) : (
            <p className="text-slate-500">No skills listed.</p>
          )}
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="mt-12">
        <h3 className="text-3xl font-semibold text-slate-800 mb-4">
          Emergency Contact
        </h3>
        <div className="flex items-center text-slate-700">
          <HiPhone className="h-5 w-5 mr-3 text-slate-500" />
          <p className="text-lg">{user.emergencyContactNumber || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
