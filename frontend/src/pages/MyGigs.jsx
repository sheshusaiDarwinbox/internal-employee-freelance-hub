import { useState, useEffect } from "react";
import { Button, Dropdown, Pagination } from "flowbite-react";
import {
  Search,
  X,
  Filter,
  ChevronRight,
  Calendar,
  Briefcase,
} from "lucide-react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";

const MyGigs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [totalGigs, setTotalGigs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchGigs = async (page = 1) => {
    try {
      const response = await api.get(
        `api/gigs?ManagerIDs=${user.EID},EMP000000&page=${page}`,
        {
          withCredentials: true,
        }
      );
      setGigs(response.data.docs);
      setTotalGigs(response.data.totalDocs);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  useEffect(() => {
    fetchGigs(currentPage);
  }, [currentPage]);

  const departments = [...new Set(gigs.map((gig) => gig.DID))];
  const allSkills = [
    ...new Set(gigs.flatMap((gig) => gig.skills.map((skill) => skill.skill))),
  ];

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || gig.DID === selectedDepartment;
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) =>
        gig.skills.some((gSkill) => gSkill.name === skill)
      );

    return matchesSearch && matchesDepartment && matchesSkills;
  });

  const handleOpenGig = (gig) => {
    if (gig.ongoingStatus === "UnAssigned")
      navigate(`/manager/gig/${gig.GigID}`);
    else navigate(`/manager/gig-assign/${gig.GigID}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      UnAssigned: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Ongoing: "bg-blue-50 text-blue-700 border-blue-200",
      Completed: "bg-amber-50 text-amber-700 border-amber-200",
      Reviewed: "bg-orange-50 text-orange-700 border-orange-200",
      Internship: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
          <p className="text-gray-600">Manage and track your gig assignments</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gigs by title or description..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              Filters
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {selectedSkills.length + (selectedDepartment ? 1 : 0)}
              </span>
            </Button>
          </div>

          {/* Expanded Filters */}
          {isFiltersVisible && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <Dropdown
                  label={selectedDepartment || "All Departments"}
                  className=""
                >
                  <Dropdown.Item
                    onClick={() => setSelectedDepartment("")}
                    className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50"
                  >
                    All Departments
                  </Dropdown.Item>
                  {departments.map((dept) => (
                    <Dropdown.Item
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50"
                    >
                      {dept}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <Dropdown label="Select Skills" className="">
                  {allSkills.map((skill) => (
                    <Dropdown.Item
                      key={skill}
                      onClick={() => {
                        setSelectedSkills((prev) =>
                          prev.includes(skill)
                            ? prev.filter((s) => s !== skill)
                            : [...prev, skill]
                        );
                      }}
                      className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        readOnly
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      {skill}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>

              {/* Clear Filters */}
              {(selectedDepartment || selectedSkills.length > 0) && (
                <Button
                  onClick={() => {
                    setSelectedDepartment("");
                    setSelectedSkills([]);
                  }}
                  className="md:col-span-2 flex items-center justify-center gap-2 text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredGigs.map((gig) => (
            <div
              key={gig._id}
              onClick={() => handleOpenGig(gig)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {gig.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    gig.ongoingStatus
                  )}`}
                >
                  {gig.ongoingStatus}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{gig.department.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(gig.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {gig.skills.map(({ skill }, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalGigs / pageSize)}
            onPageChange={setCurrentPage}
            className="inline-flex gap-2"
          />
        </div>
      </div>
    </div>
  );
};

export default MyGigs;
