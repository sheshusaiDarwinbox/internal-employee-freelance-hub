import React, { useState, useEffect } from "react";
import { Table, Button, Dropdown, TextInput, Pagination } from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
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
      console.log(response.data);
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
      navigate(`/manager/gig/${gig.GigID}`); // Redirect to the gig page
    else navigate(`/manager/gig-assign/${gig.GigID}`);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="p-6 bg-gray-50">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <TextInput
              icon={HiSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gigs..."
              className="py-2 px-4 text-lg rounded-full bg-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 placeholder-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 w-full md:w-64"
            />
          </div>

          {/* Filter Section */}
          <div className="flex gap-6 items-center mt-4 md:mt-0">
            {/* Department Dropdown */}
            <Dropdown
              label={selectedDepartment || "Select Department"}
              className="w-64"
            >
              <Dropdown.Item
                onClick={() => setSelectedDepartment("")}
                className="flex items-center gap-2 text-sm py-2 px-4 hover:bg-indigo-100 rounded-lg transition-all duration-200"
              >
                <span className="text-gray-700">All Departments</span>
              </Dropdown.Item>
              {departments.map((dept) => (
                <Dropdown.Item
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className="flex items-center gap-2 text-sm py-2 px-4 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                >
                  <span className="text-gray-700">{dept}</span>
                </Dropdown.Item>
              ))}
            </Dropdown>

            {/* Skills Dropdown */}
            <Dropdown label="Select Skills" className="w-64">
              {allSkills.map((skill, idx) => (
                <Dropdown.Item
                  key={idx}
                  onClick={() => {
                    setSelectedSkills((prev) =>
                      prev.includes(skill)
                        ? prev.filter((s) => s !== skill)
                        : [...prev, skill]
                    );
                  }}
                  className="flex items-center gap-2 text-sm py-2 px-4 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{skill}</span>
                </Dropdown.Item>
              ))}
            </Dropdown>

            {/* Clear Filters Button */}
            {(selectedDepartment || selectedSkills.length > 0) && (
              <Button
                color="gray"
                onClick={() => {
                  setSelectedDepartment("");
                  setSelectedSkills([]);
                }}
                className="py-2 px-6 bg-gray-600 text-white rounded-lg text-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table to display gigs */}
      <div className="overflow-x-auto shadow-lg rounded-lg border">
        <Table>
          <Table.Head>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Department</Table.HeadCell>
            <Table.HeadCell>Skills</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredGigs.map((gig, index) => (
              <Table.Row
                key={gig._id}
                onClick={() => handleOpenGig(gig)}
                className={`
            border-b border-gray-200 cursor-pointer transition-colors duration-150 hover:bg-gray-50
            ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          `}
              >
                <Table.Cell className="px-6 py-4">
                  <span className="font-medium text-gray-900">{gig.title}</span>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  <span className="text-gray-900">{gig.department.name}</span>
                </Table.Cell>
                <Table.Cell className="px-6 py-4">
                  {gig.skills.map(({ skill }, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-2"
                    >
                      {skill}
                    </span>
                  ))}
                </Table.Cell>

                <Table.Cell className="px-6 py-4">
                  <span className="text-gray-900">
                    {formatDate(gig.createdAt)}
                  </span>
                </Table.Cell>

                <Table.Cell className="px-6 py-4">
                  <span
                    className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${
          gig.ongoingStatus === "UnAssigned"
            ? "bg-green-100 text-green-800"
            : ""
        }
        ${gig.ongoingStatus === "Ongoing" ? "bg-blue-100 text-blue-800" : ""}
        ${
          gig.ongoingStatus === "Completed"
            ? "bg-yellow-100 text-yellow-800"
            : ""
        }
        ${
          gig.ongoingStatus === "Reviewed"
            ? "bg-orange-100 text-orange-800"
            : ""
        }
        ${
          gig.ongoingStatus === "Internship"
            ? "bg-purple-100 text-purple-800"
            : ""
        }
      `}
                  >
                    {gig.ongoingStatus}
                  </span>
                </Table.Cell>

                <Table.Cell className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-0"
                      onClick={() => handleOpenGig(gig.GigID)}
                    >
                      View
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalGigs / pageSize)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default MyGigs;
