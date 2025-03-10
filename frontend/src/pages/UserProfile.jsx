import React, { useState, useEffect } from "react";
import axios from "axios";
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

    console.log(userId);
    fetchUserDetails();
  }, [userId]); // Re-fetch data when userId changes

  // Show a loading message or error if there is any issue
  if (loading) {
    return (
      <div className="text-center text-gray-500">Loading user details...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          <img
            src={user.img || "/default-avatar.png"}
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">
            {user.fullName}
          </h2>
          <p className="text-lg text-gray-600">{user.role}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center text-gray-700">
            <HiUser className="h-5 w-5 mr-2 text-blue-600" />
            <p>{user.EID}</p>
          </div>

          <div className="flex items-center text-gray-700">
            <HiMail className="h-5 w-5 mr-2 text-blue-600" />
            <p>{user.email}</p>
          </div>

          <div className="flex items-center text-gray-700">
            <HiPhone className="h-5 w-5 mr-2 text-blue-600" />
            <p>{user.phone || "N/A"}</p>
          </div>

          <div className="flex items-center text-gray-700">
            <HiLocationMarker className="h-5 w-5 mr-2 text-blue-600" />
            <p>
              {user.city}, {user.state}, {user.country}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-gray-700">
            <strong>Date of Birth: </strong>
            {user.dob || "N/A"}
          </div>

          <div className="text-gray-700">
            <strong>Joining Date: </strong>
            {new Date(user.doj).toLocaleDateString()}
          </div>

          <div className="text-gray-700">
            <strong>Marital Status: </strong>
            {user.maritalStatus || "N/A"}
          </div>

          <div className="text-gray-700">
            <strong>Nationality: </strong>
            {user.nationality || "N/A"}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill.skill} -{" "}
                {skill.score ? (skill.score * 100).toFixed(0) : "N/A"}%
              </span>
            ))
          ) : (
            <p className="text-gray-600">No skills listed.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Emergency Contact
        </h3>
        <div className="flex items-center text-gray-700">
          <HiPhone className="h-5 w-5 mr-2 text-blue-600" />
          <p>{user.emergencyContactNumber || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
