import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Dropdown,
  TextInput,
  Card,
  Pagination,
  Textarea,
} from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import api from "../utils/api";
import defaultAvatar from "../assets/profile-avatar.png";
import defaultGig from "../assets/gig.jpeg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllGigs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false); // For bid modal
  const [openReferModal, setOpenReferModal] = useState(false); // For refer modal
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [totalGigs, setTotalGigs] = useState(0); // total gigs count
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Items per page
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchGigs = async (page = 1) => {
    try {
      const response = await api.get("api/gigs", {
        params: { page, limit: pageSize },
        withCredentials: true,
      });
      console.log(response.data.docs);
      setGigs(response.data.docs);
      setTotalGigs(response.data.totalDocs);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  const handleOpenModal = (gig) => {
    setSelectedGig(gig);
    setOpenModal(true);
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

  const [bidDescription, setBidDescription] = useState("");
  const [referName, setReferName] = useState("");
  const [referEmail, setReferEmail] = useState("");

  return (
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

      {/* Gigs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGigs.map((gig, index) => (
          <Card
            key={index}
            onClick={() => handleOpenModal(gig)}
            className="bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="md:w-1/3">
                <div className="relative group">
                  <img
                    src={gig.img || defaultGig}
                    alt={gig.title}
                    className="w-full h-56 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-medium">
                      Posted by: {gig.userauth[0].fullName}
                    </p>
                    <p className="text-gray-200 text-sm">
                      {gig.department.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                      {gig.title}
                    </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {gig.ongoingStatus || "Active"}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3 text-base leading-relaxed">
                    {gig.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {gig.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="ml-2 font-semibold text-gray-700">
                        {gig.rewardPoints} Points
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        ₹
                      </div>
                      <span className="ml-2 font-semibold text-gray-700">
                        {gig.amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Deadline: {new Date(gig.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalGigs / pageSize)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Gig Detail Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
        <Modal.Header>
          <div className="text-xl font-semibold text-gray-900">
            {selectedGig?.title}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex gap-6">
              <img
                src={selectedGig?.img || defaultGig}
                alt="Gig"
                className="w-1/3 rounded-lg shadow-md object-cover"
              />
              <div className="w-2/3 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-700 mt-1">
                    {selectedGig?.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Technologies</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedGig?.skills.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm font-medium"
                      >
                        {tag.skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Department</h4>
                    <p className="text-gray-700 mt-1">
                      {selectedGig?.department.name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Posted By</h4>
                    <p className="text-gray-700 mt-1">
                      {selectedGig?.userauth[0].fullName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Reward Points
                    </h4>
                    <p className="text-gray-700 mt-1">
                      {selectedGig?.rewardPoints}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Amount</h4>
                    <p className="text-gray-700 mt-1">{selectedGig?.amount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-between w-full">
          <Button
            onClick={() => setOpenModal(false)}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Close
          </Button>

          {user.role === "Employee" && (
            <div className="flex gap-4 ml-auto">
              <Button
                onClick={() => setOpenBidModal(true)} // Open bid modal
                className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 rounded-lg"
              >
                Bid
              </Button>

              <Button
                onClick={() => setOpenReferModal(true)} // Open refer modal
                className="bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200 rounded-lg"
              >
                Refer
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Bid Modal */}
      <Modal show={openBidModal} onClose={() => setOpenBidModal(false)}>
        <Modal.Header>Submit Your Bid</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              value={bidDescription}
              onChange={(e) => setBidDescription(e.target.value)}
              placeholder="Enter a short description for your bid"
              className="w-full"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setOpenBidModal(false)}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Close
          </Button>
          <Button
            onClick={async () => {
              // handle bid submission logic here
              console.log("Bid Description:", bidDescription);

              const response = await api.post(
                "api/bids/post",
                {
                  GigID: selectedGig.GigID,
                  EID: user.EID,
                  description: bidDescription,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );

              console.log(response);
              setOpenBidModal(false);
            }}
            className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 rounded-lg"
          >
            Submit Bid
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Refer Modal */}
      <Modal show={openReferModal} onClose={() => setOpenReferModal(false)}>
        <Modal.Header>Submit a Referral</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              value={referName}
              onChange={(e) => setReferName(e.target.value)}
              placeholder="Enter Name"
              className="w-full"
            />
            <TextInput
              value={referEmail}
              onChange={(e) => setReferEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full"
            />
            
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="gray"
            onClick={() => setOpenReferModal(false)}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              // handle refer submission logic here
              console.log("Referral Name:", referName);
              console.log("Referral Email:", referEmail);
              setOpenReferModal(false);
            }}
            className="bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200 rounded-lg"
          >
            Submit Referral
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllGigs;
