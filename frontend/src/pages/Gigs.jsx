import { Card, Button, Modal, TextInput, Dropdown } from "flowbite-react";
import { HiSearch, HiX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigsAsync } from "../redux/slices/gigsSlice";
import { useNavigate } from "react-router-dom";
import Gig1 from "../assets/Gigs/Gig1.jpg";
import Gig2 from "../assets/Gigs/Gig2.jpg";
import Gig3 from "../assets/Gigs/Gig3.png";
import Gig4 from "../assets/Gigs/Gig4.webp";
import Gig5 from "../assets/Gigs/Gig5.png";
import Gig6 from "../assets/Gigs/Gig6.png";
import Gig7 from "../assets/Gigs/Gig7.jpg";
import Gig8 from "../assets/Gigs/Gig8.jpeg";
import Gig9 from "../assets/Gigs/Gig9.png";
import Gig10 from "../assets/Gigs/Gig10.jpeg";

const Gigss = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [Gigs, setGigs] = useState([]);
  const gigImages = [
    Gig1,
    Gig2,
    Gig3,
    Gig4,
    Gig5,
    Gig6,
    Gig7,
    Gig8,
    Gig9,
    Gig10,
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [openReferModal, setOpenReferModal] = useState(false);
  const [referName, setReferName] = useState("");
  const [referEmail, setReferEmail] = useState("");

  const handleOpenModal = (Gig) => {
    setSelectedGig(Gig);
    setOpenModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Extract the date part
  };

  useEffect(() => {
    const fetchGigs = async () => {
      const departmentNames = {};
      const response = await dispatch(fetchGigsAsync());
      if (response && response.payload && response.payload.docs) {
        const GigsData = await Promise.all(
          response.payload.docs.map(async (Gig) => {
            console.log(Gig.DID);
            const departmentResponse = await fetch(
              `http://localhost:3000/api/departments/${Gig.DID}`,
              { credentials: "include" }
            );
            const departmentData = await departmentResponse.json();
            departmentNames[Gig.department] = departmentData.name;
            const randomImage =
              gigImages[Math.floor(Math.random() * gigImages.length)];
            // console.log(departmentNames[Gig.department]);
            return {
              image: randomImage,
              postedBy: "",
              department: departmentNames[Gig.department] || Gig.department,
              projectTitle: Gig.title,
              description: Gig.description,
              tags: Gig.skillsRequired,
              status: Gig.ongoingStatus,
              points: String(Gig.rewardPoints || 0),
              deadline: Gig.deadline,
              amount: Gig.amount,
              assignedAt: Gig.assignedAt,
              rating: Gig.rating,
              feedback: Gig.feedback,
            };
          })
        );
        setGigs(GigsData);
      }
    };

    fetchGigs();
  }, [dispatch]);

  const showButtons =
    authState?.user?.role === "Employee" || authState?.user?.role === "Other";

  // const departments = [...new Set(Gigs.map((gig) => gig.department))];
  // const allSkills = [...new Set(Gigs.flatMap((gig) => gig.tags))];
  const departments =
    Gigs && Gigs.length > 0
      ? [...new Set(Gigs.map((gig) => gig.department))]
      : [];
  // console.log(departments);
  const allSkills =
    Gigs && Gigs.length > 0
      ? [...new Set(Gigs.flatMap((gig) => gig.skillsRequired))]
      : [];

  const filteredGigs = Gigs.filter((gig) => {
    const matchesSearch =
      gig.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || gig.department === selectedDepartment;
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => gig.tags.includes(skill));

    return matchesSearch && matchesDepartment && matchesSkills;
  });

  const handleReferExternalClick = (Gig) => {
    setSelectedGig(Gig);
    setOpenModal(false); // Close the card modal
    setOpenReferModal(true); // Open the refer external modal
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <TextInput
            icon={HiSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs..."
            className="w-full"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Dropdown label={selectedDepartment || "Select Department"}>
            <Dropdown.Item onClick={() => setSelectedDepartment("")}>
              All Departments
            </Dropdown.Item>
            {departments.map((dept) => (
              <Dropdown.Item
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept}
              </Dropdown.Item>
            ))}
          </Dropdown>

          <Dropdown label="Select Skills">
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
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    readOnly
                  />
                  {skill}
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown>

          {(selectedDepartment || selectedSkills.length > 0) && (
            <Button
              color="gray"
              onClick={() => {
                setSelectedDepartment("");
                setSelectedSkills([]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {selectedSkills.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <HiX
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedSkills((prev) => prev.filter((s) => s !== skill))
                  }
                />
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredGigs.map((Gig, index) => (
          <Card
            key={index}
            onClick={() => handleOpenModal(gig)}
            className="bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer border border-gray-200 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6 p-6">
              <div className="md:w-1/3">
                <div className="relative group">
                  <img
                    src={gig.image}
                    alt={gig.projectTitle}
                    className="w-full h-56 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-medium">
                      Posted by: {gig.postedBy}
                    </p>
                    <p className="text-gray-200 text-sm">{gig.department}</p>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                      {gig.projectTitle}
                    </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3 text-base leading-relaxed">
                    {gig.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {gig.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {tag}
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
                        {gig.points} Points
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
                      Deadline: {gig.deadline}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} size="xl">
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedGig?.projectTitle}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex gap-6">
              <img
                src={selectedGig?.image}
                alt="Gig"
                className="w-[250px] h-[200px] my-auto rounded-lg shadow-md object-cover"
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
                    {selectedGig?.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Department</h4>
                    <p className="text-gray-700 mt-1">
                      {selectedGig?.department}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Posted By</h4>
                    <p className="text-gray-700 mt-1">
                      {selectedGig?.postedBy}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Points</h4>
                    <p className="text-gray-700 mt-1">{selectedGig?.points}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Amount</h4>
                    <p className="text-gray-700 mt-1">{selectedGig?.amount}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deadline</h4>
                    <p className="text-gray-700 mt-1">
                      {formatDate(selectedGig?.deadline)}
                    </p>
                  </div>
                </div>
                {showButtons && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="bg-blue-200 text-green-900 hover:bg-green-300 rounded-full"
                      onClick={() => navigate("#")}
                    >
                      Add Request
                    </Button>
                    <Button
                      className="bg-green-300 text-green-900 hover:bg-green-400 rounded-full"
                      onClick={() => handleReferExternalClick(selectedGig)}
                    >
                      Refer External
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* refer external modal */}
      <Modal show={openReferModal} onClose={() => setOpenReferModal(false)}>
        <Modal.Header>Refer External</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              placeholder="Name"
              value={referName}
              onChange={(e) => setReferName(e.target.value)}
            />
            <TextInput
              placeholder="Email"
              value={referEmail}
              onChange={(e) => setReferEmail(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenReferModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle referral logic here (e.g., send data to backend)
              console.log("Referral:", referName, referEmail, selectedGig);
              setOpenReferModal(false);
              setReferName("");
              setReferEmail("");
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Gigss;
