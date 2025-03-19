import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Star,
  Clock,
  User,
  Mail,
  Send,
  Building2,
  Code2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { debounce } from "lodash";
import SearchableSelect from "../components/SearchableSelect";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false);
  const [openReferModal, setOpenReferModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [totalGigs, setTotalGigs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [bidDescription, setBidDescription] = useState("");
  const [referName, setReferName] = useState("");
  const [referEmail, setReferEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skills] = useState([]);
  const [approvalStatus] = useState("APPROVED");
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const departmentDropdownRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const debouncedSearch = debounce(async (query) => {
    try {
      const response = await api.get("api/gigs", {
        params: {
          page: currentPage,
          search: query,
          DIDs: selectedDepartments.map((dept) => dept.DID),
          approvalStatus,
        },
        withCredentials: true,
      });
      setGigs(response.data.docs);
      setTotalGigs(response.data.totalDocs);
    } catch (error) {
      setError("Failed to fetch gigs");
      console.error("Error fetching gigs:", error);
    }
  }, 300);

  const fetchGigs = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("api/gigs", {
        params: {
          page,
          search: searchQuery,
          DIDs: selectedDepartments.map((dept) => dept.DID),
          approvalStatus,
        },
        withCredentials: true,
      });
      setGigs(response.data.docs);
      setTotalGigs(response.data.totalDocs);
    } catch (error) {
      setError("Failed to fetch gigs");
      console.error("Error fetching gigs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs(currentPage);
  }, [currentPage, selectedDepartments, approvalStatus]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target)
      ) {
        setIsDepartmentDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBidSubmit = async () => {
    try {
      await api.post(
        "api/bids/post",
        {
          GigID: selectedGig.GigID,
          EID: user.EID,
          description: bidDescription,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setOpenBidModal(false);
      setBidDescription("");
      fetchGigs(currentPage);
    } catch (error) {
      setError("Failed to submit bid");
      console.error("Error submitting bid:", error);
    }
  };

  const handleReferSubmit = async () => {
    try {
      await api.post(
        "api/referrals/post",
        {
          GigID: selectedGig.GigID,
          referrerEID: user.EID,
          name: referName,
          email: referEmail,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setOpenReferModal(false);
      setReferName("");
      setReferEmail("");
    } catch (error) {
      setError("Failed to submit referral");
      console.error("Error submitting referral:", error);
    }
  };

  const fetchDepartments = async (search) => {
    const response = await api.get(`api/departments/?search=${search}`, {
      withCredentials: true,
    });
    return response.data.docs;
  };

  const handleDepartmentSelect = (department) => {
    if (!selectedDepartments.find((dept) => dept.DID === department.DID)) {
      setSelectedDepartments([...selectedDepartments, department]);
    }
    setIsDepartmentDropdownOpen(false);
  };

  const handleRemoveDepartment = (departmentId) => {
    setSelectedDepartments(
      selectedDepartments.filter((dept) => dept.DID !== departmentId)
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gigs..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="relative" ref={departmentDropdownRef}>
                <button
                  onClick={() =>
                    setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)
                  }
                  className={`px-4 py-3 rounded-xl border ${
                    isDepartmentDropdownOpen || selectedDepartments.length > 0
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-500"
                  } flex items-center gap-2 min-w-[160px]`}
                >
                  <Building2
                    size={20}
                    className={`${
                      selectedDepartments.length > 0
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="flex-1 text-left truncate">
                    {selectedDepartments.length > 0
                      ? `${selectedDepartments.length} Department${
                          selectedDepartments.length > 1 ? "s" : ""
                        }`
                      : "Department"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isDepartmentDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDepartmentDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-2">
                    <div className="px-3 py-2">
                      <SearchableSelect
                        onChange={(department) =>
                          handleDepartmentSelect(department)
                        }
                        fetchOptions={fetchDepartments}
                        labelKey="name"
                        valueKey="DID"
                        placeholder="Search departments..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {selectedDepartments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedDepartments.map((dept) => (
                    <div
                      key={dept.DID}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                    >
                      <Building2 size={16} />
                      <span className="text-sm font-medium">{dept.name}</span>
                      <button
                        onClick={() => handleRemoveDepartment(dept.DID)}
                        className="p-1 hover:bg-blue-100 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setSelectedDepartments([])}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                  >
                    <X size={16} />
                    Clear all
                  </button>
                </div>
              )}

              <div className="relative group">
                <button
                  onClick={() =>
                    document
                      .getElementById("skillsDropdown")
                      .classList.toggle("hidden")
                  }
                  className="px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-500 flex items-center gap-2"
                >
                  <Code2 size={20} className="text-gray-500" />
                  <span>Skills ({selectedSkills.length})</span>
                </button>
                <div
                  id="skillsDropdown"
                  className="hidden absolute top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 max-h-64 overflow-y-auto"
                >
                  {skills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => {
                          setSelectedSkills((prev) =>
                            prev.includes(skill)
                              ? prev.filter((s) => s !== skill)
                              : [...prev, skill]
                          );
                        }}
                        className="mr-2"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig.GigID}
                onClick={() => {
                  setSelectedGig(gig);
                  setOpenModal(true);
                }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer overflow-hidden group"
              >
                <div className="relative h-48">
                  <img
                    src={
                      gig.img ||
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"
                    }
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {gig.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        gig.ongoingStatus === "UnAssigned"
                          ? "bg-blue-100 text-blue-800"
                          : gig.ongoingStatus === "Ongoing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {gig.ongoingStatus}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {gig.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {gig.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                      >
                        {skill.skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-4">
                      <div className="flex items-center text-amber-500">
                        <Star size={20} className="mr-1" />
                        <span className="font-medium">{gig.rewardPoints}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <span className="text-2xl">₹ </span>
                        <span className="text-2xl">{gig.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock size={16} className="mr-2" />
                      <span className="text-sm">
                        {new Date(gig.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto mt-8 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(totalGigs / pageSize) }).map(
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedGig?.title}
                </h2>
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <img
                  src={
                    selectedGig?.img ||
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"
                  }
                  alt={selectedGig?.title}
                  className="w-full h-64 object-cover rounded-xl"
                />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{selectedGig?.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGig?.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                        >
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500">Department</div>
                      <div className="font-medium text-gray-900">
                        {selectedGig?.department.name}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500">Posted By</div>
                      <div className="font-medium text-gray-900">
                        {selectedGig?.userauth[0].fullName}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500">Reward Points</div>
                      <div className="font-medium text-gray-900">
                        {selectedGig?.rewardPoints}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-500">Amount</div>
                      <div className="font-medium text-gray-900">
                        ${selectedGig?.amount}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {user?.role === "Employee" &&
                    selectedGig.ongoingStatus === "UnAssigned" && (
                      <>
                        <button
                          onClick={() => {
                            setOpenModal(false);
                            setOpenBidModal(true);
                          }}
                          className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Place Bid
                        </button>
                        <button
                          onClick={() => {
                            setOpenModal(false);
                            setOpenReferModal(true);
                          }}
                          className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                        >
                          Refer
                        </button>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Place Your Bid
                </h2>
                <button
                  onClick={() => setOpenBidModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <textarea
                value={bidDescription}
                onChange={(e) => setBidDescription(e.target.value)}
                placeholder="Describe why you're the best fit for this gig..."
                className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setOpenBidModal(false)}
                  className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBidSubmit}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send size={20} />
                  Submit Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openReferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Refer Someone
                </h2>
                <button
                  onClick={() => setOpenReferModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={referName}
                      onChange={(e) => setReferName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={referEmail}
                      onChange={(e) => setReferEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setOpenReferModal(false)}
                  className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReferSubmit}
                  className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                >
                  <Send size={20} />
                  Submit Referral
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
