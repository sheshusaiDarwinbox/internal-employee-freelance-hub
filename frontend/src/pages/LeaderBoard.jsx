import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Search,
  Star,
  MessageSquare,
  User,
  Clock,
  Crown,
  Award,
  Users,
  MapPin,
  Briefcase,
  Mail,
  Code,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../utils/api";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("api/users/users-details", {
          withCredentials: true,
        });
        const usersWithGigs = response.data.docs.map((user) => ({
          ...user,
          name: user.fullName,
          gigs: user.gigsCompleted || 0,
          rating: user.freelanceRating || 0,
          points: user.freelanceRewardPoints || 0,
        }));
        setUsers(usersWithGigs);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (selectedUser?.DID) {
        try {
          const response = await api.get(
            `api/departments/${selectedUser.DID}`,
            {
              withCredentials: true,
            }
          );
          setDepartment(response.data);
        } catch (error) {
          console.error("Error fetching department:", error);
          setDepartment(null);
        }
      } else {
        setDepartment(null);
      }
    };
    fetchDepartment();
  }, [selectedUser]);

  const calculateScore = (user, allUsers) => {
    const maxRating = Math.max(...allUsers.map((u) => u.rating || 0));
    const maxPoints = Math.max(...allUsers.map((u) => u.points || 0));
    const ratingScore = (user.rating || 0) / maxRating;
    const pointsScore = (user.points || 0) / maxPoints;
    return ratingScore * 0.5 + pointsScore * 0.5;
  };

  const rankedUsers = [...users]
    .sort((a, b) => calculateScore(b, users) - calculateScore(a, users))
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      score: calculateScore(user, users).toFixed(2),
    }));

  let topThree = rankedUsers.slice(0, 3);

  const filteredUsers = rankedUsers.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-12 h-12 text-blue-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Champions Arena
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Where excellence meets recognition
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {[...topThree].map((user, index) => {
            const order = [1, 0, 2]; // [2nd, 1st, 3rd]
            const displayIndex = order.indexOf(index);
            const position = index + 1;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: displayIndex * 0.2 }}
                className={`relative ${index === 0 ? "md:-mt-8" : ""}`}
                style={{ order: displayIndex }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Crown
                      className={`w-8 h-8 ${
                        position === 1
                          ? "text-amber-500"
                          : position === 2
                          ? "text-slate-400"
                          : "text-amber-700"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col items-center pt-4">
                    <div className="relative">
                      <img
                        src={
                          user.img ||
                          `https://source.unsplash.com/random/150x150?face=${index}`
                        }
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-2">
                        <span className="text-white font-bold text-sm">
                          #{position}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">
                      {user.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-4">
                      {renderStarRating(user.rating || 0)}
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {user.points} pts
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewProfile(user)}
                      className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-300 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search champions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-blue-500" />
                <span>{users.length} Champions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>Season 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Champion
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">
                          #{user.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.img ||
                            `https://source.unsplash.com/random/40x40?face=${user.rank}`
                          }
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <span className="text-gray-700 font-medium">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStarRating(user.rating || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full">
                        {user.points} pts
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-300 flex items-center gap-2 text-sm"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={() => navigate("/user/chat")}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors duration-300 flex items-center gap-2 text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl border border-gray-200 p-6 max-w-lg w-full mx-4 shadow-xl"
            >
              {selectedUser && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Champion Profile
                    </h3>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <img
                      src={
                        selectedUser.img ||
                        `https://source.unsplash.com/random/120x120?face=${selectedUser.rank}`
                      }
                      alt={selectedUser.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-md"
                    />
                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                      {selectedUser.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      {renderStarRating(selectedUser.rating || 0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">Rank</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        #{selectedUser.rank}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Gigs</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedUser.gigsCompleted || 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span>{selectedUser.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span>{selectedUser.address || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <span>{selectedUser.workMode || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Code className="w-5 h-5 text-blue-500" />
                      <span>{department?.name || "N/A"}</span>
                    </div>
                  </div>

                  {selectedUser.skills && selectedUser.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills
                          .filter(
                            (skill) => typeof skill === "object" && skill.skill
                          )
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                            >
                              {skill.skill}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
