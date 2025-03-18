import React, { useState, useEffect } from "react";
import { TextInput, Button, Table, Modal } from "flowbite-react";
import { HiSearch, HiPencil } from "react-icons/hi";
import Paginate from "../components/Paginate";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    skills: [],
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [skillsToUpdate, setSkillsToUpdate] = useState([]);
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [skillsList, setSkillsList] = useState([]); // List of available skills
  const [weight, setWeight] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6); // Set number of users per page
  const navigate = useNavigate();

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(({ skill }) => skill !== skillToRemove),
    });
  };

  const handleAddSkill = () => {
    if (newSkill && weight && !isNaN(weight) && weight >= 0 && weight <= 100) {
      const newSkillObj = { skill: newSkill, score: parseFloat(weight) / 100 };
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkillObj],
      });
      setNewSkill("");
      setWeight("");
      setErrors({});
    } else {
      setErrors({
        skills: "Please enter a valid skill and weight between 0 and 100.",
      });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("api/users/users-under-manager", {
          withCredentials: true,
        });
        setUsers(response.data.docs);
        setFilteredUsers(response.data.docs);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setLoading(false);
      }
    };

    async function fetchSkills() {
      const response = await api.get("api/util/get-skills", {
        withCredentials: true,
      });
      setSkillsList(response.data); // Assuming data is an array of skill names
    }
    fetchSkills();

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        user.role.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUpdateSkills = async () => {
    try {
      console.log(formData.skills);
      await api.post(
        `api/users/update-user-skills/${selectedUser.EID}`,
        {
          skills: formData.skills,
        },
        {
          withCredentials: true,
        }
      );
      // After updating, refresh the user list or modify accordingly
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update skills:", err);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-slate-600 mb-4">
        Manage Users
      </h1>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-full sm:w-1/3">
          <TextInput
            type="text"
            placeholder="Search by name or role"
            value={searchTerm}
            onChange={handleSearch}
            icon={HiSearch}
            className="w-full"
          />
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Department</Table.HeadCell>
            <Table.HeadCell>Skills</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {currentUsers.map((user) => (
              <Table.Row key={user.EID} className="cursor-pointer">
                <Table.Cell
                  className="hover:underline font-extrabold text-base text-slate-500"
                  onClick={() => {
                    navigate(`/manager/users/${user.EID}`);
                  }}
                >
                  {user.fullName}
                </Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>{user.DID}</Table.Cell>
                <Table.Cell>
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-slate-600 px-2 py-1 rounded-full text-sm mr-2"
                    >
                      {skill.skill}
                    </span>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    className="bg-slate-500"
                    onClick={() => {
                      setSelectedUser(user);
                      setSkillsToUpdate(user.skills);
                      setShowModal(true);
                    }}
                  >
                    <HiPencil className="w-4 h-4 mr-2" /> Update Skills
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Pagination */}
      <Paginate
        currentPage={currentPage}
        totalUsers={filteredUsers.length}
        usersPerPage={usersPerPage}
        paginate={setCurrentPage}
      />

      {/* Update Skills Modal */}
      {showModal && selectedUser && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Update Skills for {selectedUser.fullName}</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600">Update Skills</label>

                {/* Dropdown to select skill */}
                <select
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                >
                  <option value="">Select a skill</option>
                  {skillsList.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>

                {/* Input for weight */}
                <div className="mt-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0"
                    max="100"
                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                    placeholder="Score (0-100%)"
                  />
                </div>

                {/* Add skill button */}
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="mt-2 inline-block bg-slate-500 text-white px-4 py-2 rounded-md"
                >
                  Add Skill
                </button>

                {/* Error message */}
                {errors.skills && (
                  <p className="mt-1 text-sm text-rose-500">{errors.skills}</p>
                )}
              </div>

              {/* Display the list of selected skills and their weights */}
              <div>
                <label className="text-sm text-gray-600">Selected Skills</label>
                <ul className="mt-2">
                  {formData.skills.map(({ skill, score }, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{skill}</span>
                      <span>{score}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-slate-400" onClick={handleUpdateSkills}>
              Update Skills
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
